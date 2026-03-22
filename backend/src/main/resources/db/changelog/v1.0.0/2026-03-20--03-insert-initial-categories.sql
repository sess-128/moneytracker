--liquibase formatted sql

--changeset andrey:2026-03-20-03-01
INSERT INTO categories (name, type) VALUES
                                        ('Спорт', 'EXPENSE'),
                                        ('Образование', 'EXPENSE'),
                                        ('Больница', 'EXPENSE'),
                                        ('Бьюти процедуры', 'EXPENSE'),
                                        ('Подписки (месяц)', 'EXPENSE'),
                                        ('Жилье', 'EXPENSE'),
                                        ('Вредное', 'EXPENSE'),
                                        ('Подарки', 'EXPENSE'),
                                        ('Шлак', 'EXPENSE'),
                                        ('Сладкое и хлебное', 'EXPENSE'),
                                        ('Полуфабрикаты', 'EXPENSE'),
                                        ('Бакалея', 'EXPENSE'),
                                        ('Пиво и сигареты', 'EXPENSE'),
                                        ('Отдых', 'EXPENSE'),
                                        ('Канцелярия', 'EXPENSE'),
                                        ('Напитки', 'EXPENSE'),
                                        ('Мясо и рыба', 'EXPENSE'),
                                        ('Товары в дом', 'EXPENSE'),
                                        ('Обувь', 'EXPENSE'),
                                        ('Одежда', 'EXPENSE'),
                                        ('Прочее', 'EXPENSE'),
                                        ('Сыры и кисломолочка', 'EXPENSE'),
                                        ('Долги', 'EXPENSE'),
                                        ('Вкусности', 'EXPENSE'),
                                        ('Транспорт', 'EXPENSE'),
                                        ('Быт. химия и ванна', 'EXPENSE'),
                                        ('Овощи', 'EXPENSE'),
                                        ('Работа', 'INCOME'),
                                        ('Другие доходы', 'INCOME'),
                                        ('Фрукты', 'EXPENSE');

--changeset andrey:2026-03-20-03-02
-- Работа
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Зарплата', (SELECT id FROM categories WHERE name = 'Работа'), 'INCOME'),
                                                   ('Премии', (SELECT id FROM categories WHERE name = 'Работа'), 'INCOME');

-- Другие доходы
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Кешбек', (SELECT id FROM categories WHERE name = 'Другие доходы'), 'INCOME'),
                                                   ('Стипендия', (SELECT id FROM categories WHERE name = 'Другие доходы'), 'INCOME'),
                                                   ('Подарки в виде денег', (SELECT id FROM categories WHERE name = 'Другие доходы'), 'INCOME'),
                                                   ('Шабашки', (SELECT id FROM categories WHERE name = 'Другие доходы'), 'INCOME');

-- Спорт
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Кроссфит', (SELECT id FROM categories WHERE name = 'Спорт'), 'EXPENSE'),
                                                   ('Бассейн', (SELECT id FROM categories WHERE name = 'Спорт'), 'EXPENSE'),
                                                   ('Экипировка', (SELECT id FROM categories WHERE name = 'Спорт'), 'EXPENSE');

-- Образование
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Книги', (SELECT id FROM categories WHERE name = 'Образование'), 'EXPENSE'),
                                                   ('Курсы', (SELECT id FROM categories WHERE name = 'Образование'), 'EXPENSE'),
                                                   ('Обучения', (SELECT id FROM categories WHERE name = 'Образование'), 'EXPENSE');

-- Больница
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Ваш доктор', (SELECT id FROM categories WHERE name = 'Больница'), 'EXPENSE'),
                                                   ('Ростов стоматология', (SELECT id FROM categories WHERE name = 'Больница'), 'EXPENSE'),
                                                   ('Анализы', (SELECT id FROM categories WHERE name = 'Больница'), 'EXPENSE'),
                                                   ('Глазной врач', (SELECT id FROM categories WHERE name = 'Больница'), 'EXPENSE'),
                                                   ('Психолог', (SELECT id FROM categories WHERE name = 'Больница'), 'EXPENSE'),
                                                   ('Лекарства', (SELECT id FROM categories WHERE name = 'Больница'), 'EXPENSE');

