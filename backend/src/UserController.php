<?php

class UserController {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function register(array $data): array {
        // 1. Перевірка наявності необхідних ключів
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            return ['status' => 400, 'body' => ['error' => 'Відсутні обов\'язкові поля']];
        }

        $name = trim($data['name']);
        // 2. Вбудована PHP валідація формату email
        $email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
        $password = $data['password'];

        if (!$email) {
            return ['status' => 400, 'body' => ['error' => 'Некоректний формат email']];
        }

        try {
            // 3. Перевірка дублювання email
            $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = :email");
            $stmt->execute(['email' => $email]);

            if ($stmt->fetch()) {
                return ['status' => 409, 'body' => ['error' => 'Користувач з таким email вже існує']];
            }

            // 4. Генерація криптографічного хешу
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);

            // 5. Виконання транзакції запису
            $insertStmt = $this->pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :password_hash)");
            $insertStmt->execute([
                'name' => $name,
                'email' => $email,
                'password_hash' => $passwordHash
            ]);

            return ['status' => 201, 'body' => ['message' => 'Користувача успішно створено']];

        } catch (PDOException $e) {
            // Перехоплення технічних помилок рівня бази даних
            return ['status' => 500, 'body' => ['error' => 'Внутрішня помилка сервера: ' . $e->getMessage()]];
        }
    }

    public function login(array $data): array {
        // 1. Перевірка наявності необхідних ключів
        if (empty($data['email']) || empty($data['password'])) {
            return ['status' => 400, 'body' => ['error' => 'Відсутні email або пароль']];
        }

        $email = trim($data['email']);
        $password = $data['password'];

        try {
            // 2. Пошук користувача за email
            $stmt = $this->pdo->prepare("SELECT id, name, email, password_hash FROM users WHERE email = :email");
            $stmt->execute(['email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // 3. Перевірка існування користувача та валідація хешу
            // Функція password_verify сама витягує сіль з хешу і перевіряє збіг
            if (!$user || !password_verify($password, $user['password_hash'])) {
                // Навмисно повертаємо загальну помилку для безпеки (щоб не розкривати, чи існує такий email)
                return ['status' => 401, 'body' => ['error' => 'Невірний email або пароль']];
            }

            // 4. Видаляємо хеш пароля перед відправкою даних на клієнт (безпека)
            unset($user['password_hash']);

            // 5. Повертаємо дані користувача (пізніше тут ми додамо генерацію JWT токена)
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