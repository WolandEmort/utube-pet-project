<?php

class HistoryController {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    // Запис або оновлення історії перегляду (UPSERT)
    public function recordView(array $data): array {
        if (empty($data['user_id']) || empty($data['video_id'])) {
            return ['status' => 400, 'body' => ['error' => 'Відсутні user_id або video_id']];
        }

        try {
            // Конструкція ON CONFLICT вимагає наявності UNIQUE обмеження, яке ми щойно додали
            $stmt = $this->pdo->prepare("
                INSERT INTO view_history (user_id, video_id, viewed_at)
                VALUES (:user_id, :video_id, CURRENT_TIMESTAMP)
                ON CONFLICT (user_id, video_id)
                DO UPDATE SET viewed_at = CURRENT_TIMESTAMP
            ");

            $stmt->execute([
                'user_id' => $data['user_id'],
                'video_id' => $data['video_id']
            ]);

            return ['status' => 200, 'body' => ['status' => 'recorded']];

        } catch (PDOException $e) {
            return ['status' => 500, 'body' => ['error' => 'Внутрішня помилка сервера: ' . $e->getMessage()]];
        }
    }

    // Отримання списку переглянутих відео для конкретного користувача
    public function getUserHistory(string $userId): array {
        try {
            // Виконуємо INNER JOIN з таблицею videos, щоб повернути не просто ID, а повні дані відео
            $stmt = $this->pdo->prepare("
                SELECT v.*, h.viewed_at
                FROM videos v
                JOIN view_history h ON v.id = h.video_id
                WHERE h.user_id = :user_id
                ORDER BY h.viewed_at DESC
            ");

            $stmt->execute(['user_id' => $userId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }
}