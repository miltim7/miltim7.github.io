<?php
// send-form.php

// Включаем отображение всех ошибок для отладки
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Настройки безопасности
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Функция для безопасного вывода JSON
function safeJsonResponse($data) {
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    safeJsonResponse([
        'success' => false,
        'message' => 'Метод не разрешен. Используйте POST.',
        'debug' => 'Method: ' . $_SERVER['REQUEST_METHOD']
    ]);
}

// Настройки Telegram бота
$telegram_bot_token = '7556604480:AAG7Zp38aRh8Rljdg4pBGPD_2b-QgmTOIZs';
$telegram_chat_id = '1454681697';

// Определяем режим работы
$is_local_server = (
    $_SERVER['SERVER_NAME'] === 'localhost' || 
    $_SERVER['SERVER_NAME'] === '127.0.0.1' ||
    strpos($_SERVER['SERVER_NAME'], 'localhost') !== false
);

try {
    // Получаем и валидируем данные формы
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Диагностическая информация
    $debug_info = [
        'server_info' => [
            'server_name' => $_SERVER['SERVER_NAME'] ?? 'unknown',
            'is_local_server' => $is_local_server,
            'php_version' => phpversion(),
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown'
        ],
        'php_settings' => [
            'allow_url_fopen' => ini_get('allow_url_fopen') ? 'enabled' : 'disabled',
            'openssl_loaded' => extension_loaded('openssl') ? 'yes' : 'no',
            'curl_available' => function_exists('curl_init') ? 'yes' : 'no',
            'user_agent' => ini_get('user_agent'),
            'max_execution_time' => ini_get('max_execution_time')
        ],
        'form_data' => [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'message_length' => strlen($message)
        ]
    ];

    // Проверяем обязательные поля
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'Имя не может быть пустым';
    } elseif (strlen($name) < 2) {
        $errors[] = 'Имя должно содержать минимум 2 символа';
    } elseif (!preg_match('/^[а-яёa-z\s\-]+$/iu', $name)) {
        $errors[] = 'Имя может содержать только буквы';
    }

    if (empty($email)) {
        $errors[] = 'Email не может быть пустым';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Некорректный формат email';
    }

    if (empty($phone)) {
        $errors[] = 'Телефон не может быть пустым';
    }

    if (!empty($message) && strlen($message) > 1000) {
        $errors[] = 'Сообщение не должно превышать 1000 символов';
    }

    // Если есть ошибки валидации
    if (!empty($errors)) {
        safeJsonResponse([
            'success' => false,
            'message' => 'Ошибки валидации: ' . implode(', ', $errors),
            'debug' => $debug_info
        ]);
    }

    // Защита от спама
    $session_started = false;
    if (function_exists('session_start')) {
        try {
            session_start();
            $session_started = true;
            $current_time = time();
            $last_submit_time = isset($_SESSION['last_submit']) ? $_SESSION['last_submit'] : 0;
            
            if ($current_time - $last_submit_time < 5) { // 5 секунд для тестирования
                safeJsonResponse([
                    'success' => false,
                    'message' => 'Пожалуйста, подождите 5 секунд перед повторной отправкой',
                    'debug' => $debug_info
                ]);
            }
        } catch (Exception $e) {
            $debug_info['session_error'] = $e->getMessage();
        }
    }

    // Формируем сообщение для лога
    $log_message = "\n" . str_repeat("=", 50) . "\n";
    $log_message .= "НОВАЯ ЗАЯВКА С САЙТА WEBDEV PRO\n";
    $log_message .= str_repeat("=", 50) . "\n";
    $log_message .= "Дата: " . date('d.m.Y H:i:s') . "\n";
    $log_message .= "Имя: " . $name . "\n";
    $log_message .= "Email: " . $email . "\n";
    $log_message .= "Телефон: " . $phone . "\n";
    if (!empty($message)) {
        $log_message .= "Сообщение: " . $message . "\n";
    }
    $log_message .= "IP: " . getUserIP() . "\n";
    $log_message .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "\n";
    $log_message .= str_repeat("=", 50) . "\n";

    // На локальном сервере сохраняем в файл и имитируем отправку
    if ($is_local_server) {
        // Создаем папку для логов если её нет
        $log_dir = __DIR__ . '/logs';
        if (!is_dir($log_dir)) {
            mkdir($log_dir, 0755, true);
        }
        
        // Сохраняем заявку в файл
        $log_file = $log_dir . '/contact_forms.log';
        file_put_contents($log_file, $log_message, FILE_APPEND | LOCK_EX);
        
        // Имитируем успешную отправку в Telegram
        $telegram_success = true;
        $telegram_message_id = rand(1000, 9999); // Имитируем ID сообщения
        
        $debug_info['local_mode'] = [
            'log_file' => $log_file,
            'log_written' => file_exists($log_file),
            'simulated_telegram' => true,
            'message' => 'На локальном сервере отправка в Telegram имитируется. Заявка сохранена в файл: ' . $log_file
        ];
        
    } else {
        // На продакшен сервере пытаемся отправить в Telegram
        $telegram_success = false;
        $telegram_message_id = null;
        
        // Формируем сообщение для Telegram
        $telegram_message = "🌟 *Новая заявка с сайта WebDev Pro*\n\n";
        $telegram_message .= "👤 *Имя:* " . $name . "\n";
        $telegram_message .= "📧 *Email:* " . $email . "\n";
        $telegram_message .= "📱 *Телефон:* " . $phone . "\n";
        
        if (!empty($message)) {
            $telegram_message .= "💬 *Сообщение:*\n" . $message . "\n";
        }
        
        $telegram_message .= "\n📅 *Дата:* " . date('d.m.Y H:i:s') . "\n";
        $telegram_message .= "🌐 *IP:* " . getUserIP();

        // Пытаемся отправить через cURL (если доступен)
        if (function_exists('curl_init')) {
            $telegram_success = sendTelegramViaCurl($telegram_bot_token, $telegram_chat_id, $telegram_message, $debug_info);
        } 
        // Или через file_get_contents (если настроен)
        elseif (ini_get('allow_url_fopen') && extension_loaded('openssl')) {
            $telegram_success = sendTelegramViaFileGetContents($telegram_bot_token, $telegram_chat_id, $telegram_message, $debug_info);
        } else {
            $debug_info['telegram_error'] = 'Ни cURL, ни file_get_contents не доступны для HTTPS запросов';
        }
    }

    // Отправляем email уведомление (если возможно)
    $email_sent = false;
    if (function_exists('mail')) {
        $to = 'timursailing70@gmail.com';
        $subject = 'Новая заявка с сайта WebDev Pro - ' . $name;
        $email_body = "Получена новая заявка с сайта:\n\n";
        $email_body .= "Имя: {$name}\n";
        $email_body .= "Email: {$email}\n";
        $email_body .= "Телефон: {$phone}\n";
        if (!empty($message)) {
            $email_body .= "Сообщение: {$message}\n";
        }
        $email_body .= "\nДата: " . date('d.m.Y H:i:s');
        $email_body .= "\nIP: " . getUserIP();
        
        $headers = [
            'From: noreply@webdevpro.ru',
            'Reply-To: ' . $email,
            'Content-Type: text/plain; charset=UTF-8',
            'X-Mailer: WebDevPro Contact Form'
        ];
        
        $email_sent = @mail($to, $subject, $email_body, implode("\r\n", $headers));
    }

    // Сохраняем время последней отправки
    if ($session_started) {
        $_SESSION['last_submit'] = time();
    }

    // Успешный ответ
    safeJsonResponse([
        'success' => true,
        'message' => $is_local_server 
            ? 'Заявка сохранена! На локальном сервере Telegram отправка имитируется.' 
            : 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
        'data' => [
            'telegram_sent' => $telegram_success,
            'telegram_message_id' => $telegram_message_id,
            'email_sent' => $email_sent,
            'is_local_mode' => $is_local_server,
            'timestamp' => date('Y-m-d H:i:s')
        ],
        'debug' => $debug_info
    ]);

} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    
    safeJsonResponse([
        'success' => false,
        'message' => 'Произошла ошибка: ' . $e->getMessage(),
        'error_code' => 'EXCEPTION_ERROR',
        'debug' => [
            'exception_file' => $e->getFile(),
            'exception_line' => $e->getLine()
        ]
    ]);
}

