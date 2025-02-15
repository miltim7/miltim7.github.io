<?php
$to = "вашэмейл@gmail.com";

if (!empty($_POST['honeypot'])) {
    exit;
}

function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

$username = isset($_POST['username']) ? sanitize_input($_POST['username']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';

$body = "
Username: $username
Email: $email
Message: $message
";

$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$subject = "Вопрос с сайта Design Way";

if (mail($to, $subject, $body, $headers)) {
    header("Location: /");
    exit;
} else {
    echo "При отправке сообщения возникли ошибки.";
}
?>
