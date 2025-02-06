<?php
$to = "dial688@mail.ru";

if (!empty($_POST['honeypot'])) {
    exit;
}

function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

$name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
$message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';

$body = "
Имя: $name
Email: $email
Номер телефона: $phone
Сообщение: $message
";

$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$subject = "Новое сообщение из сайта А3-Консалт";

if (mail($to, $subject, $body, $headers)) {
    header("Location: /");
    exit;
} else {
    echo "При отправке сообщения возникли ошибки.";
}
?>