/**
 * Отправка через cURL
 */
function sendTelegramViaCurl($token, $chat_id, $message, &$debug_info) {
    $url = "https://api.telegram.org/bot{$token}/sendMessage";
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => [
            'chat_id' => $chat_id,
            'text' => $message,
            'parse_mode' => 'Markdown'
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT => 30
    ]);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    $debug_info['curl_attempt'] = [
        'http_code' => $http_code,
        'error' => $error,
        'response_length' => strlen($response ?: '')
    ];

    if ($error || $http_code !== 200) {
        return false;
    }

    $result = json_decode($response, true);
    return isset($result['ok']) && $result['ok'];
}

/**
 * Отправка через file_get_contents
 */
function sendTelegramViaFileGetContents($token, $chat_id, $message, &$debug_info) {
    $url = "https://api.telegram.org/bot{$token}/sendMessage";
    
    $data = http_build_query([
        'chat_id' => $chat_id,
        'text' => $message,
        'parse_mode' => 'Markdown'
    ]);

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => $data,
            'timeout' => 30
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);

    $response = @file_get_contents($url, false, $context);
    
    $debug_info['file_get_contents_attempt'] = [
        'response_received' => $response !== false,
        'response_length' => $response ? strlen($response) : 0
    ];

    if ($response === false) {
        return false;
    }

    $result = json_decode($response, true);
    return isset($result['ok']) && $result['ok'];
}

/**
 * Получение IP адреса пользователя
 */
function getUserIP() {
    $ip_fields = [
        'HTTP_CF_CONNECTING_IP',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_FORWARDED',
        'HTTP_X_CLUSTER_CLIENT_IP',
        'HTTP_FORWARDED_FOR',
        'HTTP_FORWARDED',
        'HTTP_CLIENT_IP',
        'REMOTE_ADDR'
    ];
    
    foreach ($ip_fields as $field) {
        if (!empty($_SERVER[$field])) {
            $ips = explode(',', $_SERVER[$field]);
            $ip = trim($ips[0]);
            
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}
?>