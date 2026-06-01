// Импортируем типы из React: ButtonHTMLAttributes (стандартные атрибуты кнопки) и ReactNode (для children)
import type { ButtonHTMLAttributes, ReactNode } from "react";

// Интерфейс пропсов компонента Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode; // Содержимое кнопки (текст, иконки, другие элементы)
    variant?: "primary" | "secondary"; // Вариант стиля кнопки: основной или второстепенный
}

// Экспортируем компонент Button по умолчанию
export default function Button({
    children,                               // Содержимое кнопки
    variant = "primary",                    // Вариант стиля, по умолчанию "primary"
    className = "",                         // Дополнительные CSS-классы (можно передать извне)
    ...props                                // Все остальные стандартные атрибуты кнопки (onClick, disabled, type и т.д.)
}: ButtonProps) {
    // Базовые CSS-классы для всех кнопок
    const baseClass = "px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50";
    // Объект с вариантами стилей 
    const variants = {
        // Основная кнопка: насыщенный розовый фон с тёмно-розовым при наведении
        primary: "bg-rose-400 text-white hover:bg-rose-500",
        // Второстепенная кнопка: бледно-розовый фон с розово-серым текстом
        secondary: "bg-pink-100 text-rose-700 hover:bg-pink-200",
    };
    // Объединяем базовые классы, вариант стиля и пользовательские классы
    return (
        <button
            className={`${baseClass} ${variants[variant]} ${className}`}  // Объединяем все классы
            {...props}  // Передаём все остальные атрибуты (onClick, disabled, type, id и т.д.)
        >
            {children}
        </button>
    );
}