-- Бьюти процедуры
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Маникюр', (SELECT id FROM categories WHERE name = 'Бьюти процедуры'), 'EXPENSE'),
                                                   ('Педикюр', (SELECT id FROM categories WHERE name = 'Бьюти процедуры'), 'EXPENSE'),
                                                   ('Стрижка', (SELECT id FROM categories WHERE name = 'Бьюти процедуры'), 'EXPENSE');

-- Подписки (месяц)
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Я.Музыка', (SELECT id FROM categories WHERE name = 'Подписки (месяц)'), 'EXPENSE'),
                                                   ('Связь Аня', (SELECT id FROM categories WHERE name = 'Подписки (месяц)'), 'EXPENSE'),
                                                   ('Связь Андрей', (SELECT id FROM categories WHERE name = 'Подписки (месяц)'), 'EXPENSE'),
                                                   ('ICloud', (SELECT id FROM categories WHERE name = 'Подписки (месяц)'), 'EXPENSE'),
                                                   ('Дом. интернет', (SELECT id FROM categories WHERE name = 'Подписки (месяц)'), 'EXPENSE'),
                                                   ('Впн', (SELECT id FROM categories WHERE name = 'Подписки (месяц)'), 'EXPENSE'),
                                                   ('Гпт', (SELECT id FROM categories WHERE name = 'Подписки (месяц)'), 'EXPENSE');

-- Жилье
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Квартира аренда', (SELECT id FROM categories WHERE name = 'Жилье'), 'EXPENSE'),
                                                   ('Коммуналка', (SELECT id FROM categories WHERE name = 'Жилье'), 'EXPENSE');

-- Вредное
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Доширак', (SELECT id FROM categories WHERE name = 'Вредное'), 'EXPENSE'),
                                                   ('Снеки', (SELECT id FROM categories WHERE name = 'Вредное'), 'EXPENSE'),
                                                   ('Чебу что-то', (SELECT id FROM categories WHERE name = 'Вредное'), 'EXPENSE'),
                                                   ('Жвачка', (SELECT id FROM categories WHERE name = 'Вредное'), 'EXPENSE');

