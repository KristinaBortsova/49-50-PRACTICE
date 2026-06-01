// Импортируем Link для навигации между страницами
import { Link } from "react-router";
// Импортируем информацию о ресторане
import { restaurantInfo } from "../data/restaurant";

// Функция meta() для SEO — задаёт заголовок страницы
export function meta() {
    return [{ title: "Quexty — Ресторан изысканной кухни" }];
}
// Экспортируем компонент HomePage по умолчанию
export default function HomePage() {
    return (
        // Основной контейнер: центрирование, вертикальные отступы
        <div className="text-center space-y-8">
            {/* Заголовок с названием ресторана */}
            <h1 className="text-5xl font-bold text-rose-900 mt-12">
                {restaurantInfo.name}
            </h1>
            {/* Подзаголовок/слоган ресторана */}
            <p className="text-xl text-rose-700 max-w-2xl mx-auto">
                Изысканная кухня в центре города :з
            </p>
            {/* Кнопка перехода в меню */}
            <Link
                to="/menu"
                className="inline-block bg-rose-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-rose-700 transition-colors"
            >
                Смотреть меню
            </Link>
     </div>
  );
}