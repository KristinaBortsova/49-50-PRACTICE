// Импортируем тип RestaurantInfo из папки ~/types
import type { RestaurantInfo } from "../types";

// Экспортируем константу restaurantInfo, содержащую фактическую информацию о ресторане
export const restaurantInfo: RestaurantInfo = {
    // Название ресторана
    name: "Quexty",
    // Физический адрес заведения
    address: "Красный проспект, 17/1",
    // Контактный телефон
    phone: "+7 (960) 790-88-99",
    // Режим работы
    workHours: "Пн-Сб: 10:00 - 21:00",
};