-- Подарки
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Укр соколов', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE'),
                                                   ('Кресло', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE'),
                                                   ('Хомяк', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE'),
                                                   ('Айфон 17', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE'),
                                                   ('Чехол', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE'),
                                                   ('Пленка', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE'),
                                                   ('Пр. пакеты', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE'),
                                                   ('Алине', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE'),
                                                   ('Маме', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE'),
                                                   ('Анечке', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE'),
                                                   ('Родственникам', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE'),
                                                   ('Магарычи', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE'),
                                                   ('Цветы', (SELECT id FROM categories WHERE name = 'Подарки'), 'EXPENSE');

-- Шлак
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Все вместе', (SELECT id FROM categories WHERE name = 'Шлак'), 'EXPENSE'),
                                                   ('На тесто', (SELECT id FROM categories WHERE name = 'Шлак'), 'EXPENSE'),
                                                   ('На шашлык', (SELECT id FROM categories WHERE name = 'Шлак'), 'EXPENSE'),
                                                   ('Пакет', (SELECT id FROM categories WHERE name = 'Шлак'), 'EXPENSE'),
                                                   ('Чиа', (SELECT id FROM categories WHERE name = 'Шлак'), 'EXPENSE'),
                                                   ('Комиссия', (SELECT id FROM categories WHERE name = 'Шлак'), 'EXPENSE');

-- Сладкое и хлебное
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Булочка', (SELECT id FROM categories WHERE name = 'Сладкое и хлебное'), 'EXPENSE'),
                                                   ('К чаю', (SELECT id FROM categories WHERE name = 'Сладкое и хлебное'), 'EXPENSE'),
                                                   ('Магнит выпечка', (SELECT id FROM categories WHERE name = 'Сладкое и хлебное'), 'EXPENSE'),
                                                   ('Пятерочка выпечка', (SELECT id FROM categories WHERE name = 'Сладкое и хлебное'), 'EXPENSE'),
                                                   ('Попкорн', (SELECT id FROM categories WHERE name = 'Сладкое и хлебное'), 'EXPENSE'),
                                                   ('Хлеб', (SELECT id FROM categories WHERE name = 'Сладкое и хлебное'), 'EXPENSE'),
                                                   ('Шок шарики', (SELECT id FROM categories WHERE name = 'Сладкое и хлебное'), 'EXPENSE'),
                                                   ('Мороженое', (SELECT id FROM categories WHERE name = 'Сладкое и хлебное'), 'EXPENSE'),
                                                   ('Торт', (SELECT id FROM categories WHERE name = 'Сладкое и хлебное'), 'EXPENSE'),
                                                   ('Шоколадки', (SELECT id FROM categories WHERE name = 'Сладкое и хлебное'), 'EXPENSE');

-- Полуфабрикаты
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Пельмени', (SELECT id FROM categories WHERE name = 'Полуфабрикаты'), 'EXPENSE'),
                                                   ('Тесто готовое', (SELECT id FROM categories WHERE name = 'Полуфабрикаты'), 'EXPENSE'),
                                                   ('Смеси овощные', (SELECT id FROM categories WHERE name = 'Полуфабрикаты'), 'EXPENSE'),
                                                   ('Консерва', (SELECT id FROM categories WHERE name = 'Полуфабрикаты'), 'EXPENSE'),
                                                   ('Паштет', (SELECT id FROM categories WHERE name = 'Полуфабрикаты'), 'EXPENSE');

-- Бакалея
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Чай', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Кофе', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Крупы', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Соль', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Сахар', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Перец черный', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Томатная паста', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Кетчуп', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Майонез', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Соусы', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Макароны', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Масло подсолнечное', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Масло сливочное', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Яйца', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Специи', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Уксус', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Сода', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Мед', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Горчица', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE'),
                                                   ('Мука', (SELECT id FROM categories WHERE name = 'Бакалея'), 'EXPENSE');

-- Пиво и сигареты
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Пиво', (SELECT id FROM categories WHERE name = 'Пиво и сигареты'), 'EXPENSE'),
                                                   ('Сигареты', (SELECT id FROM categories WHERE name = 'Пиво и сигареты'), 'EXPENSE'),
                                                   ('Алкоголь', (SELECT id FROM categories WHERE name = 'Пиво и сигареты'), 'EXPENSE');

-- Отдых
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Кино', (SELECT id FROM categories WHERE name = 'Отдых'), 'EXPENSE'),
                                                   ('Автосим', (SELECT id FROM categories WHERE name = 'Отдых'), 'EXPENSE');

-- Канцелярия
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Скотч 2хсторонний', (SELECT id FROM categories WHERE name = 'Канцелярия'), 'EXPENSE'),
                                                   ('Нож канц', (SELECT id FROM categories WHERE name = 'Канцелярия'), 'EXPENSE'),
                                                   ('Клей для пистолета 11мм', (SELECT id FROM categories WHERE name = 'Канцелярия'), 'EXPENSE'),
                                                   ('Ручка', (SELECT id FROM categories WHERE name = 'Канцелярия'), 'EXPENSE'),
                                                   ('Печать', (SELECT id FROM categories WHERE name = 'Канцелярия'), 'EXPENSE');

-- Напитки
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Вода без газа', (SELECT id FROM categories WHERE name = 'Напитки'), 'EXPENSE'),
                                                   ('Сок', (SELECT id FROM categories WHERE name = 'Напитки'), 'EXPENSE'),
                                                   ('Газировка', (SELECT id FROM categories WHERE name = 'Напитки'), 'EXPENSE'),
                                                   ('Чай холодный', (SELECT id FROM categories WHERE name = 'Напитки'), 'EXPENSE');

-- Мясо и рыба
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Филе кур', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Голени кур', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Крылья', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Тушка кур', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Свинина', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Говядина', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Колбаски', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Сосиски', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Фарш', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Колбаса', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Рыба', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Готовое мясо', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Бекон', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Печень', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE'),
                                                   ('Ребра', (SELECT id FROM categories WHERE name = 'Мясо и рыба'), 'EXPENSE');

-- Товары в дом
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Укр к НГ', (SELECT id FROM categories WHERE name = 'Товары в дом'), 'EXPENSE'),
                                                   ('Лампочка', (SELECT id FROM categories WHERE name = 'Товары в дом'), 'EXPENSE'),
                                                   ('Кухня', (SELECT id FROM categories WHERE name = 'Товары в дом'), 'EXPENSE'),
                                                   ('Пепельница', (SELECT id FROM categories WHERE name = 'Товары в дом'), 'EXPENSE'),
                                                   ('Лампочки', (SELECT id FROM categories WHERE name = 'Товары в дом'), 'EXPENSE'),
                                                   ('Спальня', (SELECT id FROM categories WHERE name = 'Товары в дом'), 'EXPENSE');

-- Обувь
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Обувь', (SELECT id FROM categories WHERE name = 'Обувь'), 'EXPENSE'),
                                                   ('Уход за обувью', (SELECT id FROM categories WHERE name = 'Обувь'), 'EXPENSE');

-- Одежда
INSERT INTO categories (name, parent_id, type) VALUES
    ('Одежда', (SELECT id FROM categories WHERE name = 'Одежда'), 'EXPENSE');

-- Прочее
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Прочее()', (SELECT id FROM categories WHERE name = 'Прочее'), 'EXPENSE'),
                                                   ('Вб', (SELECT id FROM categories WHERE name = 'Прочее'), 'EXPENSE');

-- Сыры и кисломолочка
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Молоко', (SELECT id FROM categories WHERE name = 'Сыры и кисломолочка'), 'EXPENSE'),
                                                   ('Кефир', (SELECT id FROM categories WHERE name = 'Сыры и кисломолочка'), 'EXPENSE'),
                                                   ('Йогурт', (SELECT id FROM categories WHERE name = 'Сыры и кисломолочка'), 'EXPENSE'),
                                                   ('Творог', (SELECT id FROM categories WHERE name = 'Сыры и кисломолочка'), 'EXPENSE'),
                                                   ('Иммунеле', (SELECT id FROM categories WHERE name = 'Сыры и кисломолочка'), 'EXPENSE'),
                                                   ('Сметана', (SELECT id FROM categories WHERE name = 'Сыры и кисломолочка'), 'EXPENSE'),
                                                   ('Сырок', (SELECT id FROM categories WHERE name = 'Сыры и кисломолочка'), 'EXPENSE'),
                                                   ('Сыр', (SELECT id FROM categories WHERE name = 'Сыры и кисломолочка'), 'EXPENSE'),
                                                   ('Сыр творожный', (SELECT id FROM categories WHERE name = 'Сыры и кисломолочка'), 'EXPENSE'),
                                                   ('Сливки', (SELECT id FROM categories WHERE name = 'Сыры и кисломолочка'), 'EXPENSE');

-- Долги
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Сергей', (SELECT id FROM categories WHERE name = 'Долги'), 'EXPENSE'),
                                                   ('Данила', (SELECT id FROM categories WHERE name = 'Долги'), 'EXPENSE'),
                                                   ('Альфа', (SELECT id FROM categories WHERE name = 'Долги'), 'EXPENSE'),
                                                   ('Сбер', (SELECT id FROM categories WHERE name = 'Долги'), 'EXPENSE'),
                                                   ('Тинькофф', (SELECT id FROM categories WHERE name = 'Долги'), 'EXPENSE'),
                                                   ('Лиза проеб', (SELECT id FROM categories WHERE name = 'Долги'), 'EXPENSE');

-- Вкусности
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Кофе', (SELECT id FROM categories WHERE name = 'Вкусности'), 'EXPENSE'),
                                                   ('Додо', (SELECT id FROM categories WHERE name = 'Вкусности'), 'EXPENSE'),
                                                   ('Мак', (SELECT id FROM categories WHERE name = 'Вкусности'), 'EXPENSE'),
                                                   ('Пить кофе', (SELECT id FROM categories WHERE name = 'Вкусности'), 'EXPENSE'),
                                                   ('Другое', (SELECT id FROM categories WHERE name = 'Вкусности'), 'EXPENSE'),
                                                   ('Роллы', (SELECT id FROM categories WHERE name = 'Вкусности'), 'EXPENSE'),
                                                   ('Ешьте Донер', (SELECT id FROM categories WHERE name = 'Вкусности'), 'EXPENSE');

-- Транспорт
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Такси', (SELECT id FROM categories WHERE name = 'Транспорт'), 'EXPENSE'),
                                                   ('Автобус', (SELECT id FROM categories WHERE name = 'Транспорт'), 'EXPENSE'),
                                                   ('Электричка', (SELECT id FROM categories WHERE name = 'Транспорт'), 'EXPENSE'),
                                                   ('Поезд', (SELECT id FROM categories WHERE name = 'Транспорт'), 'EXPENSE');

-- Быт. химия и ванна
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Бума полотенца', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Ватные диски', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Влаж салфетки', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Гель для бритья', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Гель для душа', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Гель для стирки', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Дезодорант', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Зубная паста', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Лезвия для бритвы', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Мочалки', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Моющее для посуды', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Мыло', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Осв возудха', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Пемолюкс', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Перчатки для посуды', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Прокладки', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Станки', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Стир порошок', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Туалетная бумага', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Шампунь', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Щетки для зубов', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE'),
                                                   ('Зубная нить', (SELECT id FROM categories WHERE name = 'Быт. химия и ванна'), 'EXPENSE');

-- Овощи
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Картофель', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE'),
                                                   ('Огурцы', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE'),
                                                   ('Помидоры', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE'),
                                                   ('Морковь', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE'),
                                                   ('Лук репчатый', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE'),
                                                   ('Кабачок', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE'),
                                                   ('Перец болг', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE'),
                                                   ('Чеснок', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE'),
                                                   ('Зелень', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE'),
                                                   ('Авокадо', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE'),
                                                   ('Шампиньоны', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE'),
                                                   ('Свекла', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE'),
                                                   ('Лист салата', (SELECT id FROM categories WHERE name = 'Овощи'), 'EXPENSE');

-- Фрукты
INSERT INTO categories (name, parent_id, type) VALUES
                                                   ('Яблоки', (SELECT id FROM categories WHERE name = 'Фрукты'), 'EXPENSE'),
                                                   ('Бананы', (SELECT id FROM categories WHERE name = 'Фрукты'), 'EXPENSE'),
                                                   ('Клубника', (SELECT id FROM categories WHERE name = 'Фрукты'), 'EXPENSE'),
                                                   ('Киви', (SELECT id FROM categories WHERE name = 'Фрукты'), 'EXPENSE'),
                                                   ('Мандарины', (SELECT id FROM categories WHERE name = 'Фрукты'), 'EXPENSE'),
                                                   ('Виноград', (SELECT id FROM categories WHERE name = 'Фрукты'), 'EXPENSE'),
                                                   ('Лимон', (SELECT id FROM categories WHERE name = 'Фрукты'), 'EXPENSE');