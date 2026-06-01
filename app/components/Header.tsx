import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { LuUser, LuLogOut, LuLogIn, LuShoppingCart, LuHistory } from "react-icons/lu";

// Экспортируем компонент Header по умолчанию
export default function Header() {
    // Получаем данные пользователя, состояние загрузки и функцию выхода из хука аутентификации
    const { user, loading, logout } = useAuth();
    // Получаем общее количество товаров из корзины
    const { totalCount } = useCart();
    // Хук для навигации (программное перенаправление)
    const navigate = useNavigate();
    // Состояние открытия/закрытия выпадающего меню пользователя
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Ссылка на DOM-элемент меню для отслеживания кликов вне его
    const menuRef = useRef<HTMLDivElement>(null);
    // Функция выхода из аккаунта с перенаправлением на главную страницу
    const handleLogout = async () => {
        setIsMenuOpen(false);
        await logout();
        navigate("/");
    };

    return (
        <header className="bg-rose-700 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Логотип/название ресторана — ссылка на главную */}
                <Link to="/" className="text-2xl font-bold tracking-wide hover:text-pink-200 transition-colors">
                    Quexty
                </Link>

                {/* Навигационное меню */}
                <div className="flex gap-8 text-lg items-center">
                    {/* Ссылка на главную */}
                    <NavLink to="/" className={({ isActive }) => 
                        isActive ? "text-pink-300 font-medium" : "text-white hover:text-pink-200 transition-colors"
                    }>
                        Главная
                    </NavLink>

                    {/* Ссылка на меню */}
                    <NavLink to="/menu" className={({ isActive }) => 
                        isActive ? "text-pink-300 font-medium" : "text-white hover:text-pink-200 transition-colors"
                    }>
                        Меню
                    </NavLink>

                    {/* Ссылка на корзину с счётчиком */}
                    <NavLink 
                       to="/cart" 
                       className={({ isActive }) => isActive ? "text-pink-300 font-medium flex items-center gap-1" : "text-white hover:text-pink-200 transition-colors flex items-center gap-1"
                    }>
                        <LuShoppingCart className="w-5 h-5" />
                        <span>Корзина</span>
                    </NavLink>

                    {/* Ссылка "О нас" */}
                    <NavLink
                     to="/about" 
                     className={({ isActive }) =>  isActive ? "text-pink-300 font-medium" : "text-white hover:text-pink-200 transition-colors"
                    }>
                        О нас
                    </NavLink>

                    <span className="w-px h-6 bg-rose-600"></span>

                    {/* Блок авторизации */}
                    {!loading && (
                        user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-2 bg-rose-600/40 px-4 py-2 rounded-xl border border-rose-500/50 hover:bg-rose-600/60 transition-colors"
                                >
                                    <LuUser className="w-5 h-5 text-pink-200" />
                                    <span className="text-sm font-medium max-w-[120px] truncate" title={user.name}>
                                        {user.name}
                                    </span>
                                </button>

                                {/* Выпадающее меню пользователя */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl py-2 border border-pink-100 z-20 text-rose-800 animate-in fade-in slide-in-from-top-1 duration-100 shadow-lg">
                                        <Link
                                            to="/orders"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-pink-50 text-rose-900 transition-colors"
                                        >
                                            <LuHistory className="w-4 h-4 text-rose-400" />
                                            <span>История заказов</span>
                                        </Link>
                                        <hr className="border-pink-100 my-1" />
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-pink-50 text-rose-900 transition-colors"
                                        >
                                            <LuLogOut className="w-4 h-4 text-rose-400" />
                                            <span>Выйти</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/auth"
                                className="flex items-center gap-2 bg-white text-rose-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-pink-100 transition-colors shadow-sm"
                            >
                                <LuLogIn className="w-4 h-4" />
                                <span>Войти</span>
                            </Link>
                        )
                    )}
                </div>
            </div>
        </header>
    );
}