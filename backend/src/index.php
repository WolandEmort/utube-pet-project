<?php
// Налаштування CORS
// Рекомендується замінити '*' на точний URL фронтенду (наприклад, 'http://localhost:5173') на продакшені
// header("Access-Control-Allow-Origin: http://localhost:5173");
// header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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
require_once 'HistoryController.php';

/** @var PDO $pdo */
$videoController = new VideoController($pdo);
$userController = new UserController($pdo);
$historyController = new HistoryController($pdo);

// 1. Функція для отримання токена з HTTP-заголовків
function getBearerToken(): ?string {
    // Вбудована функція apache_request_headers() або getallheaders() для отримання заголовків
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        return $matches[1];
    }
    return null;
}

// 2. Функція для розшифровки та валідації JWT
function validateJWT(?string $token): ?array {
    if (!$token) return null;

    $secret = getenv('JWT_SECRET');
    if (!$secret) return null;

    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;

    // Перевірка підпису (Signature)
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $expectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    // hash_equals захищає від timing attacks (атак за часом)
    if (!hash_equals($expectedSignature, $base64UrlSignature)) {
        return null; // Підпис недійсний
    }

    // Декодування Payload
    $payloadString = base64_decode(str_replace(['-', '_'], ['+', '/'], $base64UrlPayload));
    $payload = json_decode($payloadString, true);

    // Перевірка терміну дії (Expiration)
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return null; // Токен протермінований
    }

    return $payload;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Роутинг

// Публічні маршрути (Не потребують JWT)
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

// Приватні маршрути (Потребують JWT)
} else {
    // Централізована перевірка токена для всіх наступних маршрутів
    $token = getBearerToken();
    $userData = validateJWT($token);

    if (!$userData) {
        http_response_code(401); // Unauthorized
        echo json_encode(["error" => "Не авторизовано або токен протермінований"]);
        exit;
    }

    // Маршрути для авторизованих користувачів
    if ($method === 'POST' && $uri === '/history') {
        $data = json_decode(file_get_contents('php://input'), true);
        // Захист: користувач може записувати історію тільки для свого ID, який береться з Payload токена
        $data['user_id'] = $userData['sub'];

        $result = $historyController->recordView($data);
        http_response_code($result['status']);
        echo json_encode($result['body']);

    } elseif ($method === 'GET' && $uri === '/history') {
        // ID береться з токена, а не з GET параметра, щоб не можна було прочитати чужу історію
        $userId = $userData['sub'];
        $history = $historyController->getUserHistory($userId);

        if (isset($history['error'])) {
            http_response_code(500);
            echo json_encode(["error" => $history['error']]);
        } else {
            http_response_code(200);
            echo json_encode($history);
        }

    // Адміністративні маршрути (Потребують JWT + role = 'admin')
    } else {
        if ($userData['role'] !== 'admin') {
            http_response_code(403); // Forbidden
            echo json_encode(["error" => "Недостатньо прав для виконання операції"]);
            exit;
        }

        if ($method === 'POST' && $uri === '/') {
            $data = json_decode(file_get_contents('php://input'), true);
            if ($videoController->createVideo($data)) {
                http_response_code(201);
                echo json_encode(["status" => "created"]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Failed to create video"]);
            }

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
    }
}