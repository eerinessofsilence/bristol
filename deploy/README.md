# Розгортання на VPS

1. Скопіюйте `nginx/cleargatecustoms.com.ua.conf` до
   `/etc/nginx/sites-available/cleargatecustoms.com.ua` та увімкніть його:

   ```bash
   sudo ln -s /etc/nginx/sites-available/cleargatecustoms.com.ua /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

2. Запустіть застосунок у каталозі проєкту:

   ```bash
   docker compose up -d --build
   ```

   Фронтенд буде доступний лише локально на `127.0.0.1:5173`; БД та API назовні не
   публікуються.

3. Після того як A-записи `cleargatecustoms.com.ua` і `www` спрямовані на IP VPS,
   випустіть сертифікат:

   ```bash
   sudo certbot --nginx -d cleargatecustoms.com.ua -d www.cleargatecustoms.com.ua
   ```
