<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'db.php';
require_once 'VideoController.php';

/** @var PDO $pdo */
$controller = new VideoController($pdo);
$method = $_SERVER['REQUEST_METHOD'];

// Простий роутинг
if ($method === 'GET') {
    // Зчитуємо параметр 'q' з URL, якщо він існує
    $searchQuery = $_GET['q'] ?? null;

    // Передаємо параметр у метод і повертаємо JSON
    echo json_encode($controller->getAllVideos($searchQuery));

} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($controller->createVideo($data)) {
        echo json_encode(["status" => "created"]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Failed to create video"]);
    }
}