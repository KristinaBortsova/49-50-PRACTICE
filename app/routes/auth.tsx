// страница авторизации (вход и регистрация)

import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { auth } from "../firebase.config";

// тип данных формы
interface AuthFormData {
  name?: string;           // имя пользователя (только для регистрации)
  email: string;           // email пользователя
  password: string;        // пароль
  confirmPassword?: string; // подтверждение пароля (только для регистрации)
}

// метаданные страницы (заголовок для SEO)
export function meta() {
  return [{ title: "Авторизация | Quexty" }];
}

// Экспортируем компонент AuthPage по умолчанию
export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);     // режим: true - вход, false - регистрация
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // настройка react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>();

  // обработка отправки формы
  const onSubmit = async (data: AuthFormData) => {
    setServerError(null);
    setIsLoading(true);

    // проверка совпадения паролей при регистрации
    if (!isLogin && data.password !== data.confirmPassword) {
      setServerError("пароли не совпадают");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // вход существующего пользователя
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        // регистрация нового пользователя
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          data.email, 
          data.password
        );
        // если указано имя, обновляем профиль пользователя
        if (data.name) {
          await updateProfile(userCredential.user, { displayName: data.name });
        }
      }
      // после успешной авторизации перенаправляем на страницу меню
      navigate("/menu");
    } catch (err: any) {
      // обработка специфических ошибок Firebase
      switch (err.code) {
        case "auth/email-already-in-use":
          setServerError("этот email уже зарегистрирован");
          break;
        case "auth/weak-password":
          setServerError("пароль слишком простой (минимум 6 символов)");
          break;
        case "auth/invalid-credential":
          setServerError("неверная почта или пароль");
          break;
        default:
          setServerError("ошибка доступа. попробуйте снова");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // переключение между режимами входа и регистрации
  const handleTabChange = (mode: boolean) => {
    setIsLogin(mode);
    setServerError(null);
    reset(); // сбрасываем значения формы
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        
        {/* переключатель режимов (вход / регистрация) */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => handleTabChange(true)}
            className={`flex-1 py-2 text-center font-medium rounded-lg transition ${
              isLogin 
                ? "bg-rose-500 text-white shadow-md" 
                : "bg-pink-100 text-rose-600 hover:bg-pink-200"
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => handleTabChange(false)}
            className={`flex-1 py-2 text-center font-medium rounded-lg transition ${
              !isLogin 
                ? "bg-rose-500 text-white shadow-md" 
                : "bg-pink-100 text-rose-600 hover:bg-pink-200"
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* сообщение об ошибке (если есть) */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        {/* форма авторизации */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* поле имени (только для режима регистрации) */}
          {!isLogin && (
            <div>
              <label className="block text-rose-800 font-medium mb-2">
                Имя
              </label>
              <input
                type="text"
                placeholder="Ваше имя"
                className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                {...register("name", { 
                  required: !isLogin ? "укажите ваше имя" : false 
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
          )}

          {/* поле email */}
          <div>
            <label className="block text-rose-800 font-medium mb-2">
              email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
              {...register("email", { 
                required: "укажите email",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "неверный формат email"
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* поле пароля */}
          <div>
            <label className="block text-rose-800 font-medium mb-2">
            Пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
              {...register("password", { 
                required: "укажите пароль",
                minLength: {
                  value: 6,
                  message: "пароль должен содержать минимум 6 символов"
                }
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* поле подтверждения пароля (только для режима регистрации) */}
          {!isLogin && (
            <div>
              <label className="block text-rose-800 font-medium mb-2">
                Подтвердите пароль
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                {...register("confirmPassword", { 
                  required: !isLogin ? "подтвердите пароль" : false 
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Обязательное поле
                </p>
              )}
            </div>
          )}

          {/* кнопка отправки формы */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium hover:bg-rose-600 transition disabled:opacity-50 mt-6 shadow-sm"
          >
            {isLoading 
              ? "загрузка..." 
              : isLogin 
                ? "Войти в личный кабинет" 
                : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
}