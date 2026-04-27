<?php
header('Content-Type: application/json');

$service = $_POST['service'] ?? '';
$date = $_POST['date'] ?? '';
$time = $_POST['time'] ?? '';
$ownerName = trim($_POST['ownerName'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$petName = trim($_POST['petName'] ?? '');
$breed = trim($_POST['breed'] ?? '');
$comment = trim($_POST['comment'] ?? '');

$errors = [];
if (empty($service)) $errors[] = 'Не выбрана услуга';
if (empty($date)) $errors[] = 'Не выбрана дата';
if (empty($time)) $errors[] = 'Не выбрано время';
if (empty($ownerName)) $errors[] = 'Не указано имя';
if (empty($phone)) $errors[] = 'Не указан телефон';
if (empty($petName)) $errors[] = 'Не указано имя питомца';

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=zooptima_db;charset=utf8mb4",
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    $stmt = $pdo->prepare("SELECT id FROM services WHERE name = ? OR name LIKE ? LIMIT 1");
    $stmt->execute([$service, "%$service%"]);
    $serviceRow = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($serviceRow) {
        $serviceId = $serviceRow['id'];
    } else {
        $stmt = $pdo->prepare("INSERT INTO services (name, price) VALUES (?, 0)");
        $stmt->execute([$service]);
        $serviceId = $pdo->lastInsertId();
    }
    
    $stmt = $pdo->prepare("SELECT id FROM clients WHERE phone = ?");
    $stmt->execute([$phone]);
    $client = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($client) {
        $clientId = $client['id'];
    } else {
        $firstName = explode(' ', $ownerName)[0];
        $lastName = explode(' ', $ownerName)[1] ?? '';
        $stmt = $pdo->prepare("INSERT INTO clients (first_name, last_name, phone) VALUES (?, ?, ?)");
        $stmt->execute([$firstName, $lastName, $phone]);
        $clientId = $pdo->lastInsertId();
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO appointments (client_id, service_id, pet_name, pet_breed, appointment_date, appointment_time, comment)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$clientId, $serviceId, $petName, $breed, $date, $time, $comment]);
    
    echo json_encode(['success' => true, 'message' => 'Запись создана', 'id' => $pdo->lastInsertId()]);
    
} catch (PDOException $e) {
    $log = date('Y-m-d H:i:s') . " | $service | $date | $time | $ownerName | $phone | $petName\n";
    file_put_contents(__DIR__ . '/appointments.log', $log, FILE_APPEND);
    echo json_encode(['success' => true, 'message' => 'Запись создана (демо-режим)']);
}
?>