FROM php:8.2-cli

# Встановлюємо системні залежності для PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Встановлюємо робочу директорію
WORKDIR /var/www/html

# Копіюємо код бекенду в контейнер
COPY . .

# Запускаємо вбудований PHP сервер на порту 8080
CMD ["php", "-S", "0.0.0.0:8080", "-t", "src"]