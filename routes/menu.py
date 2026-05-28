# Импорт Flask-компонентов:
# - Blueprint - для группировки маршрутов в отдельный модуль
# - jsonify - для преобразования Python-объектов в JSON-ответ
# - request - для доступа к данным HTTP-запроса
from flask import Blueprint, jsonify, request

# Импорт подключения к Firebase Firestore из конфигурационного файла
# db - это клиент для работы с базой данных
from config.firebase import db

# Импорт массива с начальными данными меню (блюда по умолчанию)
from data.menu_data import DEFAULT_MENU

# Создание Blueprint для маршрутов меню
# Этот Blueprint будет зарегистрирован в server.py с префиксом '/api'
menu_bp = Blueprint('menu', __name__)


# Функция для первоначального заполнения базы данных, если она пуста
def seed_menu_if_empty():
    # Проверяем, подключена ли база данных
    # Если db = None, значит Firebase не инициализирован (ошибка конфигурации)
    if db is None:
        return
    
    try:
        # Получаем доступ к коллекции "menu" в Firestore
        menu_ref = db.collection("menu")
        
        # Проверяем, есть ли хотя бы один документ в коллекции
        # limit(1) - берем только один документ для экономии ресурсов
        docs = menu_ref.limit(1).get()
        
        # Если документов нет (коллекция пуста) - заполняем
        if len(docs) == 0:
            print("База данных пуста. Заполняю меню оригинальными блюдами...")
            
            # Проходим по каждому блюду
            for item in DEFAULT_MENU:
                # Сохраняем блюдо в Firestore
                # используем id блюда как имя документа
                # .set(item) - записываем данные
                menu_ref.document(str(item["id"])).set(item)
            
            print("Наполнение базы успешно завершено!")
            
    except Exception as e:
        # Если произошла ошибка (проблемы с сетью, доступом и т.д.)
        print(f"Не удалось проверить или заполнить меню: {e}")


# Эндпоинт для получения всего меню
# Метод: GET
# URL: /api/menu (полный путь, с учетом префикса из server.py)
@menu_bp.route("/menu", methods=["GET"])
def get_menu():
    # Проверяем доступность базы данных
    if db is None:
        # Возвращаем ошибку 500 (Internal Server Error)
        return jsonify({"error": "База данных недоступна"}), 500
    
    try:
        # Проверяем и при необходимости заполняем базу данных меню
        # Это гарантирует, что при первом запросе данные появятся
        seed_menu_if_empty()
        
        # Получаем все документы из коллекции "menu"
        # stream() возвращает итератор по документам
        menu_ref = db.collection("menu").stream()
        
        # Список для хранения блюд
        menu_list = []
        
        # Получаем базовый URL сервера
        # Это нужно для формирования полных путей к изображениям
        base_url = request.host_url
        
        # Проходим по каждому документу в коллекции
        for doc in menu_ref:
            # Преобразуем документ Firestore в Python-словарь
            item = doc.to_dict()
            
            # Формируем полный URL для изображения
            # В БД хранится только имя файла
            # Добавляем путь /assets/ и базовый URL сервера
            item["image"] = f"{base_url}assets/{item['image']}"
            
            # Добавляем блюдо в список
            menu_list.append(item)
        
        # Сортируем блюда по id (по возрастанию)
        # lambda x: x.get("id", 0) - берем поле id, если его нет - используем 0
        menu_list.sort(key=lambda x: x.get("id", 0))
        
        # Возвращаем список блюд в формате JSON со статусом 200 (OK)
        return jsonify(menu_list), 200
        
    except Exception as e:
        # При любой ошибке возвращаем JSON с описанием и статус 500
        return jsonify({"error": str(e)}), 500