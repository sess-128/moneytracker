# Инструкция по применению миграций v1.1.x

## Обзор

Миграции v1.1.x добавляют таблицу `users` и поддержку многопользовательской системы. Существующие данные (категории и транзакции) сохраняются и привязываются к первому созданному пользователю.

## Структура миграций

```
v1.1.0 → Создание таблицы users
   ↓
v1.1.1 → Добавление user_id (nullable) в категории и транзакции
   ↓
[РУЧНОЙ ЭТАП] → Создание пользователя + привязка данных
   ↓
v1.1.2 → Завершение: NOT NULL, внешние ключи
```

## Пошаговая инструкция

### Шаг 1: Применить миграции v1.1.0 и v1.1.1

```bash
# Запустить приложение (Liquibase применит миграции автоматически)
mvn spring-boot:run

# ИЛИ вручную через Liquibase
mvn liquibase:update -Dliquibase.changeLogFile=db/changelog/db.changelog-master.xml
```

После этого шага:
- ✅ Таблица `users` создана
- ✅ Колонки `user_id` добавлены в `categories` и `transactions` (как `nullable`)
- ⚠️ Существующие данные имеют `user_id = NULL`

---

### Шаг 2: Создать первого пользователя

Создайте пользователя через API регистрации:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "secure-password"
  }'
```

Или через ваш фронтенд/клиент.

---

### Шаг 3: Узнать ID созданного пользователя

```sql
SELECT id, name, email FROM users ORDER BY id LIMIT 1;
```

Запомните ID (обычно это `1`).

---

### Шаг 4: Выполнить скрипт привязки данных

Откройте файл `data-migration.sql` и замените `:USER_ID` на актуальный ID:

```sql
-- Замените 1 на ваш ID пользователя
UPDATE categories SET user_id = 1 WHERE user_id IS NULL;
UPDATE transactions SET user_id = 1 WHERE user_id IS NULL;
```

Выполните скрипт через psql или другую утилиту:

```bash
psql -U your_user -d your_database -f src/main/resources/db/changelog/data-migration.sql
```

Или вручную в SQL-клиенте.

---

### Шаг 5: Применить миграцию v1.1.2

```bash
# Перезапустить приложение или
mvn liquibase:update
```

После этого шага:
- ✅ `user_id` стал `NOT NULL`
- ✅ Добавлены внешние ключи
- ✅ Все данные привязаны к пользователю

---

## Проверка результатов

```sql
-- Проверка категорий
SELECT 
    'categories' as table_name,
    COUNT(*) as total_rows,
    COUNT(user_id) as rows_with_user_id,
    COUNT(DISTINCT user_id) as unique_users
FROM categories;

-- Проверка транзакций
SELECT 
    'transactions' as table_name,
    COUNT(*) as total_rows,
    COUNT(user_id) as rows_with_user_id,
    COUNT(DISTINCT user_id) as unique_users
FROM transactions;

-- Проверка пользователей
SELECT id, name, email, created_at FROM users;
```

---

## Откат миграции (при необходимости)

```bash
# Откат к версии v1.0.0
mvn liquibase:rollback -Dliquibase.rollbackToTag=v1.0.0
```

Или откатить на N изменений:
```bash
mvn liquibase:rollback -Dliquibase.rollbackCount=3
```

---

## Важные замечания

1. **Не применяйте v1.1.2 до привязки данных!** Это вызовет ошибку нарушения `NOT NULL`.

2. **Сделайте бэкап БД** перед применением миграций:
   ```bash
   pg_dump -U your_user your_database > backup_$(date +%Y%m%d).sql
   ```

3. **Для production** рекомендуется:
   - Применять миграции в окне обслуживания
   - Иметь план отката
   - Тестировать на staging-окружении

4. **Если пользователей несколько** — данные всех старых записей будут привязаны к одному пользователю. В дальнейшем можно перераспределить данные через админ-панель.
