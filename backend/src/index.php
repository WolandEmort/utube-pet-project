<?php
// Налаштування CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Обробка Preflight-запиту від браузера
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';
require_once 'VideoController.php';
require_once 'UserController.php';

/** @var PDO $pdo */
$videoController = new VideoController($pdo);
$userController = new UserController($pdo);

$method = $_SERVER['REQUEST_METHOD'];
// Отримуємо чистий шлях без GET-параметрів (наприклад, '/register' з '/register?foo=bar')
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Роутинг
if ($method === 'GET' && $uri === '/') {
    // Отримання/пошук відео
    $searchQuery = $_GET['q'] ?? null;
    echo json_encode($videoController->getAllVideos($searchQuery));

} elseif ($method === 'POST' && $uri === '/register') {
    // Реєстрація користувача
    $data = json_decode(file_get_contents('php://input'), true);
    $result = $userController->register($data);

    http_response_code($result['status']);
    echo json_encode($result['body']);

} elseif ($method === 'POST' && $uri === '/login') {
    // Авторизація користувача
    $data = json_decode(file_get_contents('php://input'), true);
    $result = $userController->login($data);

    http_response_code($result['status']);
    echo json_encode($result['body']);

} elseif ($method === 'POST' && $uri === '/') {
    // Створення відео
    $data = json_decode(file_get_contents('php://input'), true);
    if ($videoController->createVideo($data)) {
        http_response_code(201);
        echo json_encode(["status" => "created"]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Failed to create video"]);
    }

} else {
    // Якщо жоден маршрут не співпав
    http_response_code(404);
    echo json_encode(["error" => "Not Found"]);
}