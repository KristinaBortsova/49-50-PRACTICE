import { useState, useEffect } from "react";
import MenuCard from "../components/MenuCard";
import { useCart } from "../hooks/useCart";
import type { MenuItem } from "../types";
import apiclient from "../services/apiClient";

// Мета-данные для SEO (заголовок страницы)
export function meta() {
    return [{ title: "Меню | Quexty" }];
}

// Экспортируем компонент MenuPage по умолчанию
export default function MenuPage() {
    // Категории для фильтрации блюд
    const categories = ["Все", "Закуски", "Основные блюда", "Десерты", "Напитки"];
    // Состояние активной категории (по умолчанию "Все")
    const [activeCategory, setActiveCategory] = useState("Все");
    // Получаем общее количество товаров и функцию добавления из корзины
    const { totalCount, addItem } = useCart();
    // Состояние для хранения данных меню с сервера
    const [menuData, setMenuData] = useState<MenuItem[]>([]);
    // Состояние загрузки (показываем спиннер/текст)
    const [isLoading, setLoading] = useState(true);
    // Состояние ошибки (если запрос не удался)
    const [error, setError] = useState<string | null>(null);

    // Загружаем меню при монтировании компонента
    useEffect(() => {
        apiclient.get<MenuItem[]>("/menu")  // GET запрос на эндпоинт /menu
            .then((response) => {
                setMenuData(response.data);  // Сохраняем полученные данные
            })
            .catch((err) => {
                // Обрабатываем ошибку: берём сообщение из ответа сервера или стандартное
                setError(err?.response?.data?.message || err?.message || "Не удалось загрузить меню");
            })
            .finally(() => {
                setLoading(false);  // В любом случае выключаем состояние загрузки
            });
    }, []);  // Пустой массив зависимостей = эффект срабатывает один раз

    // Фильтруем блюда по выбранной категории
    const filteredMenu = activeCategory === "Все"
        ? menuData  // Если "Все" - показываем всё меню
        : menuData.filter(item => item.category === activeCategory);  // Иначе фильтруем

    // Функция добавления блюда в корзину
    const addToCart = (item: MenuItem) => {
        addItem(item);  // Вызываем функцию из хука useCart
    };

    // Показываем индикатор загрузки
    if (isLoading) {
        return <div className="text-center py-20 text-xl font-medium text-stone-500">Загрузка меню...</div>;
    }

    // Показываем сообщение об ошибке
    if (error) {
        return <div className="text-center py-20 text-xl font-medium text-red-500">Ошибка: {error}</div>;
    }

    // Основной рендер компонента
    return (
        <div>
            {/* Верхняя панель: заголовок + счётчик корзины */}
            <div className="flex justify-between items-center mb-8">
                {/* Заголовок страницы*/}
                <h1 className="text-4xl font-bold text-rose-900">Меню</h1>
                
                {/* Счётчик количества блюд в корзине */}
                <span className="bg-pink-100 text-rose-800 px-4 py-2 rounded-full">
                    {totalCount} {"блюд"}
                </span>
            </div>

            {/* Строка фильтрации по категориям (кнопки) */}
            <div className="flex gap-3 mb-8 flex-wrap">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2 rounded-full border transition-colors ${ activeCategory === cat 
                                ? "bg-rose-500 text-white border-rose-500"  // Активная кнопка
                                : "bg-white text-rose-700 border-pink-200 hover:bg-pink-50"  // Неактивная
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Сетка с карточками блюд (3 колонки на больших экранах) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenu.map(item => (
                    <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
                ))}
            </div>
        </div>
    );
}