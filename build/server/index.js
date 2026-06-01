import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Link, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx, jsxs } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from "react";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), streamTimeout + 1e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/components/Header.tsx
function Header() {
	return /* @__PURE__ */ jsx("header", {
		className: "bg-rose-800 text-white shadow-md",
		children: /* @__PURE__ */ jsxs("nav", {
			className: "max-w-6xl mx-auto px-4 py-4 flex justify-between items-center",
			children: [/* @__PURE__ */ jsx(Link, {
				to: "/",
				className: "text-2xl font-bold hover:text-pink-200 transition-colors",
				children: "Quexty"
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex gap-8 text-lg",
				children: [
					/* @__PURE__ */ jsx(NavLink, {
						to: "/",
						className: ({ isActive }) => isActive ? "text-pink-300 border-b-2 border-pink-300" : "text-white hover:text-pink-200 transition-colors",
						children: "Главная"
					}),
					/* @__PURE__ */ jsx(NavLink, {
						to: "/menu",
						className: ({ isActive }) => isActive ? "text-pink-300 border-b-2 border-pink-300" : "text-white hover:text-pink-200 transition-colors",
						children: "Меню"
					}),
					/* @__PURE__ */ jsx(NavLink, {
						to: "/cart",
						className: ({ isActive }) => isActive ? "text-pink-300 border-b-2 border-pink-300" : "text-white hover:text-pink-200 transition-colors",
						children: "Корзина"
					}),
					/* @__PURE__ */ jsx(NavLink, {
						to: "/about",
						className: ({ isActive }) => isActive ? "text-pink-300 border-b-2 border-pink-300" : "text-white hover:text-pink-200 transition-colors",
						children: "О нас"
					})
				]
			})]
		})
	});
}
//#endregion
//#region app/data/restaurant.ts
var restaurantInfo = {
	name: "Quexty",
	address: "Красный проспект, 17/1",
	phone: "+7 (960) 790-88-99",
	workHours: "Пн-Сб: 10:00 - 21:00"
};
//#endregion
//#region app/components/Footer.tsx
function Footer() {
	return /* @__PURE__ */ jsx("footer", {
		className: "bg-gradient-to-r from-rose-800 to-pink-600 text-pink-100 py-8 mt-12 shadow-inner",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-6xl mx-auto px-4 text-center",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-lg font-bold text-white mb-2 drop-shadow-sm",
					children: restaurantInfo.name
				}),
				/* @__PURE__ */ jsx("p", { children: restaurantInfo.address }),
				/* @__PURE__ */ jsx("p", { children: restaurantInfo.phone }),
				/* @__PURE__ */ jsx("p", { children: restaurantInfo.workHours })
			]
		})
	});
}
//#endregion
//#region app/hooks/useCart.tsx
var CartContext = createContext(null);
function CartProvider({ children }) {
	const [items, setItems] = useState([]);
	const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0), [items]);
	const totalCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
	const addItem = (menuItem) => {
		setItems((prev) => {
			if (prev.find((item) => item.menuItem.id === menuItem.id)) return prev.map((item) => item.menuItem.id === menuItem.id ? {
				...item,
				quantity: item.quantity + 1
			} : item);
			return [...prev, {
				menuItem,
				quantity: 1
			}];
		});
	};
	const updateQuantity = (id, newQty) => {
		setItems((prev) => {
			return prev.map((item) => item.menuItem.id === id ? {
				...item,
				quantity: newQty
			} : item).filter((item) => item.quantity > 0);
		});
	};
	const removeItem = (id) => {
		setItems((prev) => prev.filter((item) => item.menuItem.id !== id));
	};
	const clearCart = () => {
		setItems([]);
	};
	return /* @__PURE__ */ jsx(CartContext.Provider, {
		value: {
			items,
			totalAmount,
			totalCount,
			addItem,
			updateQuantity,
			removeItem,
			clearCart
		},
		children
	});
}
function useCart() {
	const context = useContext(CartContext);
	if (!context) throw new Error("useCart must be used within a CartProvider");
	return context;
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({ default: () => root_default });
var root_default = UNSAFE_withComponentProps(function RootLayout() {
	return /* @__PURE__ */ jsxs("html", {
		lang: "ru",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			"  ",
			/* @__PURE__ */ jsx(Links, {}),
			"  "
		] }), /* @__PURE__ */ jsxs("body", {
			className: "bg-pink-50",
			children: [
				"  ",
				/* @__PURE__ */ jsx(CartProvider, { children: /* @__PURE__ */ jsxs("div", {
					className: "min-h-screen flex flex-col",
					children: [
						/* @__PURE__ */ jsx(Header, {}),
						/* @__PURE__ */ jsxs("main", {
							className: "flex-grow max-w-6xl mx-auto px-4 py-8 w-full",
							children: [/* @__PURE__ */ jsx(Outlet, {}), "  "]
						}),
						/* @__PURE__ */ jsx(Footer, {})
					]
				}) }),
				/* @__PURE__ */ jsx(ScrollRestoration, {}),
				"  ",
				/* @__PURE__ */ jsx(Scripts, {}),
				"  "
			]
		})]
	});
});
//#endregion
//#region app/routes/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({
	default: () => home_default,
	meta: () => meta$4
});
function meta$4() {
	return [{ title: "Quexty — Ресторан изысканной кухни" }];
}
var home_default = UNSAFE_withComponentProps(function HomePage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "text-center space-y-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-5xl font-bold text-rose-900 mt-12",
				children: restaurantInfo.name
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-xl text-rose-700 max-w-2xl mx-auto",
				children: "Изысканная кухня в центре города :з"
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/menu",
				className: "inline-block bg-rose-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-rose-700 transition-colors",
				children: "Смотреть меню"
			})
		]
	});
});
//#endregion
//#region app/data/menu.ts
var menuData = [
	{
		id: 1,
		name: "Брускетта с томатами",
		description: "Хрустящий багет с вялеными томатами, чесноком и оливковым маслом",
		price: 220,
		category: "Закуски",
		image: new URL("../assets/bruschetta.avif", import.meta.url).href
	},
	{
		id: 2,
		name: "Карпаччо из лосося",
		description: "Тонко нарезанный слабосоленый лосось с лимоном и каперсами",
		price: 380,
		category: "Закуски",
		image: new URL("../assets/salmon_carpaccio.avif", import.meta.url).href
	},
	{
		id: 3,
		name: "Сырная тарелка",
		description: "Три сорта сыра: дор блю, пармезан и бри с медовыми сотами",
		price: 450,
		category: "Закуски",
		image: new URL("../assets/cheese_plate.avif", import.meta.url).href
	},
	{
		id: 4,
		name: "Жюльен с грибами",
		description: "Шампиньоны в сливочном соусе под сырной корочкой",
		price: 310,
		category: "Закуски",
		image: new URL("../assets/julienne.avif", import.meta.url).href
	},
	{
		id: 5,
		name: "Лазанья болоньезе",
		description: "Слоеная паста с мясным соусом, бешамель и пармезаном",
		price: 490,
		category: "Основные блюда",
		image: new URL("../assets/lasagna.avif", import.meta.url).href
	},
	{
		id: 6,
		name: "Рис с овощами и тофу",
		description: "Обжаренный рис с болгарским перцем, кукурузой, тофу и соевым соусом",
		price: 370,
		category: "Основные блюда",
		image: new URL("../assets/rice_with_tofu.avif", import.meta.url).href
	},
	{
		id: 7,
		name: "Свиные ребрышки гриль",
		description: "Ребрышки в барбекю-соусе с печеным картофелем",
		price: 680,
		category: "Основные блюда",
		image: new URL("../assets/ribs.avif", import.meta.url).href
	},
	{
		id: 8,
		name: "Панна котта",
		description: "Нежный сливочный десерт с малиновым соусом и свежей мятой",
		price: 280,
		category: "Десерты",
		image: new URL("../assets/panna_cotta.avif", import.meta.url).href
	},
	{
		id: 9,
		name: "Шоколадный фондан",
		description: "Кекс с жидкой шоколадной начинкой и шариком ванильного мороженого",
		price: 350,
		category: "Десерты",
		image: new URL("../assets/fondant.avif", import.meta.url).href
	},
	{
		id: 10,
		name: "Смузи клубника-банан",
		description: "Освежающий смузи из клубники, банана и йогурта",
		price: 210,
		category: "Напитки",
		image: new URL("../assets/strawberry_banana_smoothie.avif", import.meta.url).href
	}
];
//#endregion
//#region app/components/MenuCard.tsx
function MenuCard({ item, onAddToCart }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg hover:shadow-pink-200 transition-all duration-300",
		children: [/* @__PURE__ */ jsx("img", {
			src: item.image,
			alt: item.name,
			className: "w-full h-48 object-cover"
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between items-start mb-2",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-bold text-lg text-stone-800",
						children: item.name
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-rose-600 font-bold",
						children: [item.price, " ₽"]
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-stone-500 text-sm mb-4 line-clamp-2",
					children: item.description
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: () => onAddToCart(item),
					className: "w-full bg-rose-500 text-white py-2 rounded-xl hover:bg-rose-600 transition-colors duration-200 cursor-pointer",
					children: "В корзину"
				})
			]
		})]
	});
}
//#endregion
//#region app/routes/menu.tsx
var menu_exports = /* @__PURE__ */ __exportAll({
	default: () => menu_default,
	meta: () => meta$3
});
function meta$3() {
	return [{ title: "Меню | Quexty" }];
}
var menu_default = UNSAFE_withComponentProps(function MenuPage() {
	const categories = [
		"Все",
		"Закуски",
		"Основные блюда",
		"Десерты",
		"Напитки"
	];
	const [activeCategory, setActiveCategory] = useState("Все");
	const { totalCount, addItem } = useCart();
	const filteredMenu = activeCategory === "Все" ? menuData : menuData.filter((item) => item.category === activeCategory);
	const addToCart = (item) => {
		addItem(item);
	};
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "flex justify-between items-center mb-8",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-4xl font-bold text-rose-900",
				children: "Меню"
			}), /* @__PURE__ */ jsxs("span", {
				className: "bg-pink-100 text-rose-800 px-4 py-2 rounded-full",
				children: [totalCount, " блюд  "]
			})]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "flex gap-3 mb-8 flex-wrap",
			children: categories.map((cat) => /* @__PURE__ */ jsx("button", {
				onClick: () => setActiveCategory(cat),
				className: `px-5 py-2 rounded-full border transition-colors ${activeCategory === cat ? "bg-rose-500 text-white border-rose-500 shadow-md" : "bg-white text-rose-700 border-pink-200 hover:bg-pink-50 hover:border-pink-300"}`,
				children: cat
			}, cat))
		}),
		/* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
			children: filteredMenu.map((item) => /* @__PURE__ */ jsx(MenuCard, {
				item,
				onAddToCart: addToCart
			}, item.id))
		})
	] });
});
//#endregion
//#region app/routes/cart.tsx
var cart_exports = /* @__PURE__ */ __exportAll({
	default: () => cart_default,
	meta: () => meta$2
});
function meta$2() {
	return [{ title: "Корзина | Quexty" }];
}
var cart_default = UNSAFE_withComponentProps(function CartPage() {
	const { items, totalAmount, updateQuantity } = useCart();
	if (items.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "text-center py-20",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "text-2xl font-bold text-rose-800 mb-4",
			children: "Корзина пуста"
		}), /* @__PURE__ */ jsx(Link, {
			to: "/menu",
			className: "text-rose-500 hover:text-rose-600 hover:underline text-lg transition-colors",
			children: "Перейти в меню"
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-2xl mx-auto",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-3xl font-bold text-rose-800 mb-8",
				children: "Корзина"
			}),
			items.map((item) => /* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow border border-pink-100",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [
						/* @__PURE__ */ jsx("img", {
							src: item.menuItem.image,
							alt: item.menuItem.name,
							className: "w-20 h-20 object-cover rounded-lg"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex-grow",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-bold text-stone-800",
								children: item.menuItem.name
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-rose-600 font-medium",
								children: [item.menuItem.price, " ₽"]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => updateQuantity(item.menuItem.id, item.quantity - 1),
									className: "w-8 h-8 bg-pink-100 text-rose-600 rounded-full hover:bg-pink-200 transition-colors flex items-center justify-center font-bold",
									children: "−"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "w-8 text-center font-medium text-stone-700",
									children: item.quantity
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => updateQuantity(item.menuItem.id, item.quantity + 1),
									className: "w-8 h-8 bg-pink-100 text-rose-600 rounded-full hover:bg-pink-200 transition-colors flex items-center justify-center font-bold",
									children: "+"
								})
							]
						})
					]
				})
			}, item.menuItem.id)),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-pink-50 rounded-xl p-6 mt-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between text-xl font-bold mb-4",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-rose-800",
						children: "Итого:"
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-rose-800",
						children: [totalAmount, " ₽"]
					})]
				}), /* @__PURE__ */ jsx(Link, {
					to: "/checkout",
					className: "block text-center w-full bg-rose-500 text-white py-3 rounded-xl text-lg hover:bg-rose-600 transition-colors duration-200",
					children: "Оформить заказ"
				})]
			})
		]
	});
});
//#endregion
//#region app/components/ui/Modal.tsx
function Modal({ isOpen, onClose, children, title }) {
	if (!isOpen) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
			onClick: onClose
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-pink-100",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-center mb-4",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-xl font-bold text-rose-800",
						children: title
					}),
					"  ",
					/* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "text-rose-300 hover:text-rose-500 text-2xl leading-none transition-colors",
						children: "✕"
					})
				]
			}), children]
		})]
	});
}
//#endregion
//#region app/components/ui/Button.tsx
function Button({ children, variant = "primary", className = "", ...props }) {
	return /* @__PURE__ */ jsx("button", {
		className: `px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 ${{
			primary: "bg-rose-400 text-white hover:bg-rose-500",
			secondary: "bg-pink-100 text-rose-700 hover:bg-pink-200"
		}[variant]} ${className}`,
		...props,
		children
	});
}
//#endregion
//#region app/routes/checkout.tsx
var checkout_exports = /* @__PURE__ */ __exportAll({
	default: () => checkout_default,
	meta: () => meta$1
});
function meta$1() {
	return [{ title: "Оформление заказа | Quexty" }];
}
var checkout_default = UNSAFE_withComponentProps(function CheckoutPage() {
	const { items, totalAmount, clearCart } = useCart();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [comment, setComment] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("card");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	if (items.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "text-center py-20",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "text-2xl font-bold text-rose-700 mb-4",
			children: "Нечего оформлять"
		}), /* @__PURE__ */ jsx(Link, {
			to: "/menu",
			className: "text-rose-500 hover:text-rose-600 hover:underline text-lg transition-colors",
			children: "Перейти в меню"
		})]
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name.trim() || !phone.trim()) {
			alert("Заполните имя и телефон");
			return;
		}
		setIsProcessing(true);
		setTimeout(() => {
			setIsProcessing(false);
			setIsModalOpen(true);
		}, 2e3);
	};
	const handleCloseModal = () => {
		setIsModalOpen(false);
		clearCart();
		navigate("/");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-2xl mx-auto",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-4xl font-bold text-rose-800 mb-8 text-center",
				children: "Оформление заказа"
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-stone-700 font-medium mb-2",
						children: "Ваше имя *"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: name,
						onChange: (e) => setName(e.target.value),
						required: true,
						className: "w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all",
						placeholder: "Имя Фамилия"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-stone-700 font-medium mb-2",
						children: "Телефон *"
					}), /* @__PURE__ */ jsx("input", {
						type: "tel",
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						required: true,
						className: "w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all",
						placeholder: "+7 (999) 799-88-99"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-stone-700 font-medium mb-2",
						children: "Комментарий к заказу"
					}), /* @__PURE__ */ jsx("textarea", {
						value: comment,
						onChange: (e) => setComment(e.target.value),
						className: "w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all",
						rows: 3,
						placeholder: "Пожелания, аллергии, особые просьбы..."
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-stone-700 font-medium mb-2",
						children: "Способ оплаты"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-6",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 cursor-pointer",
							children: [/* @__PURE__ */ jsx("input", {
								type: "radio",
								value: "card",
								checked: paymentMethod === "card",
								onChange: () => setPaymentMethod("card"),
								className: "accent-rose-500 w-4 h-4"
							}), "Картой онлайн"]
						}), /* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 cursor-pointer",
							children: [/* @__PURE__ */ jsx("input", {
								type: "radio",
								value: "cash",
								checked: paymentMethod === "cash",
								onChange: () => setPaymentMethod("cash"),
								className: "accent-rose-500 w-4 h-4"
							}), "Наличными"]
						})]
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-pink-50 rounded-2xl p-5 border border-pink-100",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-bold text-rose-800 mb-3",
							children: "Ваш заказ: "
						}), items.map((item) => /* @__PURE__ */ jsxs("div", {
							className: "flex justify-between text-stone-600 mb-1",
							children: [/* @__PURE__ */ jsxs("span", { children: [
								item.menuItem.name,
								" × ",
								item.quantity
							] }), /* @__PURE__ */ jsxs("span", { children: [
								" ",
								item.menuItem.price * item.quantity,
								" ₽ "
							] })]
						}, item.menuItem.id))]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "border-t border-pink-200 mt-3 pt-3 flex justify-between font-bold text-lg",
						children: [/* @__PURE__ */ jsx("span", { children: " Итого:" }), /* @__PURE__ */ jsxs("span", {
							className: "text-rose-700",
							children: [totalAmount, " ₽"]
						})]
					}),
					/* @__PURE__ */ jsx(Button, {
						type: "submit",
						disabled: isProcessing,
						className: "w-full py-4 text-lg",
						children: isProcessing ? "Обработка платежа..." : "Оплатить заказ"
					})
				]
			}),
			/* @__PURE__ */ jsx(Modal, {
				isOpen: isModalOpen,
				onClose: handleCloseModal,
				title: "Заказ оформлен!",
				children: /* @__PURE__ */ jsxs("div", {
					className: "text-center py-4",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "text-lg text-rose-700 font-medium mb-2",
							children: [
								"Спасибо, ",
								name,
								"!"
							]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-stone-500 mb-6",
							children: [
								"Ваш заказ на сумму ",
								/* @__PURE__ */ jsxs("span", {
									className: "font-bold text-rose-600",
									children: [totalAmount, " ₽"]
								}),
								" принят. Мы свяжемся с вами по телефону ",
								/* @__PURE__ */ jsx("span", {
									className: "font-medium text-rose-600",
									children: phone
								}),
								"."
							]
						}),
						/* @__PURE__ */ jsx(Button, {
							onClick: handleCloseModal,
							className: "w-full bg-rose-500 hover:bg-rose-600",
							children: "На главную"
						})
					]
				})
			})
		]
	});
});
//#endregion
//#region app/assets/restaurant.avif
var restaurant_default = "/assets/restaurant-Hs65zFCw.avif";
//#endregion
//#region app/routes/about.tsx
var about_exports = /* @__PURE__ */ __exportAll({
	default: () => about_default,
	meta: () => meta
});
function meta() {
	return [{ title: "О нас | Quexty" }];
}
var about_default = UNSAFE_withComponentProps(function AboutPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-4xl mx-auto space-y-8",
		children: [/* @__PURE__ */ jsxs("section", {
			className: "bg-pink-50 rounded-3xl p-8 shadow-sm border border-pink-100",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-3xl font-bold text-rose-800 mb-4",
				children: "О нас"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-lg text-rose-600 leading-relaxed",
				children: "Quexty – ресторан с кофортной атмосферой и современной европейской кухней. Мы уделяем особое внимание качеству и создаём уютную обстановку для каждого в нашем заведении."
			})]
		}), /* @__PURE__ */ jsxs("section", {
			className: "grid gap-6 md:grid-cols-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "rounded-3xl bg-white p-8 shadow-sm border border-pink-100 hover:shadow-md transition-shadow",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-semibold text-rose-800 mb-3",
					children: "Наши преимущества"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "space-y-3 text-rose-600",
					children: [
						/* @__PURE__ */ jsx("li", {
							className: "flex items-center gap-2",
							children: "Свежие ингредиенты и авторские рецепты"
						}),
						/* @__PURE__ */ jsx("li", {
							className: "flex items-center gap-2",
							children: "Быстрое обслуживание и индивидуальный подход к каждому"
						}),
						/* @__PURE__ */ jsx("li", {
							className: "flex items-center gap-2",
							children: "Удобное расположение в самом центре Новосибирска"
						}),
						/* @__PURE__ */ jsx("li", {
							className: "flex items-center gap-2",
							children: "Уютная атмосфера и комфортная обстановка"
						})
					]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "rounded-3xl bg-white p-4 shadow-sm border border-pink-100 overflow-hidden",
				children: /* @__PURE__ */ jsx("img", {
					src: restaurant_default,
					alt: "Ресторан Quexty",
					className: "w-full h-auto rounded-2xl object-cover hover:scale-105 transition-transform duration-500"
				})
			})]
		})]
	});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-C5IrZ7M0.js",
		"imports": ["/assets/jsx-runtime-Csb9f4uE.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/root-CgXTUB7-.js",
			"imports": [
				"/assets/jsx-runtime-Csb9f4uE.js",
				"/assets/restaurant-Bp-mQnE9.js",
				"/assets/useCart-Di8CVdeq.js"
			],
			"css": ["/assets/root-C_kaVQZX.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/home-DUvGKNVo.js",
			"imports": ["/assets/jsx-runtime-Csb9f4uE.js", "/assets/restaurant-Bp-mQnE9.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/menu": {
			"id": "routes/menu",
			"parentId": "root",
			"path": "menu",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/menu-DPOPrM5d.js",
			"imports": ["/assets/jsx-runtime-Csb9f4uE.js", "/assets/useCart-Di8CVdeq.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/cart": {
			"id": "routes/cart",
			"parentId": "root",
			"path": "cart",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/cart-B5VGnLdj.js",
			"imports": ["/assets/jsx-runtime-Csb9f4uE.js", "/assets/useCart-Di8CVdeq.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/checkout": {
			"id": "routes/checkout",
			"parentId": "root",
			"path": "checkout",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/checkout-Cyqhj3lj.js",
			"imports": ["/assets/jsx-runtime-Csb9f4uE.js", "/assets/useCart-Di8CVdeq.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/about": {
			"id": "routes/about",
			"parentId": "root",
			"path": "about",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/about-B2Z1rN_3.js",
			"imports": ["/assets/jsx-runtime-Csb9f4uE.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-56eb5eaa.js",
	"version": "56eb5eaa",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"v8_passThroughRequests": false,
	"unstable_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: home_exports
	},
	"routes/menu": {
		id: "routes/menu",
		parentId: "root",
		path: "menu",
		index: void 0,
		caseSensitive: void 0,
		module: menu_exports
	},
	"routes/cart": {
		id: "routes/cart",
		parentId: "root",
		path: "cart",
		index: void 0,
		caseSensitive: void 0,
		module: cart_exports
	},
	"routes/checkout": {
		id: "routes/checkout",
		parentId: "root",
		path: "checkout",
		index: void 0,
		caseSensitive: void 0,
		module: checkout_exports
	},
	"routes/about": {
		id: "routes/about",
		parentId: "root",
		path: "about",
		index: void 0,
		caseSensitive: void 0,
		module: about_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
