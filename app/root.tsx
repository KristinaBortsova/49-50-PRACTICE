import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
// Импорт компонентов
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { AuthProvider } from "~/hooks/useAuth";
import { CartProvider } from "~/hooks/useCart";
// Импорт глобальных стилей
import "./app.css"

// Экспорт компонента RootLayout по умолчанию
export default function RootLayout() {
    return (
        <html lang="ru">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />  {/* Компонент React Router для мета-тегов */}
                <Links />  {/* Компонент React Router для ссылок */}
            </head>
            <body className="bg-pink-50">  {/*добавлен фон для body */}
                 <AuthProvider>
                {/* Провайдер корзины — оборачивает всё приложение */}
                <CartProvider>
                    {/* Основной контейнер: минимальная высота экрана, колонка */}
                    <div className="min-h-screen flex flex-col"> 
                        {/* Шапка сайта */}
                        <Header />
                        {/* Основной контент: растягивается, максимальная ширина, центрирование */}
                        <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
                            <Outlet />  {/* Здесь рендерятся дочерние маршруты */}
                        </main>
                        {/* Подвал сайта */}
                        <Footer />
                    </div>
                </CartProvider>
         </AuthProvider>

                {/* Вспомогательные компоненты React Router */}
                <ScrollRestoration />  {/* Восстанавливает позицию скролла при навигации */}
                <Scripts />  {/* Подключает JS-скрипты */}
            </body>
        </html>
    );
}