<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'zooptima_db');
define('DB_USER', 'zooptima_user');
define('DB_PASS', 'your_password_here');

define('ADMIN_EMAIL', 'admin@zooptima.ru');

function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        return null;
    }
}

$createTableSQL = "
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(10) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    pet_name VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    comment TEXT,
    status ENUM('new', 'confirmed', 'completed', 'cancelled') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);";
?>