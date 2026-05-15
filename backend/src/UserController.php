<?php

class UserController {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    // Приватний метод для генерації токена за стандартом HS256
    private function generateJWT(array $payload): string {
        // Отримуємо секретний ключ. Якщо його немає в .env, викидаємо помилку.
        $secret = getenv('JWT_SECRET');
        if (!$secret) {
            throw new Exception('JWT_SECRET не налаштовано в середовищі');
        }

        // 1. Створення Header
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));

        // 2. Створення Payload
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));

        // 3. Створення Signature (Підпис)
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        // Збираємо токен з трьох частин
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public function register(array $data): array {
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            return ['status' => 400, 'body' => ['error' => 'Відсутні обов\'язкові поля']];
        }

        $name = trim($data['name']);
        $email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
        $password = $data['password'];

        if (!$email) {
            return ['status' => 400, 'body' => ['error' => 'Некоректний формат email']];
        }

        try {
            $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = :email");
            $stmt->execute(['email' => $email]);

            if ($stmt->fetch()) {
                return ['status' => 409, 'body' => ['error' => 'Користувач з таким email вже існує']];
            }

            $passwordHash = password_hash($password, PASSWORD_BCRYPT);

            $insertStmt = $this->pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :password_hash)");
            $insertStmt->execute([
                'name' => $name,
                'email' => $email,
                'password_hash' => $passwordHash
            ]);

            return ['status' => 201, 'body' => ['message' => 'Користувача успішно створено']];

        } catch (PDOException $e) {
            return ['status' => 500, 'body' => ['error' => 'Внутрішня помилка сервера: ' . $e->getMessage()]];
        }
    }

    public function login(array $data): array {
        if (empty($data['email']) || empty($data['password'])) {
            return ['status' => 400, 'body' => ['error' => 'Відсутні email або пароль']];
        }

        $email = trim($data['email']);
        $password = $data['password'];

        try {
            $stmt = $this->pdo->prepare("SELECT id, name, email, role, password_hash FROM users WHERE email = :email");
            $stmt->execute(['email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user || !password_verify($password, $user['password_hash'])) {
                return ['status' => 401, 'body' => ['error' => 'Невірний email або пароль']];
            }

            unset($user['password_hash']);

            // Формуємо корисне навантаження токена (Payload)
            $payload = [
                'iat' => time(), // Час створення (Issued At)
                'exp' => time() + (60 * 60 * 24), // Час закінчення дії (Expiration Time) - 24 години
                'sub' => $user['id'], // Subject (ідентифікатор користувача)
                'role' => $user['role'] // Роль користувача для швидкої перевірки прав
            ];

            // Генеруємо токен
            $token = $this->generateJWT($payload);

            return [
                'status' => 200,
                'body' => [
                    'message' => 'Вхід успішний',
                    'user' => $user,
                    'token' => $token // Повертаємо токен на клієнт
                ]
            ];

        } catch (PDOException $e) {
            return ['status' => 500, 'body' => ['error' => 'Внутрішня помилка сервера: ' . $e->getMessage()]];
        }
    }
}