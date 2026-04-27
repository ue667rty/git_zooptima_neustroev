<?php
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'zooptima_db');
    define('DB_USER', 'root');
    define('DB_PASS', '');

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
            error_log("Database error: " . $e->getMessage());
            return null;
        }
    }

    $sql = "

    -- Таблица 1: Услуги (справочник)
    CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL COMMENT 'Название услуги',
        description TEXT COMMENT 'Описание услуги',
        price DECIMAL(10, 2) NOT NULL COMMENT 'Стоимость',
        category ENUM('therapy', 'surgery', 'vaccination', 'dentistry', 'diagnostic') DEFAULT 'therapy',
        duration_minutes INT DEFAULT 30 COMMENT 'Длительность приёма в минутах',
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Таблица 2: Клиенты (владельцы животных)
    CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_phone (phone)
    );

    -- Таблица 3: Записи на приём (связывает клиентов и услуги)
    CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL COMMENT 'ID клиента из таблицы clients',
        service_id INT NOT NULL COMMENT 'ID услуги из таблицы services',
        pet_name VARCHAR(100) NOT NULL COMMENT 'Имя питомца',
        pet_type ENUM('cat', 'dog', 'bird', 'rodent', 'reptile', 'other') DEFAULT 'cat',
        pet_breed VARCHAR(100),
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
        INDEX idx_date (appointment_date),
        INDEX idx_status (status),
        INDEX idx_client (client_id)
    );
    ";

    function initDatabase() {
        global $sql;
        $pdo = getDBConnection();
        if ($pdo) {
            try {
                $pdo->exec($sql);
                error_log("Database initialized successfully");
                return true;
            } catch (PDOException $e) {
                error_log("DB Init Error: " . $e->getMessage());
                return false;
            }
        }
        return false;
    }
?>