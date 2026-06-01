// Импортируем типы и вспомогательные функции для создания маршрутов из React Router
import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Экспортируем массив маршрутов по умолчанию
export default [
    // Главная страница
    index("routes/home.tsx"),
    // Страница меню
    route("menu", "routes/menu.tsx"),
    // Страница корзины
    route("cart", "routes/cart.tsx"),
    // Страница оформления заказа
    route("checkout", "routes/checkout.tsx"),
    // Страница "О нас"
    route("about", "routes/about.tsx"),
    // Страница авторизации
    route("auth", "routes/auth.tsx"),
    // Страница истории заказов
    route("orders", "routes/orders.tsx"),
] satisfies RouteConfig;