// Импортируем тип CartItem из папки types
import type { CartItem as CartItemType } from "../types";

// Интерфейс пропсов компонента CartItem
interface CartItemProps {
    item: CartItemType;                                    // Объект позиции в корзине (блюдо + количество)
    onUpdateQuantity: (id: number, quantity: number) => void;  // Функция обновления количества
}

// Экспортируем компонент CartItem по умолчанию
export default function CartItem({ item, onUpdateQuantity }: CartItemProps) {
    // Деструктурируем item для удобства
    const { menuItem, quantity } = item;

    return (
        // Основной контейнер карточки товара в корзине
        <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow border border-pink-100">
            {/* Изображение блюда */}
            <img
                src={menuItem.image}
                alt={menuItem.name}
                className="w-20 h-20 object-cover rounded-lg"
            />
            {/* Информация о блюде (название и цена) */}
            <div className="flex-grow">
                <h3 className="font-bold text-stone-800">{menuItem.name}</h3>
                <p className="text-rose-600 font-medium">
                    {menuItem.price} ₽ × {quantity} = {menuItem.price * quantity} ₽
                </p>
            </div>
            
            {/* Контролы для изменения количества (кнопки +/-, счётчик) */}
            <div className="flex items-center gap-2">
                {/* Кнопка уменьшения количества (-) */}
                <button
                    onClick={() => onUpdateQuantity(menuItem.id, quantity - 1)}
                    className="w-8 h-8 bg-pink-100 text-rose-600 rounded-full hover:bg-pink-200 transition-colors flex items-center justify-center"
                >
                    −
                </button>
                
                {/* Счётчик количества */}
                <span className="w-8 text-center font-medium text-stone-700">{quantity}</span>
                
                {/* Кнопка увеличения количества (+) */}
                <button
                    onClick={() => onUpdateQuantity(menuItem.id, quantity + 1)}
                    className="w-8 h-8 bg-pink-100 text-rose-600 rounded-full hover:bg-pink-200 transition-colors flex items-center justify-center"
                >
                    +
                </button>
            </div>
        </div>
    );
}