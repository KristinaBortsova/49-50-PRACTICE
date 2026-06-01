import { Link } from "react-router";
import { useCart } from "../hooks/useCart";

// Мета-данные для SEO
export function meta() {
    return [{ title: "Корзина | Quexty" }];
}

// Экспортируем компонент CartPage по умолчанию
export default function CartPage() {
    // Получаем данные и функции из контекста корзины
    const { items, totalAmount, updateQuantity } = useCart();

    // Если корзина пуста — показываем сообщение
    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-rose-800 mb-4">Корзина пуста</h2>
                <Link to="/menu" className="text-rose-500 hover:text-rose-600 hover:underline text-lg transition-colors"
                >
                    Перейти в меню
                </Link>
            </div>
        );
    }

    // Если корзина не пуста — показываем содержимое
    return (
        <div className="max-w-2xl mx-auto">
            {/* Заголовок страницы */}
            <h1 className="text-3xl font-bold text-rose-800 mb-8">Корзина</h1>
            {/* Список товаров в корзине */}
            {items.map((item) => (
                <div key={item.menuItem.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow border border-pink-100"
                >
                    <div className="flex items-center gap-4">
                        {/* Изображение блюда */}
                        <img src={item.menuItem.image} alt={item.menuItem.name} className="w-20 h-20 object-cover rounded-lg" />
                        {/* Информация о блюде */}
                        <div className="flex-grow">
                            <h3 className="font-bold text-stone-800">{item.menuItem.name}</h3>
                            <p className="text-rose-600 font-medium">{item.menuItem.price} ₽</p>
                        </div>
                        {/* Контролы количества */}
                        <div className="flex items-center gap-2">
                            {/* Кнопка уменьшения */}
                            <button
                                onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                                className="w-8 h-8 bg-pink-100 text-rose-600 rounded-full hover:bg-pink-200 transition-colors flex items-center justify-center font-bold"
                            >
                                −
                            </button>
                            {/* Счётчик количества */}
                            <span className="w-8 text-center font-medium text-stone-700">
                                {item.quantity}
                            </span>
                            {/* Кнопка увеличения */}
                            <button
                                onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                                className="w-8 h-8 bg-pink-100 text-rose-600 rounded-full hover:bg-pink-200 transition-colors flex items-center justify-center font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Блок с итоговой суммой и оформлением */}
            <div className="bg-pink-50 rounded-xl p-6 mt-6">
                <div className="flex justify-between text-xl font-bold mb-4">
                    <span className="text-rose-800">Итого:</span>
                    <span className="text-rose-800">{totalAmount} ₽</span> 
                </div>
                
                <Link 
                   to="/checkout"
                   className="block text-center w-full bg-rose-500 text-white py-3 rounded-xl text-lg hover:bg-rose-600 transition-colors duration-200"
                >
                 Оформить заказ
                </Link>
            </div>
        </div>
    );
}