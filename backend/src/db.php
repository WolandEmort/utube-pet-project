<?php
// db.php

// 1. Функція для базового парсингу .env файлу
function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        return;
    }

    // Читаємо файл по рядках, ігноруючи порожні рядки
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Ігноруємо коментарі
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Розбиваємо рядок на ключ та значення по першому знаку '='
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            // Записуємо у змінні оточення
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

// Завантажуємо .env файл, який знаходиться в тій самій директорії
loadEnv(__DIR__ . '/.env');

// 2. Зчитуємо дані через getenv(). Якщо змінної немає, використовуємо null або дефолтне значення.
// Дефолтні значення залишені тільки для хоста та порту, оскільки вони не є секретними.
$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '5432';
$db   = getenv('DB_NAME');
$user = getenv('DB_USER');
$pass = getenv('DB_PASS');

if (!$db || !$user || !$pass) {
    throw new Exception("Критична помилка: Не задані змінні оточення для підключення до БД.");
}

$dsn = "pgsql:host=$host;port=$port;dbname=$db";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}