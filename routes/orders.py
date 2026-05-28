# Импорт Flask-компонентов:
# - Blueprint - для группировки маршрутов заказов
# - jsonify - для отправки JSON-ответов
# - request - для доступа к данным запроса
from flask import Blueprint, jsonify, request

# Импорт подключения к Firebase Firestore
from config.firebase import db

# Импорт специального поля Firestore для автоматической вставки времени на сервере
from firebase_admin import firestore

# Создание Blueprint для маршрутов заказов
# Будет зарегистрирован в server.py с префиксом '/api'
orders_bp = Blueprint('orders', __name__)

# Принимает данные заказа и сохраняет их в Firestore
@orders_bp.route("/orders", methods=["POST"])
def create_order():
    # Проверка подключения к базе данных
    if db is None:
        return jsonify({"error": "База данных недоступна"}), 500
    
    # Получаем JSON из тела запроса
    data = request.json
    
    # Валидация входных данных: проверяем наличие обязательных полей
    # "customer" - информация о клиенте (имя, телефон, комментарий)
    # "items" - список товаров в заказе
    if not data or "customer" not in data or "items" not in data:
        return jsonify({"error": "Неполные данные заказа."}), 400

    try:
        # Формируем структуру заказа для сохранения в БД
        new_order = {
            # Информация о клиенте (приходит из фронтенда)
            "customer": data["customer"],
            # Список товаров (приходит из фронтенда)
            "items": data["items"],
            # Итоговая сумма заказа (по умолчанию 0, если не передана)
            "total": data.get("total", 0),
            # ID пользователя из Firebase Auth (привязка заказа к конкретному пользователю)
            "userId": data.get("userId"),
            # Статус заказа - сначала "Новый", потом может меняться на "Готовится", "Доставлен" и т.д.
            "status": "Новый",
            # Автоматическая временная метка от Firebase (серверное время)
            # Используется SERVER_TIMESTAMP, а не клиентское время
            "created_at": firestore.SERVER_TIMESTAMP
        }
        
        # Сохраняем заказ в коллекцию "orders"
        # add() автоматически генерирует уникальный ID документа
        # _, doc_ref - игнорируем первый возвращаемый объект (WriteResult), берем только ссылку на документ
        _, doc_ref = db.collection("orders").add(new_order)
        
        # Выводим в консоль ID созданного заказа (для отладки)
        print(f"Получен новый заказ! ID в Firebase: {doc_ref.id}")
        
        # Возвращаем успешный ответ с ID заказа и статусом 201
        return jsonify({"success": True, "order_id": doc_ref.id}), 201
        
    except Exception as e:
        # При любой ошибке возвращаем статус 500
        return jsonify({"error": str(e)}), 500

# Возвращает список заказов, отфильтрованных по userId
@orders_bp.route("/orders", methods=["GET"])
def get_orders():
    # Проверка подключения к базе данных
    if db is None:
        return jsonify({"error": "База данных недоступна"}), 500

    try:
        # Получаем параметр userId из строки запроса (query string)
        # Если параметр не передан, user_id будет None
        user_id = request.args.get("userId")
        
        # Получаем ссылку на коллекцию "orders"
        orders_ref = db.collection("orders")

        # Формируем запрос с фильтрацией (если указан userId)
        if user_id:
            # Создаем запрос с условием: поле "userId" равно значению user_id
            query = orders_ref.where(filter=firestore.FieldFilter("userId", "==", user_id))
            # Выполняем запрос и получаем итератор с результатами
            docs = query.stream()
        else:
            # Если userId не указан - возвращаем все заказы 
            docs = orders_ref.stream()

        # Преобразуем документы Firestore в список словарей
        orders_list = []
        for doc in docs:
            # Преобразуем документ в словарь
            order_data = doc.to_dict()
            
            # Добавляем ID документа в словарь
            order_data["id"] = doc.id
            
            # Преобразуем временную метку Firestore в строковый формат ISO
            if "created_at" in order_data and order_data["created_at"]:
                try:
                    # isoformat() преобразует Timestamp в строку вида "2024-01-15T14:30:00"
                    order_data["created_at"] = order_data["created_at"].isoformat()
                except AttributeError:
                    # Если isoformat недоступен, преобразуем в строку
                    order_data["created_at"] = str(order_data["created_at"])
            
            # Добавляем заказ в итоговый список
            orders_list.append(order_data)

        # Возвращаем список заказов в формате JSON со статусом 200
        return jsonify(orders_list), 200
        
    except Exception as e:
        # При любой ошибке возвращаем статус 500
        return jsonify({"error": str(e)}), 500