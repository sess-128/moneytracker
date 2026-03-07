package ru.rrtyui.moneytracker.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.rrtyui.moneytracker.model.Category;
import ru.rrtyui.moneytracker.model.CategoryType;
import ru.rrtyui.moneytracker.repository.CategoryRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
//@Component
@RequiredArgsConstructor
public class CategoryDataLoader implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 50) {
            log.info("База данных уже заполнена категориями ({} шт.). Пропускаем загрузку.", categoryRepository.count());
            return;
        }

        log.info("Начинаем загрузку справочника категорий...");

        Map<String, Category> parentCategoriesMap = new HashMap<>();

        List<String> parentNames = List.of(
                "Спорт", "Образование", "Больница", "Бьюти процедуры", "Подписки (месяц)",
                "Жилье", "Вредное", "Подарки", "Шлак", "Сладкое и хлебное",
                "Полуфабрикаты", "Бакалея", "Пиво и сигареты", "Отдых", "Канцелярия",
                "Напитки", "Мясо и рыба", "Товары в дом", "Обувь", "Одежда",
                "Прочее", "Сыры и кисломолочка", "Долги", "Вкусности", "Транспорт",
                "Быт. химия и ванна", "Овощи", "Фрукты"
        );
        for (String name : parentNames) {
            Category cat = new Category(name, null, CategoryType.EXPENSE);
            Category saved = categoryRepository.save(cat);
            parentCategoriesMap.put(name, saved);
            log.debug("Создана категория: {}", name);
        }

        Map<String, List<String>> subcategories = Map.ofEntries(
                Map.entry("Спорт", List.of("Кроссфит", "Бассейн", "Экипировка")),
                Map.entry("Образование", List.of("Книги", "Курсы", "Обучения")),
                Map.entry("Больница", List.of("Ваш доктор", "Ростов стоматология", "Анализы", "Глазной врач", "Психолог", "Лекарства")),
                Map.entry("Бьюти процедуры", List.of("Маникюр", "Педикюр", "Стрижка")),
                Map.entry("Подписки (месяц)", List.of("Я.Музыка", "Связь Аня", "Связь Андрей", "ICloud", "Дом. интернет", "Впн", "Гпт")),
                Map.entry("Жилье", List.of("Квартира аренда", "Коммуналка")),
                Map.entry("Вредное", List.of("Доширак", "Снеки", "Чебу что-то", "Жвачка")),
                Map.entry("Подарки", List.of("Укр соколов", "Кресло", "Хомяк", "Айфон 17", "Чехол", "Пленка", "Пр. пакеты", "Алине", "Маме", "Анечке", "Родственникам", "Магарычи", "Цветы")),
                Map.entry("Шлак", List.of("Все вместе", "На тесто", "На шашлык", "Пакет", "Чиа", "Комиссия")),
                Map.entry("Сладкое и хлебное", List.of("Булочка", "К чаю", "Магнит выпечка", "Пятерочка выпечка", "Попкорн", "Хлеб", "Шок шарики", "Мороженое", "Торт", "Шоколадки")),
                Map.entry("Полуфабрикаты", List.of("Пельмени", "Тесто готовое", "Смеси овощные", "Консерва", "Паштет")),
                Map.entry("Бакалея", List.of("Чай", "Кофе", "Крупы", "Соль", "Сахар", "Перец черный", "Томатная паста", "Кетчуп", "Майонез", "Соусы", "Макароны", "Масло подсолнечное", "Масло сливочное", "Яйца", "Специи", "Уксус", "Сода", "Мед", "Горчица", "Мука")),
                Map.entry("Пиво и сигареты", List.of("Пиво", "Сигареты", "Алкоголь")),
                Map.entry("Отдых", List.of("Кино", "Автосим")),
                Map.entry("Канцелярия", List.of("Скотч 2хсторонний", "Нож канц", "Клей для пистолета 11мм", "Ручка", "Печать")),
                Map.entry("Напитки", List.of("Вода без газа", "Сок", "Газировка", "Чай холодный")),
                Map.entry("Мясо и рыба", List.of("Филе кур", "Голени кур", "Крылья", "Тушка кур", "Свинина", "Говядина", "Колбаски", "Сосиски", "Фарш", "Колбаса", "Рыба", "Готовое мясо", "Бекон", "Печень", "Ребра")),
                Map.entry("Товары в дом", List.of("Укр к НГ", "Лампочка", "Кухня", "Пепельница", "Лампочки", "Спальня")),
                Map.entry("Обувь", List.of("Обувь", "Уход за обувью")),
                Map.entry("Одежда", List.of("Одежда")),
                Map.entry("Прочее", List.of("Прочее()", "Вб")),
                Map.entry("Сыры и кисломолочка", List.of("Молоко", "Кефир", "Йогурт", "Творог", "Иммунеле", "Сметана", "Сырок", "Сыр", "Сыр творожный", "Сливки")),
                Map.entry("Долги", List.of("Сергей", "Данила", "Альфа", "Сбер", "Тинькофф", "Лиза проеб")),
                Map.entry("Вкусности", List.of("Кофе", "Додо", "Мак", "Пить кофе", "Другое", "Роллы", "Ешьте Донер")),
                Map.entry("Транспорт", List.of("Такси", "Автобус", "Электричка", "Поезд")),
                Map.entry("Быт. химия и ванна", List.of("Бума полотенца", "Ватные диски", "Влаж салфетки", "Гель для бритья", "Гель для душа", "Гель для стирки", "Дезодорант", "Зубная паста", "Лезвия для бритвы", "Мочалки", "Моющее для посуды", "Мыло", "Осв возудха", "Пемолюкс", "Перчатки для посуды", "Прокладки", "Станки", "Стир порошок", "Туалетная бумага", "Шампунь", "Щетки для зубов", "Зубная нить")),
                Map.entry("Овощи", List.of("Картофель", "Огурцы", "Помидоры", "Морковь", "Лук репчатый", "Кабачок", "Перец болг", "Чеснок", "Зелень", "Авокадо", "Шампиньоны", "Свекла", "Лист салата")),
                Map.entry("Фрукты", List.of("Яблоки", "Бананы", "Клубника", "Киви", "Мандарины", "Виноград", "Лимон"))
        );

        int count = 0;
        for (Map.Entry<String, List<String>> entry : subcategories.entrySet()) {
            String parentName = entry.getKey();
            Category parent = parentCategoriesMap.get(parentName);

            if (parent == null) {
                log.warn("Родительская категория '{}' не найдена! Пропускаем подкатегории.", parentName);
                continue;
            }

            for (String subName : entry.getValue()) {
                if (subName == null || subName.trim().isEmpty()) continue;

                Category sub = new Category(subName.trim(), parent, CategoryType.EXPENSE);
                categoryRepository.save(sub);
                count++;
            }
        }

        log.info("Загрузка завершена! Создано подкатегорий: {}. Всего категорий в базе: {}", count, categoryRepository.count());
    }
}
