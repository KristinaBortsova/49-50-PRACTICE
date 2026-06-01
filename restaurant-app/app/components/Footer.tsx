// Импортируем информацию о ресторане из файла data/restaurant
import { restaurantInfo } from "../data/restaurant";

// Экспортируем компонент Footer по умолчанию
export default function Footer() {
    return (
        // Градиент от тёмно-розового (rose-800) к ярко-розовому (pink-600)
        <footer className="bg-gradient-to-r from-rose-800 to-pink-600 text-pink-100 py-8 mt-12 shadow-inner">
            {/* Контейнер с максимальной шириной и центрированием */}
            <div className="max-w-6xl mx-auto px-4 text-center">
                {/* Название ресторана — белым цветом для максимального контраста на градиенте */}
                <p className="text-lg font-bold text-white mb-2 drop-shadow-sm">{restaurantInfo.name}</p>
                {/*Адрес ресторана*/}
                <p>{restaurantInfo.address}</p>
                {/* Телефон ресторана*/}
                <p>{restaurantInfo.phone}</p>
                {/* Часы работы ресторана*/}
                <p>{restaurantInfo.workHours}</p>
            </div>
        </footer>
    );
}