// страница оформления заказа
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../services/apiClient";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

// тип данных формы оформления заказа
interface CheckoutFormData {
  name: string;                 // имя клиента
  phone: string;                // номер телефона
  comment?: string;             // комментарий к заказу (необязательно)
  paymentMethod: "card" | "cash"; // способ оплаты: карта или наличные
}

// метаданные страницы для SEO
export function meta() {
  return [{ title: "Оформление заказа | Quexty" }];
}

// Экспортируем компонент CheckoutPage по умолчанию
export default function CheckoutPage() {
  const navigate = useNavigate();
  // получаем данные корзины: товары, общую сумму и функцию очистки
  const { items, totalAmount, clearCart } = useCart();
  // получаем данные авторизованного пользователя
  const { user } = useAuth();
  // состояние обработки отправки заказа
  const [isProcessing, setIsProcessing] = useState(false);

  // состояние открытия модального окна с подтверждением
  const [isModalOpen, setIsModalOpen] = useState(false);
  // сохранённые данные отправленной формы для отображения в модалке
  const [submittedData, setSubmittedData] = useState<CheckoutFormData | null>(null);

  // настройка react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormData>({
    defaultValues: {
      comment: "",
      paymentMethod: "card", // по умолчанию оплата картой
    },
  });

  // отслеживаем выбранный способ оплаты
  const paymentMethod = watch("paymentMethod");

  const watchedName = watch("name");
  const watchPhone = watch("phone");

  // эффект для автозаполнения имени, если пользователь авторизован
  useEffect(() => {
    if (user?.name) {
      setValue("name", user.name); // подставляем имя из профиля
    }
  }, [user, setValue]);

  // если корзина пуста - показываем сообщение и ссылку на меню
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-600 mb-4">Нечего формлять</p>
        <Link to="/menu" className="text-rose-500 hover:text-rose-600 hover:underline transition">
          Перейти в меню
        </Link>
      </div>
    );
  }

  // обработчик отправки формы
  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true); // включаем состояние загрузки

    // формируем данные для отправки на сервер
    const orderData = {
      customer: {
        name: data.name,
        phone: data.phone,
        comment: data.comment,
        paymentMethod: data.paymentMethod,
      },
      items: items.map(item => ({
        id: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
      })),
      total: totalAmount,
      userId: user?.uid || null, // привязываем заказ к пользователю (если авторизован)
    };

    try {
      // отправляем POST-запрос на сервер для создания заказа
      await apiClient.post("/orders", orderData);
      setSubmittedData(data);      // сохраняем данные для модального окна
      setIsModalOpen(true);        // открываем модальное окно с подтверждением
    } catch (error) {
      alert("Не удалось отправить заказ. проверьте подключение к серверу.");
      setIsProcessing(false); // выключаем состояние загрузки
    }
  };

  // закрытие модального окна, очистка корзины и переход на главную
  const handleCloseModal = () => {
    setIsModalOpen(false);
    clearCart(); // очищаем корзину после успешного заказа
    navigate("/"); // перенаправляем на главную страницу
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* заголовок страницы */}
      <h1 className="text-4xl font-bold text-rose-800 mb-8 text-center">
        Оформление заказа
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* поле имени */}
        <div>
          <label className="block text-rose-700 font-medium mb-2">
            Ваше имя *
          </label>
          <input
            type="text"
            placeholder="Иван Иванов"
            className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
            {...register("name", { required: "Укажите ваше имя" })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* поле телефона */}
        <div>
          <label className="block text-rose-700 font-medium mb-2">
            телефон *
          </label>
          <input
            type="tel"
            placeholder="+7 (999) 123-45-67"
            className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
            {...register("phone", { required: "Укажите номер телефона" })}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* поле комментария к заказу (необязательное) */}
        <div>
          <label className="block text-rose-700 font-medium mb-2">
            Комментарий к заказу
          </label>
          <textarea
            rows={3}
            placeholder="Пожелания, аллергии..."
            className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
            {...register("comment")}
          />
        </div>

        {/* выбор способа оплаты */}
        <div>
          <label className="block text-rose-700 font-medium mb-2">
            Способ оплаты
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="card"
                className="accent-rose-500 w-4 h-4"
                {...register("paymentMethod")}
              />
              <span className="text-rose-700">Картой онлайн</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="cash"
                className="accent-rose-500 w-4 h-4"
                {...register("paymentMethod")}
              />
              <span className="text-rose-700">Наличными при получении</span>
            </label>
          </div>
        </div>

        {/* блок с составом заказа */}
        <div className="bg-pink-50 rounded-xl p-5 border border-pink-100">
          <h3 className="font-bold text-rose-800 mb-3">Ваш заказ:</h3>
          {/* список товаров в корзине */}
          {items.map((item) => (
            <div key={item.menuItem.id} className="flex justify-between text-rose-600 py-1">
              <span>
                {item.menuItem.name} × {item.quantity}
              </span>
              <span className="font-medium">{item.menuItem.price * item.quantity} ₽</span>
            </div>
          ))}
          {/* итоговая сумма */}
          <div className="border-t border-pink-200 mt-3 pt-3 flex justify-between font-bold text-lg">
            <span className="text-rose-800">Итого:</span>
            <span className="text-rose-500">{totalAmount} ₽</span>
          </div>
        </div>

        {/* кнопка отправки заказа */}
        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full py-4 text-lg bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition shadow-sm disabled:opacity-50"
        >
          {isProcessing ? "обработка платежа..." : "оформить заказ"}
        </Button>
      </form>

      {/* модальное окно подтверждения успешного заказа */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Заказ оформлен!"
      >
        <div className="text-center">
          <p className="text-rose-700 mb-4">
            {submittedData?.name}, Спасибо за заказ!
          </p>
          <p className="text-rose-600 mb-4">
            Мы свяжемся с вами по номеру {submittedData?.phone}
          </p>
          <Button 
            onClick={handleCloseModal} 
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full transition"
          >
            На главную
          </Button>
        </div>
      </Modal>
    </div>
  );
}