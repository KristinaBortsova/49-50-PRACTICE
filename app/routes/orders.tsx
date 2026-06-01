// страница истории заказов пользователя

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../services/apiClient";

// тип товара в заказе
interface OrderItem {
  id: string;        // идентификатор товара
  name: string;      // название товара/блюда
  price: number;     // цена за единицу
  quantity: number;  // количество единиц
}

// тип заказа
interface Order {
  id: string;           // уникальный идентификатор заказа
  status: string;       // статус заказа (Новый, Готовится, В пути, Доставлен)
  total: number;        // общая сумма заказа
  createdAt: string;    // дата и время создания заказа
  items: OrderItem[];   // массив товаров в заказе
}

// метаданные страницы для SEO
export function meta() {
  return [{ title: "История заказов | Quexty" }];
}

// Экспортируем компонент OrdersPage по умолчанию
export default function OrdersPage() {
  // получаем данные пользователя и состояние загрузки аутентификации
  const { user, loading: authLoading } = useAuth();
  // состояние для хранения списка заказов
  const [orders, setOrders] = useState<Order[]>([]);
  // состояние загрузки заказов
  const [isLoading, setIsLoading] = useState(true);

  // эффект для загрузки заказов при монтировании или изменении пользователя
  useEffect(() => {
    // если аутентификация ещё загружается - ждём
    if (authLoading) return;
    // если пользователь не авторизован - прекращаем загрузку
    if (!user) {
      setIsLoading(false);
      return;
    }

    // асинхронная функция для получения заказов с сервера
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // GET запрос на сервер с фильтрацией по userId
        const response = await apiClient.get(`/orders?userId=${user.uid}`);
        setOrders(response.data); // сохраняем полученные заказы
      } catch (error) {
        console.error("ошибка загрузки заказов:", error);
      } finally {
        setIsLoading(false); // завершаем состояние загрузки
      }
    };

    fetchOrders();
  }, [user, authLoading]); // зависимость от пользователя и статуса аутентификации

  // состояние загрузки (пока проверяем авторизацию или грузим заказы)
  if (authLoading || isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-500 text-xl">Загрузка истории заказов...</p>
      </div>
    );
  }

  // если пользователь не авторизован - показываем предложение войти
  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-700 mb-4">Чтобы посмотреть историю заказов, нужно войти в аккаунт</p>
        <Link
          to="/auth"
          className="inline-block bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition shadow-sm"
        >
          Войти в профиль
        </Link>
      </div>
    );
  }

  // если заказов нет - показываем предложение перейти в меню
  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-700 mb-4">Вы еще не делали заказов</p>
        <Link
          to="/menu"
          className="inline-block bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition shadow-sm"
        >
          Перейти в меню и заказать
        </Link>
      </div>
    );
  }

  // вспомогательная функция для форматирования даты в читаемый вид
  const formatDate = (dateString: string) => {
    if (!dateString) return "дата неизвестна";
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // основной рендер списка заказов
  return (
    <div className="container mx-auto px-4 py-8">
      {/* заголовок страницы */}
      <h1 className="text-4xl font-bold text-rose-800 mb-8 text-center">история заказов</h1>
      
      {/* список заказов */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-md border border-pink-100 p-6 hover:shadow-lg transition-shadow">
            {/* верхняя секция: номер заказа, дата, статус */}
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-pink-100">
              <div>
                {/* номер заказа (последние 6 символов ID) */}
                <p className="text-sm text-rose-400">ID: {order.id.slice(-6)}</p>
                {/* дата и время создания */}
                <p className="text-sm text-rose-400">{formatDate(order.createdAt)}</p>
              </div>
              {/* статус заказа с цветовым индикатором */}
              <span className="px-3 py-1 rounded-full text-sm bg-pink-100 text-rose-600 font-medium">
                {order.status}
              </span>
            </div>

            {/* список товаров в заказе */}
            <div className="space-y-2 mb-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-rose-600">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">{item.price * item.quantity} ₽</span>
                </div>
              ))}
            </div>

            {/* итоговая сумма заказа */}
            <div className="border-t border-pink-100 pt-3 flex justify-between font-bold text-lg">
              <span className="text-rose-700">итого:</span>
              <span className="text-rose-500">{order.total} ₽</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}