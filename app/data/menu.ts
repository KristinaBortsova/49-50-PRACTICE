import type { MenuItem } from "../types";

export const menuData: MenuItem[] = [
    // Закуски
    {
        id: 1,
        name: "Брускетта с томатами",
        description: "Хрустящий багет с вялеными томатами, чесноком и оливковым маслом",
        price: 220,
        category: "Закуски",
        image: new URL("../assets/bruschetta.avif", import.meta.url).href,
    },
    {
        id: 2,
        name: "Карпаччо из лосося",
        description: "Тонко нарезанный слабосоленый лосось с лимоном и каперсами",
        price: 380,
        category: "Закуски",
        image: new URL("../assets/salmon_carpaccio.avif", import.meta.url).href,
    },
    {
        id: 3,
        name: "Сырная тарелка",
        description: "Три сорта сыра: дор блю, пармезан и бри с медовыми сотами",
        price: 450,
        category: "Закуски",
        image: new URL("../assets/cheese_plate.avif", import.meta.url).href, 
    },
    {
        id: 4,
        name: "Жюльен с грибами",
        description: "Шампиньоны в сливочном соусе под сырной корочкой",
        price: 310,
        category: "Закуски",
        image: new URL("../assets/julienne.avif", import.meta.url).href,
    },

    // Основные блюда
    {
        id: 5,
        name: "Лазанья болоньезе",
        description: "Слоеная паста с мясным соусом, бешамель и пармезаном",
        price: 490,
        category: "Основные блюда",
        image: new URL("../assets/lasagna.avif", import.meta.url).href, 
    },
    {
        id: 6,
        name: "Рис с овощами и тофу",
        description: "Обжаренный рис с болгарским перцем, кукурузой, тофу и соевым соусом",
        price: 370,
        category: "Основные блюда",
        image: new URL("../assets/rice_with_tofu.avif", import.meta.url).href,
    },
    {
        id: 7,
        name: "Свиные ребрышки гриль",
        description: "Ребрышки в барбекю-соусе с печеным картофелем",
        price: 680,
        category: "Основные блюда",
        image: new URL("../assets/ribs.avif", import.meta.url).href, 
    },

    // Десерты
    {
        id: 8,
        name: "Панна котта",
        description: "Нежный сливочный десерт с малиновым соусом и свежей мятой",
        price: 280,
        category: "Десерты",
        image: new URL("../assets/panna_cotta.avif", import.meta.url).href,  
    },
    {
        id: 9,
        name: "Шоколадный фондан",
        description: "Кекс с жидкой шоколадной начинкой и шариком ванильного мороженого",
        price: 350,
        category: "Десерты",
        image: new URL("../assets/fondant.avif", import.meta.url).href, 
    },

    // Напитки
    {
        id: 10,
        name: "Смузи клубника-банан",
        description: "Освежающий смузи из клубники, банана и йогурта",
        price: 210,
        category: "Напитки",
        image: new URL("../assets/strawberry_banana_smoothie.avif", import.meta.url).href,
    },
];