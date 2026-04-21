<?php
require_once 'config.php';

header('Content-Type: application/json');

$data = [
    'service' => $_POST['service'] ?? '',
    'date' => $_POST['date'] ?? '',
    'time' => $_POST['time'] ?? '',
    'owner_name' => trim($_POST['ownerName'] ?? ''),
    'phone' => trim($_POST['phone'] ?? ''),
    'pet_name' => trim($_POST['petName'] ?? ''),
    'breed' => trim($_POST['breed'] ?? ''),
    'comment' => trim($_POST['comment'] ?? '')
];

$errors = [];
foreach (['service', 'date', 'time', 'owner_name', 'phone', 'pet_name'] as $field) {
    if (empty($data[$field])) {
        $errors[] = "Поле " . str_replace('_', ' ', $field) . " обязательно";
    }
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

$pdo = getDBConnection();

if ($pdo) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO appointments (service, date, time, owner_name, phone, pet_name, breed, comment)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['service'], $data['date'], $data['time'],
            $data['owner_name'], $data['phone'], $data['pet_name'],
            $data['breed'], $data['comment']
        ]);
        
        $to = ADMIN_EMAIL;
        $subject = "Новая запись в Zoóptima";
        $message = "Новая запись на приём:\n\n";
        $message .= "Услуга: " . $data['service'] . "\n";
        $message .= "Дата: " . $data['date'] . "\n";
        $message .= "Время: " . $data['time'] . "\n";
        $message .= "Владелец: " . $data['owner_name'] . "\n";
        $message .= "Телефон: " . $data['phone'] . "\n";
        $message .= "Питомец: " . $data['pet_name'] . "\n";
        $message .= "Порода: " . ($data['breed'] ?: 'не указана') . "\n";
        $message .= "Комментарий: " . ($data['comment'] ?: 'нет') . "\n";
        
        mail($to, $subject, $message, "From: booking@zooptima.ru\r\n");
        
        echo json_encode(['success' => true, 'message' => 'Запись успешно создана']);
        
    } catch (PDOException $e) {
        error_log("DB Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Ошибка базы данных']);
    }
} else {
    $logEntry = date('Y-m-d H:i:s') . " | " . json_encode($data) . PHP_EOL;
    file_put_contents('appointments.log', $logEntry, FILE_APPEND);
    echo json_encode(['success' => true, 'message' => 'Запись успешно создана (демо-режим)']);
}
?>