-- Восстановление записей в databasechangelog для существующих миграций
-- Это штатная операция синхронизации состояния БД с Liquibase

-- v1.0.0: Создание таблиц categories и transactions
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id)
VALUES 
('2026-03-20-01', 'andrew', 'db/changelog/v1.0.0/ddl/2026-03-20--01-create-categories-table.xml', NOW(), 1, 'EXECUTED', '9:8fe069a63e780756ca29356c0c50b90f', 'createTable tableName=categories; addForeignKeyConstraint baseTableName=categories, constraintName=fk_categories_parent, referencedTableName=categories; addUniqueConstraint constraintName=uk_categories_name_parent, tableName=categories; createIndex indexName=idx_categories_parent_id, tableName=categories', 'Create categories table', NULL, '4.31.1', NULL, NULL, 'sync-v1.0.0'),
('2026-03-20-02', 'andrey', 'db/changelog/v1.0.0/ddl/2026-03-20--02-create-transactions-table.xml', NOW(), 2, 'EXECUTED', '9:a1e14cca33513b1576cdf756204502f5', 'createTable tableName=transactions; addForeignKeyConstraint baseTableName=transactions, constraintName=fk_transactions_category, referencedTableName=categories; createIndex indexName=idx_transactions_category_id, tableName=transactions; createIndex indexName=idx_transactions_date, tableName=transactions', 'Create transactions table', NULL, '4.31.1', NULL, NULL, 'sync-v1.0.0');

-- v1.0.0 DML: Вставка начальных категорий
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id)
VALUES 
('2026-03-20-03-01', 'andrey', 'db/changelog/v1.0.0/dml/2026-03-20--03-insert-initial-categories.sql', NOW(), 3, 'EXECUTED', '9:a9ffad7a04a7c756519367125b155e2d', 'sql', '', NULL, '4.31.1', NULL, NULL, 'sync-v1.0.0'),
('2026-03-20-03-02', 'andrey', 'db/changelog/v1.0.0/dml/2026-03-20--03-insert-initial-categories.sql', NOW(), 4, 'EXECUTED', '9:8f066697d97b3e7a2c1cdbf137b578f9', 'sql', '', NULL, '4.31.1', NULL, NULL, 'sync-v1.0.0');

-- v1.1.0: Создание таблицы users
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id)
VALUES 
('2026-03-28-01-create-users-table', 'andrew', 'db/changelog/v1.1.0/2026-03-28--01-create-users-table.xml', NOW(), 5, 'EXECUTED', '9:CHECKSUM_PLACEHOLDER', 'createTable tableName=users; createIndex indexName=idx_users_email, tableName=users', 'Create users table', NULL, '4.31.1', NULL, NULL, 'sync-v1.1.0');

-- v1.1.1: Добавление user_id (nullable)
INSERT INTO databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id)
VALUES 
('2026-03-28-01-add-user-id-to-categories', 'andrew', 'db/changelog/v1.1.1/2026-03-28--01-add-user-id-to-categories.xml', NOW(), 6, 'EXECUTED', '9:CHECKSUM_PLACEHOLDER', 'addColumn tableName=categories; createIndex indexName=idx_categories_user_id, tableName=categories', 'Add user_id column to categories table (nullable)', NULL, '4.31.1', NULL, NULL, 'sync-v1.1.1'),
('2026-03-28-01-add-user-id-to-transactions', 'andrew', 'db/changelog/v1.1.1/2026-03-28--02-add-user-id-to-transactions.xml', NOW(), 7, 'EXECUTED', '9:CHECKSUM_PLACEHOLDER', 'addColumn tableName=transactions; createIndex indexName=idx_transactions_user_id, tableName=transactions; createIndex indexName=idx_transactions_user_date, tableName=transactions', 'Add user_id column to transactions table (nullable)', NULL, '4.31.1', NULL, NULL, 'sync-v1.1.1');
