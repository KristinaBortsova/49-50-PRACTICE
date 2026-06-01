// Импортируем тип MenuItem из папки types
import type { MenuItem } from "~/types";

// Интерфейс пропсов компонента MenuCard
interface Props {
    item: MenuItem;                    // Объект блюда (id, name, description, price, category, image)
    onAddToCart: (item: MenuItem) => void;  // Функция добавления блюда в корзину
}

// Экспортируем компонент MenuCard по умолчанию
export default function MenuCard({ item, onAddToCart }: Props) {
    return (
        // Карточка блюда: белый фон, розовая тень, скруглённые углы
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg hover:shadow-pink-200 transition-all duration-300">
            
            {/* Изображение блюда */}
            <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
            />
            
            {/* Блок с информацией о блюде */}
            <div className="p-5">
                
                {/* Верхняя строка: название + цена */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-stone-800">{item.name}</h3>
                    <span className="text-rose-600 font-bold">{item.price} ₽</span>
                </div>
                
                {/* Описание блюда */}
                <p className="text-stone-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                {/* Кнопка "В корзину" — розовая цветовая схема */}
                <button
                    onClick={() => onAddToCart(item)}
                    className="w-full bg-rose-500 text-white py-2 rounded-xl hover:bg-rose-600 transition-colors duration-200 cursor-pointer"
                >
                    В корзину
                </button>
            </div>
        </div>
    );
}