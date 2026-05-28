# Импорт Flask-компонентов:
# - Blueprint - для группировки маршрутов отзывов
# - jsonify - для отправки JSON-ответов
# - request - для доступа к данным запроса (JSON body)
from flask import Blueprint, jsonify, request

# Импорт подключения к Firebase Firestore
from config.firebase import db

# Импорт Firestore для использования SERVER_TIMESTAMP и сортировки
from firebase_admin import firestore

# Создание Blueprint для маршрутов отзывов
# Будет зарегистрирован в server.py с префиксом '/api'
reviews_bp = Blueprint('reviews', __name__)

#Возвращает список всех отзывов, отсортированных по дате (сначала новые)
@reviews_bp.route("/reviews", methods=["GET"])
def get_reviews():
    # Проверка подключения к базе данных
    if db is None:
        return jsonify({"error": "База данных недоступна"}), 500
    
    try:
        # Получаем все отзывы из коллекции "reviews"
        reviews_ref = db.collection("reviews")\
            .order_by("created_at", direction=firestore.Query.DESCENDING)\
            .stream()
        
        # Преобразуем документы Firestore в список словарей
        reviews_list = []
        for doc in reviews_ref:
            # Преобразуем документ в словарь
            r = doc.to_dict()
            
            # Добавляем ID документа в словарь (он не входит в to_dict())
            r["id"] = doc.id
            
            # Преобразуем временную метку Firestore в строковый формат ISO
            if "created_at" in r and r["created_at"]:
                try:
                    # isoformat() преобразует Timestamp в строку вида "2024-01-15T14:30:00"
                    r["created_at"] = r["created_at"].isoformat()
                except AttributeError:
                    # Если isoformat недоступен, просто преобразуем в строку
                    r["created_at"] = str(r["created_at"])
            
            # Добавляем отзыв в итоговый список
            reviews_list.append(r)
        
        # Возвращаем список отзывов в формате JSON со статусом 200
        return jsonify(reviews_list), 200
        
    except Exception as e:
        # При любой ошибке возвращаем статус 500
        return jsonify({"error": str(e)}), 500

# Сохраняет новый отзыв в базу данных
@reviews_bp.route("/reviews", methods=["POST"])
def add_review():
    # Проверка подключения к базе данных
    if db is None:
        return jsonify({"error": "База данных недоступна"}), 500
    
    # Получаем JSON из тела запроса
    data = request.json
    
    # Валидация входных данных: проверяем наличие обязательных полей
    # "name" - имя автора отзыва
    # "text" - текст отзыва
    if not data or "name" not in data or "text" not in data:
        return jsonify({"error": "Имя и текст отзыва обязательны"}), 400

    try:
        # Формируем структуру отзыва для сохранения в БД
        new_review = {
            # Имя автора (обязательное поле)
            "name": data["name"],
            # Оценка - от 1 до 5, если не передана - по умолчанию 5
            # get - берет значение rating, если его нет - использует 5
            "rating": data.get("rating", 5),
            # Текст отзыва (обязательное поле)
            "text": data["text"],
            # Автоматическая временная метка от Firebase (серверное время)
            "created_at": firestore.SERVER_TIMESTAMP
        }
        
        # Сохраняем отзыв в коллекцию "reviews"
        # add() автоматически генерирует уникальный ID документа
        db.collection("reviews").add(new_review)
        
        # Возвращаем успешный ответ со статусом 201
        return jsonify({"success": True}), 201
        
    except Exception as e:
        # При любой ошибке возвращаем статус 500
        return jsonify({"error": str(e)}), 500