<?php
// Налаштування CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS"); // Додано DELETE
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Обробка Preflight-запиту від браузера
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';
require_once 'VideoController.php';
require_once 'UserController.php';
require_once 'HistoryController.php';

/** @var PDO $pdo */
$videoController = new VideoController($pdo);
$userController = new UserController($pdo);
$historyController = new HistoryController($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Роутинг
if ($method === 'GET' && $uri === '/') {
    $searchQuery = $_GET['q'] ?? null;
    echo json_encode($videoController->getAllVideos($searchQuery));

} elseif ($method === 'POST' && $uri === '/register') {
    $data = json_decode(file_get_contents('php://input'), true);
    $result = $userController->register($data);
    http_response_code($result['status']);
    echo json_encode($result['body']);

} elseif ($method === 'POST' && $uri === '/login') {
    $data = json_decode(file_get_contents('php://input'), true);
    $result = $userController->login($data);
    http_response_code($result['status']);
    echo json_encode($result['body']);

} elseif ($method === 'POST' && $uri === '/') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($videoController->createVideo($data)) {
        http_response_code(201);
        echo json_encode(["status" => "created"]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Failed to create video"]);
    }

} elseif ($method === 'POST' && $uri === '/history') {
    $data = json_decode(file_get_contents('php://input'), true);
    $result = $historyController->recordView($data);
    http_response_code($result['status']);
    echo json_encode($result['body']);

} elseif ($method === 'GET' && $uri === '/history') {
    $userId = $_GET['user_id'] ?? null;
    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "Відсутній параметр user_id"]);
    } else {
        $history = $historyController->getUserHistory($userId);
        if (isset($history['error'])) {
            http_response_code(500);
            echo json_encode(["error" => $history['error']]);
        } else {
            http_response_code(200);
            echo json_encode($history);
        }
    }

// НОВИЙ МАРШРУТ: Видалення відео
} elseif ($method === 'DELETE' && preg_match('/^\/videos\/([^\/]+)$/', $uri, $matches)) {
    $videoId = $matches[1];

    if ($videoController->deleteVideo($videoId)) {
        http_response_code(200);
        echo json_encode(["status" => "deleted"]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Failed to delete video"]);
    }

} elseif ($method === 'PUT' && preg_match('/^\/videos\/([^\/]+)$/', $uri, $matches)) {
    // Оновлення відео
    $videoId = $matches[1];
    $data = json_decode(file_get_contents('php://input'), true);

    if ($videoController->updateVideo($videoId, $data)) {
        http_response_code(200);
        echo json_encode(["status" => "updated"]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Failed to update video"]);
    }

} else {
    http_response_code(404);
    echo json_encode(["error" => "Not Found"]);
}