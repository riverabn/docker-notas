# ---------- ETAPA 1: instalar dependencias de Composer ----------
FROM composer:2 AS vendor
WORKDIR /app

# Primero solo composer.json/lock (aprovecha la caché de capas)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction --ignore-platform-reqs

# Luego el código, y se genera el autoload optimizado
COPY . .
RUN composer dump-autoload --no-dev --optimize --no-scripts

# ---------- ETAPA 2: imagen final de producción ----------
FROM php:8.4-fpm-alpine
WORKDIR /var/www/html

# pdo_mysql es la única que hay que instalar; el resto ya viene en la imagen oficial
RUN docker-php-ext-install pdo_mysql \
    && php -m | grep -E "pdo_mysql|mbstring|openssl|tokenizer|xml|ctype|json"

# Solo copiamos vendor/ desde la etapa de build (sin Composer en la imagen final)
COPY --from=vendor /app/vendor ./vendor
COPY . .

RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000

# Migra la base de datos y arranca PHP-FPM
CMD ["sh", "-c", "php artisan migrate --force && php-fpm"]