<?php

class UserController {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
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

            // Тут role не передаємо, оскільки БД автоматично підставить дефолтне значення 'user'
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
            // Додано поле role до вибірки
            $stmt = $this->pdo->prepare("SELECT id, name, email, role, password_hash FROM users WHERE email = :email");
            $stmt->execute(['email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user || !password_verify($password, $user['password_hash'])) {
                return ['status' => 401, 'body' => ['error' => 'Невірний email або пароль']];
            }

            unset($user['password_hash']);

            return [
                'status' => 200,
                'body' => [
                    'message' => 'Вхід успішний',
                    'user' => $user
                ]
            ];

        } catch (PDOException $e) {
            return ['status' => 500, 'body' => ['error' => 'Внутрішня помилка сервера: ' . $e->getMessage()]];
        }
    }
}