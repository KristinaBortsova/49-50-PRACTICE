// Импортируем необходимые хуки из React
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// Импортируем функции Firebase для работы с аутентификацией
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase.config";

// Импортируем тип профиля пользователя
import type { UserProfile } from "../types";

// Интерфейс значений контекста аутентификации
interface AuthContextValue {
    user: UserProfile | null;        // Текущий пользователь (null = не авторизован)
    loading: boolean;                // Флаг загрузки (проверка статуса аутентификации)
    logout: () => Promise<void>;     // Функция выхода из аккаунта
}

// Создаём контекст с начальным значением null
const AuthContext = createContext<AuthContextValue | null>(null);

// Провайдер аутентификации - оборачивает приложение и предоставляет данные о пользователе
export function AuthProvider({ children }: { children: ReactNode }) {
    // Состояние текущего пользователя
    const [user, setUser] = useState<UserProfile | null>(null);
    
    // Состояние загрузки (пока проверяем, авторизован ли пользователь)
    const [loading, setLoading] = useState(true);

    // Эффект для отслеживания изменения статуса аутентификации
    useEffect(() => {
        // Подписываемся на изменения состояния аутентификации Firebase
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Если пользователь авторизован - создаём объект UserProfile
                setUser({
                    uid: firebaseUser.uid,                                    // ID пользователя
                    email: firebaseUser.email,                                // Email
                    name: firebaseUser.displayName ||                         // Имя из профиля, или
                          firebaseUser.email?.split("@")[0] ||                // часть email до @, или
                          "Пользователь",                                     // стандартное значение
                });
            } else {
                // Если не авторизован - очищаем состояние
                setUser(null);
            }
            // Загрузка завершена
            setLoading(false);
        });

        // Отписываемся при размонтировании компонента
        return () => unsubscribe();
    }, []); // Пустой массив зависимостей - эффект срабатывает один раз при монтировании

    // Функция выхода из аккаунта
    const logout = async () => {
        await signOut(auth); // Вызываем signOut из Firebase
        // После выхода onAuthStateChanged автоматически обновит состояние user
    };

    // Провайдер передаёт значения контекста всем дочерним компонентам
    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {/* Рендерим детей только когда загрузка завершена  */}
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Кастомный хук для удобного использования контекста аутентификации
export function useAuth() {
    // Получаем значение из контекста
    const context = useContext(AuthContext);
    
    // Проверяем, что хук используется внутри провайдера
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    
    // Возвращаем значение контекста
    return context;
}