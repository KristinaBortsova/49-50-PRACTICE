import axios from "axios";
import { API_URL } from "../config";

// Создаем экземпляр axios с базовыми настройками
export const apiClient = axios.create({
    baseURL: API_URL, // Базовый URL для всех запросов API
    headers: {
        "Content-Type": "application/json", // Устанавливаем формат данных JSON
    },
});

// Перехватчик ответов для обработки ошибок
apiClient.interceptors.response.use(
    (response) => response, // При успешном ответе просто возвращаем его
    (error) => {
        // Логируем ошибку: либо данные из ответа сервера, либо текст ошибки
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error); // Пробрасываем ошибку дальше
    }
);

export default apiClient;