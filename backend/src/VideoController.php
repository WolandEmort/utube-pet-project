<?php
// VideoController.php
class VideoController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Отримати всі відео (для головної сторінки)
    public function getAllVideos($searchQuery = null) {
        if ($searchQuery) {
            // Використовуємо ILIKE для пошуку без урахування регістру (PostgreSQL специфіка)
            // Знаки % означають, що текст може знаходитись у будь-якому місці рядка
            $sql = "SELECT * FROM videos 
                WHERE title ILIKE :search 
                   OR channel_name ILIKE :search 
                   OR category ILIKE :search";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['search' => '%' . $searchQuery . '%']);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        // Якщо пошукового запиту немає, віддаємо всі відео (як раніше)
        $stmt = $this->pdo->query("SELECT * FROM videos");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Додати нове відео (для адмін-панелі)
    public function createVideo($data) {
        $sql = "INSERT INTO videos (id, title, description, channel_name, thumbnail_url, category) 
                VALUES (:id, :title, :description, :channel_name, :thumbnail_url, :category)";

        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':id' => $data['id'], // наприклад, YouTube ID
            ':title' => $data['title'],
            ':description' => $data['description'],
            ':channel_name' => $data['channel_name'],
            ':thumbnail_url' => $data['thumbnail_url'],
            ':category' => $data['category']
        ]);
    }
    public function deleteVideo(string $id): bool {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM videos WHERE id = :id");
            return $stmt->execute(['id' => $id]);
        } catch (PDOException $e) {
            return false;
        }
    }

    public function updateVideo(string $id, array $data): bool {
        try {
            $stmt = $this->pdo->prepare("
                UPDATE videos
                SET title = :title,
                    description = :description,
                    channel_name = :channel_name,
                    thumbnail_url = :thumbnail_url,
                    category = :category
                WHERE id = :id
            ");

            return $stmt->execute([
                'id' => $id,
                'title' => $data['title'],
                'description' => $data['description'] ?? '',
                'channel_name' => $data['channel_name'],
                'thumbnail_url' => $data['thumbnail_url'] ?? '',
                'category' => $data['category'] ?? 'General'
            ]);
        } catch (PDOException $e) {
            return false;
        }
    }


}