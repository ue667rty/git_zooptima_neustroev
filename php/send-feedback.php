<?php
require_once 'config.php';

header('Content-Type: application/json');

$name = trim($_POST['fbName'] ?? '');
$contact = trim($_POST['fbContact'] ?? '');
$subject = trim($_POST['fbSubject'] ?? '');
$message = trim($_POST['fbMessage'] ?? '');

if (empty($name) || empty($contact) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Заполните все поля']);
    exit;
}

$to = ADMIN_EMAIL;
$emailSubject = "Обратная связь Zoóptima: $subject";
$body = "Имя: $name\nКонтакт: $contact\n\nСообщение:\n$message";
$headers = "From: feedback@zooptima.ru\r\nReply-To: $contact";

$success = mail($to, $emailSubject, $body, $headers);

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Сообщение отправлено']);
} else {
    $logEntry = date('Y-m-d H:i:s') . " | $name | $contact | $subject | $message" . PHP_EOL;
    file_put_contents('feedback.log', $logEntry, FILE_APPEND);
    echo json_encode(['success' => true, 'message' => 'Сообщение отправлено (демо-режим)']);
}
?>