/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from "react";
import { 
  Utensils, 
  Settings, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Coffee, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Send, 
  ChefHat, 
  ExternalLink,
  Camera,
  Instagram,
  Phone,
  Mail,
  Wifi,
  Baby,
  Dog,
  Accessibility,
  Wallet,
  X,
  Eye,
  Star,
  ShieldAlert,
  Key,
  Users,
  Building,
  UserCheck,
  UserX,
  UserPlus,
  ArrowRight,
  User,
  Lock,
  Pencil,
  Languages,
  Globe,
  ShoppingCart,
  ClipboardList,
  CheckCircle,
  Loader2,
  XCircle,
  Search,
  RefreshCw,
  Sparkles,
  Pizza,
  GlassWater,
  Store,
  Heart,
  TrendingUp,
  BarChart3,
  Percent,
  DollarSign,
  CalendarRange
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RestaurantConfig, DEFAULT_CONFIG, MenuCategory, MenuItem, RestaurantListItem, AdminAccountItem, Order, OrderItem, OrderStatus } from "./types";
import { AIService } from "./aiService";

const TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    welcome: "Welcome to",
    intro: "I'm {agent}, your host. How may I help you today?",
    browseMenu: "Browse Our Menu",
    askPlaceholder: "Ask about menu, reservations...",
    fullMenu: "Full Menu",
    online: "Online",
    clearHistory: "Clear Chat History",
    close: "Close",
    storeInfo: "Store Information",
    address: "Address",
    phone: "Phone",
    email: "Email",
    hours: "Opening Hours",
    specials: "Specials",
    signature: "Signature Dishes",
    noClosed: "Closed",
    language: "Language",
    selectLang: "Select Language",
    basket: "Basket",
    checkout: "Checkout",
    add: "Add",
    orderPlaced: "Order Placed Successfully!",
    kitchenStaffNotify: "We have notified the kitchen staff. Your order is pending prep.",
    continueBrowsing: "Continue Browsing",
    reviewYourOrder: "Review Your Order",
    emptyBasketMsg: "Your order basket is currently empty",
    totalCost: "Total Cost",
    placeOrder: "PLACE SECURE ORDER",
    noOrdersMsg: "No orders currently found",
    location: "Location",
    contact: "Contact",
    visitWebsite: "Visit Website",
    officialWebsite: "Official Website",
    instagramProfile: "Instagram Profile",
    chefSignatures: "Chef's Signatures",
    reservations: "Reservations"
  },
  Spanish: {
    welcome: "Bienvenido a",
    intro: "Soy {agent}, su anfitrión. ¿Cómo puedo ayudarle hoy?",
    browseMenu: "Ver nuestro menú",
    askPlaceholder: "Pregunte sobre el menú, reservas...",
    fullMenu: "Menú completo",
    online: "En línea",
    clearHistory: "Borrar historial de chat",
    close: "Cerrar",
    storeInfo: "Información del local",
    address: "Dirección",
    phone: "Teléfono",
    email: "Correo electrónico",
    hours: "Horario de apertura",
    specials: "Especiales del día",
    signature: "Platos insignia",
    noClosed: "Cerrado",
    language: "Idioma",
    selectLang: "Seleccionar idioma",
    basket: "Carrito",
    checkout: "Pagar",
    add: "Agregar",
    orderPlaced: "¡Pedido realizado con éxito!",
    kitchenStaffNotify: "Hemos notificado al personal de cocina. Su pedido está pendiente de preparación.",
    continueBrowsing: "Continuar navegando",
    reviewYourOrder: "Revise su pedido",
    emptyBasketMsg: "Su carrito de compras está vacío",
    totalCost: "Costo total",
    placeOrder: "REALIZAR PEDIDO SEGURO",
    noOrdersMsg: "No se encontraron pedidos actualmente",
    location: "Ubicación",
    contact: "Contacto",
    visitWebsite: "Visitar sitio web",
    officialWebsite: "Sitio web oficial",
    instagramProfile: "Perfil de Instagram",
    chefSignatures: "Especialidades del Chef",
    reservations: "Reservas"
  },
  French: {
    welcome: "Bienvenue chez",
    intro: "Je suis {agent}, votre hôte. Comment puis-je vous aider aujourd'hui?",
    browseMenu: "Parcourir notre menu",
    askPlaceholder: "Posez des questions sur le menu, les réservations...",
    fullMenu: "Menu complet",
    online: "En ligne",
    clearHistory: "Effacer l'historique",
    close: "Fermer",
    storeInfo: "Informations",
    address: "Adresse",
    phone: "Téléphone",
    email: "E-mail",
    hours: "Heures d'ouverture",
    specials: "Spécialités",
    signature: "Plats phares",
    noClosed: "Fermé",
    language: "Langue",
    selectLang: "Choisir la langue",
    basket: "Panier",
    checkout: "Paiement",
    add: "Ajouter",
    orderPlaced: "Commande passée avec succès !",
    kitchenStaffNotify: "Nous avons informé le personnel de cuisine. Votre commande est en cours de préparation.",
    continueBrowsing: "Continuer vos achats",
    reviewYourOrder: "Vérifiez votre commande",
    emptyBasketMsg: "Votre panier est actuellement vide",
    totalCost: "Coût total",
    placeOrder: "PASSER LA COMMANDE",
    noOrdersMsg: "Aucune commande trouvée",
    location: "Emplacement",
    contact: "Contact",
    visitWebsite: "Visiter le site web",
    officialWebsite: "Site officiel",
    instagramProfile: "Profil Instagram",
    chefSignatures: "Signatures du Chef",
    reservations: "Réservations"
  },
  German: {
    welcome: "Willkommen im",
    intro: "Ich bin {agent}, Ihr Gastgeber. Wie kann ich Ihnen heute helfen?",
    browseMenu: "Menü durchstöbern",
    askPlaceholder: "Fragen Sie nach Menü, Reservierungen...",
    fullMenu: "Ganze Speisekarte",
    online: "Online",
    clearHistory: "Verlauf löschen",
    close: "Schließen",
    storeInfo: "Informationen",
    address: "Adresse",
    phone: "Telefon",
    email: "E-Mail",
    hours: "Öffnungszeiten",
    specials: "Tagesangebote",
    signature: "Spezialitäten des Hauses",
    noClosed: "Geschlossen",
    language: "Sprache",
    selectLang: "Sprache auswählen",
    basket: "Warenkorb",
    checkout: "Zur Kasse",
    add: "Hinzufügen",
    orderPlaced: "Bestellung erfolgreich aufgegeben!",
    kitchenStaffNotify: "Wir haben das Küchenpersonal benachrichtigt. Ihre Bestellung wird vorbereitet.",
    continueBrowsing: "Weiter stöbern",
    reviewYourOrder: "Bestellung überprüfen",
    emptyBasketMsg: "Ihr Warenkorb ist derzeit leer",
    totalCost: "Gesamtkosten",
    placeOrder: "SICHER BESTELLEN",
    noOrdersMsg: "Derzeit keine Bestellungen gefunden",
    location: "Standort",
    contact: "Kontakt",
    visitWebsite: "Website besuchen",
    officialWebsite: "Offizielle Website",
    instagramProfile: "Instagram-Profil",
    chefSignatures: "Spezialitäten des Küchenchefs",
    reservations: "Reservierungen"
  },
  Chinese: {
    welcome: "欢迎光临",
    intro: "我是您的客服助手 {agent}。今天有什么可以帮您的？",
    browseMenu: "浏览菜单",
    askPlaceholder: "咨询菜单、特色菜、预订信息...",
    fullMenu: "完整菜单",
    online: "在线",
    clearHistory: "清除聊天记录",
    close: "关闭",
    storeInfo: "店铺信息",
    address: "地址",
    phone: "电话",
    email: "电子邮件",
    hours: "营业时间",
    specials: "今日特惠",
    signature: "招牌特色菜",
    noClosed: "休息中",
    language: "语言选择",
    selectLang: "切换语言",
    basket: "购物车",
    checkout: "结账",
    add: "添加",
    orderPlaced: "下单成功！",
    kitchenStaffNotify: "我们已通知后厨。您的订单正在等待配餐。",
    continueBrowsing: "继续浏览",
    reviewYourOrder: "确认您的订单",
    emptyBasketMsg: "您的购物车目前为空",
    totalCost: "总费用",
    placeOrder: "安全下单",
    noOrdersMsg: "当前未找到订单",
    location: "店址",
    contact: "联系我们",
    visitWebsite: "访问网站",
    officialWebsite: "官方网站",
    instagramProfile: "Instagram主页",
    chefSignatures: "主厨招牌菜",
    reservations: "预订"
  },
  Italian: {
    welcome: "Benvenuto da",
    intro: "Sono {agent}, il tuo ospite. Come posso aiutarti oggi?",
    browseMenu: "Sfoglia il menu",
    askPlaceholder: "Chiedi del menu, prenotazioni...",
    fullMenu: "Menu completo",
    online: "Online",
    clearHistory: "Cancella cronologia",
    close: "Chiudi",
    storeInfo: "Informazioni",
    address: "Indirizzo",
    phone: "Telefono",
    email: "Email",
    hours: "Orari di apertura",
    specials: "Specialità",
    signature: "Piatti d'autore",
    noClosed: "Chiuso",
    language: "Lingua",
    selectLang: "Seleziona lingua",
    basket: "Carrello",
    checkout: "Cassa",
    add: "Aggiungi",
    orderPlaced: "Ordine effettuato con successo!",
    kitchenStaffNotify: "Abbiamo informato il personale della cucina. Il tuo ordine è in preparazione.",
    continueBrowsing: "Continua a navigare",
    reviewYourOrder: "Controlla il tuo ordine",
    emptyBasketMsg: "Il tuo carrello è attualmente vuoto",
    totalCost: "Costo totale",
    placeOrder: "EFFETTUA L'ORDINE SICURO",
    noOrdersMsg: "Nessun ordine trovato al momento",
    location: "Posizione",
    contact: "Contatto",
    visitWebsite: "Visita il sito web",
    officialWebsite: "Sito ufficiale",
    instagramProfile: "Profilo Instagram",
    chefSignatures: "I Piatti d'Autore dello Chef",
    reservations: "Prenotazioni"
  },
  Japanese: {
    welcome: "いらっしゃいませ",
    intro: "私はホストの {agent} です。本日はどのようなご用件でしょうか？",
    browseMenu: "メニューを見る",
    askPlaceholder: "メニューやご予約についてお聞きください...",
    fullMenu: "全メニュー",
    online: "オンライン",
    clearHistory: "チャット履歴を消去",
    close: "閉じる",
    storeInfo: "店舗情報",
    address: "住所",
    phone: "電話番号",
    email: "メール",
    hours: "営業時間",
    specials: "本日のスペシャル",
    signature: "看板料理",
    noClosed: "定休日",
    language: "言語",
    selectLang: "言語を選択",
    basket: "カート",
    checkout: "注文手続き",
    add: "追加",
    orderPlaced: "注文が正常に送信されました！",
    kitchenStaffNotify: "厨房スタッフに通知しました。準備を開始します。",
    continueBrowsing: "閲覧を続ける",
    reviewYourOrder: "注文内容を確認する",
    emptyBasketMsg: "カートは現在空です",
    totalCost: "合計金額",
    placeOrder: "注文を確定する",
    noOrdersMsg: "現在注文は見つかりません",
    location: "位置",
    contact: "連絡先",
    visitWebsite: "ウェブサイトを訪問",
    officialWebsite: "公式サイト",
    instagramProfile: "Instagramプロフィール",
    chefSignatures: "シェフの特製料理",
    reservations: "予約"
  },
  Portuguese: {
    welcome: "Bem-vindo ao",
    intro: "Eu sou {agent}, seu anfitrião. Como posso ajudar você hoje?",
    browseMenu: "Ver nosso cardápio",
    askPlaceholder: "Pergunte sobre o cardápio, reservas...",
    fullMenu: "Cardápio completo",
    online: "Online",
    clearHistory: "Limpar histórico",
    close: "Fechar",
    storeInfo: "Informações",
    address: "Endereço",
    phone: "Telefone",
    email: "E-mail",
    hours: "Horário de funcionamento",
    specials: "Especiais",
    signature: "Pratos principais",
    noClosed: "Fechado",
    language: "Idioma",
    selectLang: "Selecionar idioma",
    basket: "Carrinho",
    checkout: "Finalizar Compra",
    add: "Adicionar",
    orderPlaced: "Pedido efetuado com sucesso!",
    kitchenStaffNotify: "Notificamos a equipe da cozinha. Seu pedido está pendente de preparação.",
    continueBrowsing: "Continuar navegando",
    reviewYourOrder: "Revisar o seu pedido",
    emptyBasketMsg: "O seu carrinho de compras está vazio",
    totalCost: "Custo total",
    placeOrder: "ENVIAR PEDIDO SEGURO",
    noOrdersMsg: "Nenhum pedido encontrado no momento",
    location: "Localização",
    contact: "Contato",
    visitWebsite: "Visitar site",
    officialWebsite: "Site oficial",
    instagramProfile: "Perfil do Instagram",
    chefSignatures: "Pratos Principais do Chef",
    reservations: "Reservas"
  },
  Hindi: {
    welcome: "स्वागत है",
    intro: "मैं {agent} हूँ, आपकी सहायता के लिए तैयार। आज मैं आपकी क्या मदद कर सकता हूँ?",
    browseMenu: "मेन्यू देखें",
    askPlaceholder: "मेन्यू या बुकिंग के बारे में पूछें...",
    fullMenu: "पूरा मेन्यू",
    online: "ऑनलाइन",
    clearHistory: "चैट मिटाएं",
    close: "बंद करें",
    storeInfo: "दुकान की जानकारी",
    address: "पता",
    phone: "फ़ोन",
    email: "ईमेल",
    hours: "खुलने का समय",
    specials: "आज के विशेष",
    signature: "प्रमुख व्यंजन",
    noClosed: "बंद",
    language: "भाषा",
    selectLang: "भाषा चुनें",
    basket: "टोकरी",
    checkout: "चेकआउट",
    add: "जोड़ें",
    orderPlaced: "ऑर्डर सफलतापूर्वक भेजा गया!",
    kitchenStaffNotify: "हमने रसोई के कर्मचारियों को सूचित कर दिया है। आपका ऑर्डर तैयारी में है।",
    continueBrowsing: "देखना जारी रखें",
    reviewYourOrder: "अपने ऑर्डर की समीक्षा करें",
    emptyBasketMsg: "आपकी कार्ट फ़िलहाल खाली है",
    totalCost: "कुल लागत",
    placeOrder: "सुरक्षित ऑर्डर भेजें",
    noOrdersMsg: "वर्तमान में कोई ऑर्डर नहीं मिला",
    location: "स्थान",
    contact: "संपर्क",
    visitWebsite: "वेबसाइट देखें",
    officialWebsite: "आधिकारिक वेबसाइट",
    instagramProfile: "इंस्टाग्राम प्रोफ़ाइल",
    chefSignatures: "शेफ की विशिष्ट रचनाएँ",
    reservations: "आरक्षण"
  }
};

const hexToRgb = (hex: string): string => {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return "210, 105, 30";
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return isNaN(r) || isNaN(g) || isNaN(b) ? "210, 105, 30" : `${r}, ${g}, ${b}`;
};

const adjustColorBrightness = (hex: string, percent: number): string => {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return hex;
  let r = parseInt(cleanHex.substring(0, 2), 16);
  let g = parseInt(cleanHex.substring(2, 4), 16);
  let b = parseInt(cleanHex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return hex;

  r = Math.min(255, Math.max(0, r + (percent < 0 ? r * (percent / 100) : (255 - r) * (percent / 100))));
  g = Math.min(255, Math.max(0, g + (percent < 0 ? g * (percent / 100) : (255 - g) * (percent / 100))));
  b = Math.min(255, Math.max(0, b + (percent < 0 ? b * (percent / 100) : (255 - b) * (percent / 100))));

  const rHex = Math.round(r).toString(16).padStart(2, '0');
  const gHex = Math.round(g).toString(16).padStart(2, '0');
  const bHex = Math.round(b).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
};

const getFontFamilyStyle = (font?: string) => {
  switch (font) {
    case "sans":
      return 'Inter, system-ui, -apple-system, sans-serif';
    case "mono":
      return 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace';
    case "playfair":
      return 'Playfair Display, Georgia, serif';
    case "grotesk":
      return 'Space Grotesk, sans-serif';
    case "outfit":
      return 'Outfit, sans-serif';
    case "serif":
    default:
      return 'Playfair Display, Georgia, serif';
  }
};

const getLogoIconComponent = (iconName?: string, className?: string) => {
  switch (iconName) {
    case "Utensils":
      return <Utensils className={className} />;
    case "Coffee":
      return <Coffee className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Pizza":
      return <Pizza className={className} />;
    case "GlassWater":
      return <GlassWater className={className} />;
    case "Store":
      return <Store className={className} />;
    case "Heart":
      return <Heart className={className} />;
    case "ChefHat":
    default:
      return <ChefHat className={className} />;
  }
};

export default function App() {
  const [config, setConfig] = useState<RestaurantConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<"config" | "chat">("chat");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  
  // Login fields
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const [showStoreInfo, setShowStoreInfo] = useState(false);
  const [showOrderTracker, setShowOrderTracker] = useState(false);
  const [trackingPhone, setTrackingPhone] = useState("");
  const [trackingOrders, setTrackingOrders] = useState<Order[]>([]);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showFullMenu, setShowFullMenu] = useState(false);
  
  // Sales Dashboard controller states
  const [salesDashboardTab, setSalesDashboardTab] = useState<"financials" | "leaderboard" | "trends">("financials");
  const [salesTimeframe, setSalesTimeframe] = useState<"today" | "all">("today");

  // Multi-restaurant features
  const [restaurantsList, setRestaurantsList] = useState<RestaurantListItem[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  
  // Admin-specific profile updates
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [originalAdminUsername, setOriginalAdminUsername] = useState("");
  const [customApiToken, setCustomApiToken] = useState("");
  
  // Superadmin dashboard states
  const [adminsList, setAdminsList] = useState<AdminAccountItem[]>([]);
  const [superadminPass, setSuperadminPass] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRestoName, setNewRestoName] = useState("");
  const [newApiToken, setNewApiToken] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  // Superadmin customized credentials & global configurations
  const [newSuperadminPass, setNewSuperadminPass] = useState("");
  const [changePassSuccess, setChangePassSuccess] = useState("");
  const [changePassError, setChangePassError] = useState("");
  const [adminToDelete, setAdminToDelete] = useState<AdminAccountItem | null>(null);

  const [globalTimeZone, setGlobalTimeZone] = useState("UTC");
  const [globalLanguages, setGlobalLanguages] = useState<string[]>(["English", "Spanish", "French"]);
  const [newLocaleLang, setNewLocaleLang] = useState("");
  const [globalSettingsSuccess, setGlobalSettingsSuccess] = useState("");
  const [globalSettingsError, setGlobalSettingsError] = useState("");

  const [visitorLanguage, setVisitorLanguage] = useState<string>("English");
  const [translatedConfig, setTranslatedConfig] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<Record<string, any>>({});

  const activeConfig = (visitorLanguage && config.defaultLanguage && visitorLanguage !== config.defaultLanguage && translatedConfig)
    ? { ...config, ...translatedConfig }
    : config;

  // Food Ordering System States
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orderTableNumber, setOrderTableNumber] = useState("");
  const [orderMobileNumber, setOrderMobileNumber] = useState("");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  // Admin orders state (polls database)
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersFilterStatus, setOrdersFilterStatus] = useState<"all" | OrderStatus>("all");

  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedCustomOpts, setSelectedCustomOpts] = useState<any[]>([]);

  const handleOpenCustomization = (item: MenuItem) => {
    if (item.customizations && item.customizations.length > 0) {
      setCustomizingItem(item);
      setSelectedCustomOpts([]);
    } else {
      addToCart(item);
    }
  };

  const handleConfirmCustomization = () => {
    if (!customizingItem) return;
    
    let addedPrice = 0;
    const optNames: string[] = [];
    selectedCustomOpts.forEach(opt => {
      addedPrice += parseFloat(opt.price) || 0;
      optNames.push(opt.name);
    });

    const basePrice = parseFloat(customizingItem.price) || 0;
    const finalPrice = (basePrice + addedPrice).toFixed(2);
    
    const customizationSuffix = optNames.length > 0 ? ` (${optNames.join(", ")})` : "";
    const uniqueCartId = optNames.length > 0 
      ? `${customizingItem.id}_${optNames.join("_").replace(/\s+/g, "")}`
      : customizingItem.id;

    const customName = `${customizingItem.name}${customizationSuffix}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === uniqueCartId);
      if (existing) {
        return prev.map((i) => (i.id === uniqueCartId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { id: uniqueCartId, name: customName, price: finalPrice, quantity: 1 }];
    });

    setCustomizingItem(null);
    setSelectedCustomOpts([]);
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return { ...i, quantity: newQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  };

  const handleTrackOrders = async (phoneToTrack?: string) => {
    const targetPhone = phoneToTrack || trackingPhone;
    if (!targetPhone.trim()) {
      setTrackingError("Please enter a valid phone number.");
      return;
    }
    if (!selectedRestaurantId) return;

    setIsTrackingLoading(true);
    setTrackingError("");
    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: selectedRestaurantId,
          mobileNumber: targetPhone,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTrackingOrders(data.orders || []);
        if (!data.orders || data.orders.length === 0) {
          setTrackingError("No orders found for this phone number.");
        }
      } else {
        setTrackingError(data.error || "Failed to retrieve orders.");
      }
    } catch (err) {
      console.error(err);
      setTrackingError("An error occurred while tracking. Please try again.");
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurantId) return;
    if (!orderTableNumber.trim() || !orderMobileNumber.trim()) {
      alert("Please enter both Table Number and Mobile Number to submit your order.");
      return;
    }
    if (cart.length === 0) {
      alert("Your order basket is currently empty!");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: selectedRestaurantId,
          tableNumber: orderTableNumber,
          mobileNumber: orderMobileNumber,
          items: cart,
          totalPrice: getCartTotal(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setOrderSuccess(true);
        setPlacedOrderId(data.order.id);
        clearCart();
      } else {
        alert(data.error || "Failed to submit order. Please try again.");
      }
    } catch (err) {
      alert("Host communication error. Kindly check with our service staff.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const fetchAdminOrders = async () => {
    if (!selectedRestaurantId) return;
    try {
      const response = await fetch(`/api/orders/${selectedRestaurantId}`);
      const data = await response.json();
      if (data.success) {
        setAdminOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setAdminOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const t = (key: string, variables?: Record<string, string>) => {
    const lang = visitorLanguage || config.defaultLanguage || "English";
    const langSet = TRANSLATIONS[lang] || TRANSLATIONS["English"];
    let text = langSet[key] || TRANSLATIONS["English"][key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replaceAll(`{${k}}`, v);
      });
    }
    return text;
  };

  const handleLanguageChange = (newLang: string) => {
    setVisitorLanguage(newLang);
    
    const welcomeTranslationMap: Record<string, string> = {
      English: `Welcome to ${config.restaurantName}! 😊 I'm ${config.agentName}, your virtual host. What can I help you with today?`,
      Spanish: `¡Bienvenido a ${config.restaurantName}! 😊 Soy ${config.agentName}, su anfitrión virtual. ¿En qué le puedo ayudar hoy?`,
      French: `Bienvenue chez ${config.restaurantName}! 😊 Je suis ${config.agentName}, votre hôte virtuel. Comment puis-je vous aider aujourd'hui?`,
      German: `Willkommen im ${config.restaurantName}! 😊 Ich bin ${config.agentName}, Ihr virtueller Gastgeber. Wie kann ich Ihnen heute helfen?`,
      Chinese: `欢迎光临 ${config.restaurantName}！😊 我是您的虚拟智囊助理 ${config.agentName}。今天有什么可以为您解答的吗？`,
      Italian: `Benvenuto da ${config.configName || config.restaurantName}! 😊 Sono ${config.agentName}, il tuo host virtuale. Come posso aiutarti oggi?`,
      Japanese: `${config.restaurantName}へようこそ！😊 私はバーチャルホストの${config.agentName}です。本日はどのような御用でしょうか？`,
      Portuguese: `Bem-vindo ao ${config.restaurantName}! 😊 Eu sou ${config.agentName}, seu anfitrião virtual. Como posso ajudar você hoje?`,
      Hindi: `${config.restaurantName} में आपका स्वागत है! 😊 मैं हूँ आपका वर्चुअल होस्ट ${config.agentName}। आज मैं आपकी क्या सेवा कर सकता हूँ?`
    };
    
    if (messages.length <= 1) {
      setMessages([
        {
          role: "bot",
          text: welcomeTranslationMap[newLang] || welcomeTranslationMap["English"]
        }
      ]);
    } else {
      const infoMsgMap: Record<string, string> = {
        English: `[Language changed to English]`,
        Spanish: `[Idioma cambiado a Español]`,
        French: `[Langue changée en Français]`,
        German: `[Sprache zu Deutsch gewechselt]`,
        Chinese: `[语言已切换为中文]`,
        Italian: `[Lingua cambiata in Italiano]`,
        Japanese: `[言語を日本語に変更しました]`,
        Portuguese: `[Idioma alterado para Português]`,
        Hindi: `[भाषा बदलकर हिंदी कर दी गई है]`
      };
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text: infoMsgMap[newLang] || `[Language updated to ${newLang}]`
        }
      ]);
    }
  };

  // Editing Admin states
  const [editingAdmin, setEditingAdmin] = useState<AdminAccountItem | null>(null);
  const [editAdminUser, setEditAdminUser] = useState("");
  const [editAdminPass, setEditAdminPass] = useState("");
  const [editAdminResto, setEditAdminResto] = useState("");
  const [editAdminToken, setEditAdminToken] = useState("");
  const [editAdminError, setEditAdminError] = useState("");
  const [editAdminSuccess, setEditAdminSuccess] = useState("");

  const aiRef = useRef<AIService | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const enabledLangs = (config.activeLanguages && config.activeLanguages.length > 0)
    ? config.activeLanguages
    : globalLanguages;

  // Load available restaurants on mount
  useEffect(() => {
    fetchRestaurantsList();
  }, []);

  const fetchRestaurantsList = async () => {
    try {
      const response = await fetch("/api/init", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        const list = data.restaurants || [];
        setRestaurantsList(list);
        if (data.globalTimeZone) {
          setGlobalTimeZone(data.globalTimeZone);
        }
        if (data.globalLanguages) {
          setGlobalLanguages(data.globalLanguages);
        }
        if (list.length > 0) {
          // If none already selected, pick first
          const savedActive = localStorage.getItem("last_selected_resto");
          const found = list.find((r: RestaurantListItem) => r.id === savedActive);
          if (found) {
            setSelectedRestaurantId(found.id);
          } else {
            setSelectedRestaurantId(list[0].id);
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch restaurants:", e);
    }
  };

  // Load public config when restaurant selection changes (only if guest)
  useEffect(() => {
    if (selectedRestaurantId && !isAdmin) {
      localStorage.setItem("last_selected_resto", selectedRestaurantId);
      loadRestaurantPublicConfig(selectedRestaurantId);
    }
  }, [selectedRestaurantId, isAdmin]);

  const loadRestaurantPublicConfig = async (id: string) => {
    try {
      const response = await fetch(`/api/restaurant/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setConfig(data.config);
          aiRef.current = new AIService(data.config, id);
          
          const initialLang = data.config.defaultLanguage || "English";
          setVisitorLanguage(initialLang);
          
          if (data.globalLanguages) {
            setGlobalLanguages(data.globalLanguages);
          }

          const welcomeTranslationMap: Record<string, string> = {
            English: `Welcome to ${data.config.restaurantName}! 😊 I'm ${data.config.agentName}, your virtual host. What can I help you with today?`,
            Spanish: `¡Bienvenido a ${data.config.restaurantName}! 😊 Soy ${data.config.agentName}, su anfitrión virtual. ¿En qué le puedo ayudar hoy?`,
            French: `Bienvenue chez ${data.config.restaurantName}! 😊 Je suis ${data.config.agentName}, votre hôte virtuel. Comment puis-je vous aider aujourd'hui?`,
            German: `Willkommen im ${data.config.restaurantName}! 😊 Ich bin ${data.config.agentName}, Ihr virtueller Gastgeber. Wie kann ich Ihnen heute helfen?`,
            Chinese: `欢迎光临 ${data.config.restaurantName}！😊 我是您的虚拟智囊助理 ${data.config.agentName}。今天有什么可以为您解答的吗？`,
            Italian: `Benvenuto da ${data.config.restaurantName}! 😊 Sono ${data.config.agentName}, il tuo host virtuale. Come posso aiutarti oggi?`,
            Japanese: `${data.config.restaurantName}へようこそ！😊 私はバーチャルホストの${data.config.agentName}です。本日はどのような御用でしょうか？`,
            Portuguese: `Bem-vindo ao ${data.config.restaurantName}! 😊 Eu sou ${data.config.agentName}, seu anfitrião virtual. Como posso ajudar você hoje?`,
            Hindi: `${data.config.restaurantName} में आपका स्वागत है! 😊 मैं हूँ आपका वर्चुअल होस्ट ${data.config.agentName}। आज मैं आपकी क्या सेवा कर सकता हूँ?`
          };

          setMessages([
            {
              role: "bot",
              text: welcomeTranslationMap[initialLang] || welcomeTranslationMap["English"]
            }
          ]);
        }
      }
    } catch (e) {
      console.error("Failed to load restaurant public config:", e);
    }
  };

  // Re-init client AI Service if activeTab changes
  useEffect(() => {
    if (activeTab === "chat" && !aiRef.current && selectedRestaurantId) {
      aiRef.current = new AIService(config, selectedRestaurantId);
    }
  }, [activeTab, config, selectedRestaurantId]);

  // Keep visitorLanguage in sync with configured defaultLanguage
  useEffect(() => {
    if (config.defaultLanguage) {
      setVisitorLanguage(config.defaultLanguage);
    }
  }, [config.defaultLanguage]);

  // Trigger dynamic config translation if visitor chooses a different language
  useEffect(() => {
    const defaultLanguage = config.defaultLanguage || "English";
    if (!visitorLanguage || visitorLanguage === defaultLanguage) {
      setTranslatedConfig(null);
      return;
    }

    const cacheKey = `${selectedRestaurantId || 'default'}_${visitorLanguage}`;
    if (translationCache[cacheKey]) {
      setTranslatedConfig(translationCache[cacheKey]);
      return;
    }

    let active = true;
    const translate = async () => {
      setIsTranslating(true);
      try {
        const response = await fetch("/api/translate-config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            config,
            targetLanguage: visitorLanguage,
            restaurantId: selectedRestaurantId,
          }),
        });
        if (!response.ok) throw new Error("Translation failed");
        
        const data = await response.json();
        if (data.translated && active) {
          setTranslationCache(prev => ({
            ...prev,
            [cacheKey]: data.translated,
          }));
          setTranslatedConfig(data.translated);
        }
      } catch (err) {
        console.error("Translation fail:", err);
      } finally {
        if (active) {
          setIsTranslating(false);
        }
      }
    };

    translate();

    return () => {
      active = false;
    };
  }, [visitorLanguage, config, selectedRestaurantId]);

  // Poll orders when admin is logged in
  useEffect(() => {
    if (isAdmin && selectedRestaurantId) {
      fetchAdminOrders();
      const interval = setInterval(() => {
        fetchAdminOrders();
      }, 5000); // Poll every 5 seconds for rapid instant updates
      return () => clearInterval(interval);
    }
  }, [isAdmin, selectedRestaurantId]);

  const updateConfigField = (field: keyof RestaurantConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    if (aiRef.current && selectedRestaurantId) {
      aiRef.current = new AIService({ ...config, [field]: value }, selectedRestaurantId);
    }
  };

  const updateHours = (day: string, field: keyof typeof config.openingHours[string], value: any) => {
    const updatedHours = {
      ...config.openingHours,
      [day]: { ...config.openingHours[day], [field]: value }
    };
    setConfig(prev => ({
      ...prev,
      openingHours: updatedHours
    }));
    if (aiRef.current && selectedRestaurantId) {
      aiRef.current = new AIService({ ...config, openingHours: updatedHours }, selectedRestaurantId);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    const historyContext = messages.slice(-10);
    
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInputMessage("");
    setIsTyping(true);

    if (aiRef.current) {
      let botResponse = "";
      setMessages((prev) => [...prev, { role: "bot", text: "" }]);
      
      try {
        await aiRef.current.sendMessageStream(userMsg, historyContext, (chunk) => {
          botResponse += chunk;
          setMessages((prev) => {
            const lastOne = prev[prev.length - 1];
            if (lastOne && lastOne.role === "bot") {
              const updated = [...prev];
              updated[updated.length - 1] = { ...lastOne, text: botResponse };
              return updated;
            }
            return prev;
          });
        }, abortControllerRef.current.signal, visitorLanguage);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Chat aborted");
        } else {
          console.error("Chat error:", error);
        }
      }
    }
    setIsTyping(false);
  };

  const clearChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages([]);
    setIsTyping(false);
  };

  const handleLogin = async () => {
    setLoginError(false);
    setLoginErrorMessage("");
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError(true);
      setLoginErrorMessage("Username and password are required.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        setShowLoginModal(false);
        setLoginUsername("");
        setLoginPassword("");
        
        if (data.role === "superadmin") {
          setIsAdmin(true);
          setIsSuperadmin(true);
          setSuperadminPass(loginPassword);
          if (data.globalTimeZone) {
            setGlobalTimeZone(data.globalTimeZone);
          }
          if (data.globalLanguages) {
            setGlobalLanguages(data.globalLanguages);
          }
          setActiveTab("config");
          fetchAdminsList(loginPassword);
        } else {
          setIsAdmin(true);
          setIsSuperadmin(false);
          setSelectedRestaurantId(data.restaurantId);
          if (data.config) {
            setConfig(data.config);
          }
          setCustomApiToken(data.apiToken || "");
          setAdminUsername(data.username || "");
          setOriginalAdminUsername(data.username || "");
          setAdminPassword("");
          setActiveTab("config");
        }
      } else {
        const err = await response.json();
        setLoginError(true);
        setLoginErrorMessage(err.error || "Invalid username or password.");
      }
    } catch (err) {
      setLoginError(true);
      setLoginErrorMessage("Unable to connect to login server.");
    }
  };

  const fetchAdminsList = async (password: string) => {
    try {
      const response = await fetch("/api/superadmin/list-admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ superadminPassword: password }),
      });
      if (response.ok) {
        const data = await response.json();
        setAdminsList(data.admins || []);
        if (data.globalTimeZone) {
          setGlobalTimeZone(data.globalTimeZone);
        }
        if (data.globalLanguages) {
          setGlobalLanguages(data.globalLanguages);
        }
      }
    } catch (err) {
      console.error("Error listing admins:", err);
    }
  };

  const handleUpdateSuperadminPassword = async (e: FormEvent) => {
    e.preventDefault();
    setChangePassError("");
    setChangePassSuccess("");

    if (!newSuperadminPass.trim()) {
      setChangePassError("New password is required");
      return;
    }

    try {
      const response = await fetch("/api/superadmin/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          superadminPassword: superadminPass,
          newPassword: newSuperadminPass,
        }),
      });

      if (response.ok) {
        setSuperadminPass(newSuperadminPass);
        setNewSuperadminPass("");
        setChangePassSuccess("Superadmin password updated successfully!");
      } else {
        const data = await response.json();
        setChangePassError(data.error || "Failed to update password.");
      }
    } catch (err) {
      setChangePassError("Connection error.");
    }
  };

  const handleUpdateGlobalSettings = async (e: FormEvent) => {
    e.preventDefault();
    setGlobalSettingsError("");
    setGlobalSettingsSuccess("");

    try {
      const response = await fetch("/api/superadmin/update-global-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          superadminPassword: superadminPass,
          timeZone: globalTimeZone,
          languages: globalLanguages,
        }),
      });

      if (response.ok) {
        setGlobalSettingsSuccess("Global settings saved successfully!");
      } else {
        const data = await response.json();
        setGlobalSettingsError(data.error || "Failed to update global settings.");
      }
    } catch (err) {
      setGlobalSettingsError("Connection error.");
    }
  };

  const handleAddLanguage = () => {
    const lang = newLocaleLang.trim();
    if (lang && !globalLanguages.includes(lang)) {
      setGlobalLanguages([...globalLanguages, lang]);
      setNewLocaleLang("");
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setGlobalLanguages(globalLanguages.filter((l) => l !== lang));
  };

  const handleStartEditAdmin = (admin: AdminAccountItem) => {
    setEditingAdmin(admin);
    setEditAdminUser(admin.username);
    setEditAdminPass(admin.password || "");
    setEditAdminResto(admin.restaurantName);
    setEditAdminToken(admin.apiToken || "");
    setEditAdminError("");
    setEditAdminSuccess("");
  };

  const handleSaveEditAdmin = async (e: FormEvent) => {
    e.preventDefault();
    setEditAdminError("");
    setEditAdminSuccess("");

    if (!editAdminUser.trim() || !editAdminResto.trim()) {
      setEditAdminError("Username and Restaurant name are required.");
      return;
    }

    try {
      const response = await fetch("/api/superadmin/update-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          superadminPassword: superadminPass,
          adminId: editingAdmin?.id,
          username: editAdminUser,
          password: editAdminPass || undefined,
          restaurantName: editAdminResto,
          apiToken: editAdminToken,
        }),
      });

      if (response.ok) {
        setEditAdminSuccess("Admin updated successfully!");
        fetchAdminsList(superadminPass);
        fetchRestaurantsList();
        setTimeout(() => {
          setEditingAdmin(null);
        }, 1200);
      } else {
        const data = await response.json();
        setEditAdminError(data.error || "Failed to update admin.");
      }
    } catch (err) {
      setEditAdminError("Connection error.");
    }
  };

  const handleCreateAdmin = async (e: FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    if (!newUsername.trim() || !newPassword.trim() || !newRestoName.trim()) {
      setCreateError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/superadmin/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          superadminPassword: superadminPass,
          username: newUsername,
          password: newPassword,
          restaurantName: newRestoName,
          apiToken: newApiToken,
        }),
      });

      if (response.ok) {
        setCreateSuccess("Admin account created successfully!");
        setNewUsername("");
        setNewPassword("");
        setNewRestoName("");
        setNewApiToken("");
        fetchAdminsList(superadminPass);
        fetchRestaurantsList();
      } else {
        const err = await response.json();
        setCreateError(err.error || "Failed to create administrator");
      }
    } catch (err) {
      setCreateError("Failed to connect to creation server.");
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      const response = await fetch("/api/superadmin/delete-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          superadminPassword: superadminPass,
          adminId,
        }),
      });

      if (response.ok) {
        fetchAdminsList(superadminPass);
        fetchRestaurantsList();
        setAdminToDelete(null);
      } else {
        const err = await response.json();
        alert(err.error || "Failed to delete administrator");
      }
    } catch (err) {
      alert("Failed to connect to delete server.");
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: selectedRestaurantId,
          config,
          apiToken: undefined, // Normal admin should never alter the API key
          password: adminPassword,
          username: adminUsername,
          originalUsername: originalAdminUsername,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setConfig(data.config);
          setCustomApiToken(data.apiToken || "");
          if (adminUsername) {
            setOriginalAdminUsername(adminUsername);
          }
          setAdminPassword("");
          fetchRestaurantsList();
        }
        setTimeout(() => setIsSaving(false), 800);
      } else {
        const err = await response.json();
        alert(err.error || "Failed to save configuration");
        setIsSaving(false);
      }
    } catch (e) {
      console.error("Failed saving configuration:", e);
      alert("Connection issue saving settings.");
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setIsSuperadmin(false);
    setSuperadminPass("");
    setAdminUsername("");
    setAdminPassword("");
    setOriginalAdminUsername("");
    setCustomApiToken("");
    setActiveTab("chat");
    // Reload whatever restaurant is selected publicly
    if (selectedRestaurantId) {
      loadRestaurantPublicConfig(selectedRestaurantId);
    }
  };

  const addMenuCategory = () => {
    const newCat: MenuCategory = { 
      id: Math.random().toString(36).substr(2, 9), 
      name: "New Category", 
      items: [] 
    };
    setConfig(prev => ({ ...prev, menu: [...prev.menu, newCat] }));
  };

  const addMenuItem = (catId: string) => {
    const newItem: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Dish",
      description: "Description...",
      price: "10.00",
      dietaryTags: []
    };
    setConfig(prev => ({
      ...prev,
      menu: prev.menu.map(cat => cat.id === catId ? { ...cat, items: [...cat.items, newItem] } : cat)
    }));
  };

  const primaryColor = activeConfig.primaryColor || '#d2691e';
  const darkerPrimaryColor = adjustColorBrightness(primaryColor, -15);
  const lighterPrimaryColor = adjustColorBrightness(primaryColor, 40);
  const accentRgb = hexToRgb(primaryColor);
  const activeFontFamily = activeConfig.fontFamily || 'serif';

  const dynamicStyles = `
    :root {
      --primary-color: ${primaryColor};
      --primary-color-hover: ${darkerPrimaryColor};
      --primary-color-light: ${lighterPrimaryColor};
      --primary-rgb: ${accentRgb};
    }
    
    .font-serif {
      font-family: ${getFontFamilyStyle(activeFontFamily)} !important;
    }
    
    .text-\\[\\#d2691e\\] {
      color: ${primaryColor} !important;
    }
    .hover\\:text-\\[\\#d2691e\\]:hover {
      color: ${primaryColor} !important;
    }
    .hover\\:bg-\\[\\#d2691e\\]:hover {
      background-color: ${primaryColor} !important;
    }
    .bg-\\[\\#d2691e\\] {
      background-color: ${primaryColor} !important;
    }
    .border-\\[\\#d2691e\\] {
      border-color: ${primaryColor} !important;
    }
    .border-b-2.border-\\[\\#d2691e\\] {
      border-color: ${primaryColor} !important;
    }
    .bg-\\[\\#d2691e\\]\\/10 {
      background-color: rgba(${accentRgb}, 0.1) !important;
    }
    .hover\\:bg-\\[\\#b85311\\]:hover {
      background-color: ${darkerPrimaryColor} !important;
    }
    .bg-amber-50\\/50 {
      background-color: rgba(${accentRgb}, 0.05) !important;
    }
    .border-amber-100\\/50 {
      border-color: rgba(${accentRgb}, 0.15) !important;
    }
    .hover\\:bg-stone-50\\/50:hover {
      background-color: rgba(${accentRgb}, 0.02) !important;
    }
    .shadow-\\[\\#d2691e\\]\\/10 {
      box-shadow: 0 10px 15px -3px rgba(${accentRgb}, 0.1), 0 4px 6px -4px rgba(${accentRgb}, 0.1) !important;
    }
    .text-amber-600 {
      color: ${primaryColor} !important;
    }
    .text-amber-700 {
      color: ${darkerPrimaryColor} !important;
    }
    .bg-amber-50 {
      background-color: rgba(${accentRgb}, 0.08) !important;
    }
    .border-amber-200 {
      border-color: rgba(${accentRgb}, 0.18) !important;
    }
    .bg-\\[\\#fcfbf9\\] {
      background-color: ${activeConfig.themePreset === 'classic-dark' ? '#181816' : '#fcfbf9'} !important;
    }
    .bg-\\[\\#fdfaf6\\] {
      background-color: ${activeConfig.themePreset === 'classic-dark' ? '#1c1c1a' : '#fdfaf6'} !important;
    }
    .border-\\[\\#f0e8dc\\] {
      border-color: ${activeConfig.themePreset === 'classic-dark' ? '#2e2e2a' : '#f0e8dc'} !important;
    }
    .bg-\\[\\#f5f2ed\\] {
      background-color: ${activeConfig.themePreset === 'classic-dark' ? '#22221f' : '#f5f2ed'} !important;
    }
    .hover\\:bg-\\[\\#f8f1e7\\]:hover {
      background-color: ${activeConfig.themePreset === 'classic-dark' ? '#262622' : '#f8f1e7'} !important;
    }
  `;

  const getPresetStyles = (preset?: string, primary?: string) => {
    const pColor = primary || "#d2691e";
    switch (preset) {
      case "forest":
        return `
          body, .min-h-screen { background-color: #f3f6f3 !important; }
          .bg-white { background-color: #ffffff !important; }
          .border-\\[\\#ececec\\] { border-color: #e2e8e2 !important; }
        `;
      case "ocean":
        return `
          body, .min-h-screen { background-color: #f0f4f8 !important; }
          .bg-white { background-color: #ffffff !important; }
          .border-\\[\\#ececec\\] { border-color: #e2eaf3 !important; }
        `;
      case "sunset":
        return `
          body, .min-h-screen { background-color: #faf4ee !important; }
          .bg-white { background-color: #ffffff !important; }
          .border-\\[\\#ececec\\] { border-color: #ebdcd0 !important; }
        `;
      case "classic-dark":
        return `
          body, .min-h-screen { background-color: #121210 !important; color: #f3f3f3 !important; }
          .bg-white, .bg-white\\/80 { background-color: #1a1a17 !important; }
          .text-gray-900, .text-stone-950, .text-black, h4, h3, h2, h1 { color: #fcfcfc !important; }
          .text-gray-500, .text-stone-500 { color: #a3a39e !important; }
          .text-gray-400 { color: #767671 !important; }
          .border-\\[\\#ececec\\] { border-color: #31312c !important; }
          .border-gray-100 { border-color: #2c2c27 !important; }
          .bg-stone-50 { background-color: #242421 !important; }
          .bg-[#fafaf8], .bg-stone-50\\/50 { background-color: #1e1e1b !important; }
          .border-stone-100 { border-color: #353531 !important; }
          input, select, textarea { background-color: #21211e !important; color: #ffffff !important; border-color: #3e3e38 !important; }
          .bg-stone-100 { background-color: #2b2b27 !important; }
          .text-gray-700 { color: #dcdcd8 !important; }
          nav.bg-white { background-color: #161613 !important; border-color: #282824 !important; }
        `;
      case "nordic":
        return `
          body, .min-h-screen { background-color: #f7fafc !important; }
          .bg-white { background-color: #ffffff !important; }
          .border-\\[\\#ececec\\] { border-color: #edf2f7 !important; }
        `;
      case "warm":
      default:
        return "";
    }
  };

  const presetStyleStr = getPresetStyles(activeConfig.themePreset, primaryColor);

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#1a1a1a] font-sans selection:bg-[#e6dcc6] flex flex-col md:flex-row">
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles + presetStyleStr }} />
      {/* Navigation Rail / Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full md:left-0 md:top-0 md:h-full md:w-16 bg-white border-t md:border-t-0 md:border-r border-[#ececec] flex flex-row md:flex-col items-center justify-around md:justify-start md:py-8 py-3 z-50">
        <div className="hidden md:block mb-12">
          {getLogoIconComponent(activeConfig.logoIcon, "w-8 h-8 text-[#d2691e]")}
        </div>
        
        {isAdmin ? (
          <>
            <button 
              onClick={() => setActiveTab("config")}
              className={`p-3 rounded-xl md:mb-4 transition-all ${activeTab === "config" ? "bg-[#f5f2ed] text-[#d2691e]" : "text-gray-400 hover:text-gray-600"}`}
              title={isSuperadmin ? "Superadmin Center" : "Configuration"}
            >
              <Settings className="w-6 h-6" />
            </button>
            <button 
              onClick={() => handleLogout()}
              className="p-3 rounded-xl md:mb-4 text-gray-400 hover:text-red-500 transition-all"
              title="Logout"
            >
              <ExternalLink className="w-6 h-6 md:rotate-180" />
            </button>
          </>
        ) : (
          <button 
            onClick={() => {
              setLoginError(false);
              setLoginErrorMessage("");
              setLoginUsername("");
              setLoginPassword("");
              setShowLoginModal(true);
            }}
            className="p-3 rounded-xl md:mb-4 text-gray-400 hover:text-[#d2691e] transition-all"
            title="Admin Login"
          >
            <Settings className="w-6 h-6" />
          </button>
        )}

        <button 
          onClick={() => {
            setActiveTab("chat");
            if (messages.length === 0 && selectedRestaurantId) {
              loadRestaurantPublicConfig(selectedRestaurantId);
            }
          }}
          className={`p-3 rounded-xl transition-all ${activeTab === "chat" ? "bg-[#f5f2ed] text-[#d2691e]" : "text-gray-400 hover:text-gray-600"}`}
          title="Host Chat"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </nav>

      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-[#ececec]"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-full bg-[#fde9df] text-[#d2691e]">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-semibold">Portal Gateway</h2>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">Superadmin & Admin Authentication</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                    <input 
                      type="text" 
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="e.g. roastedbean"
                      className="w-full bg-[#f9f9f9] rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#d2691e] outline-none transition-all placeholder-gray-300"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                    <input 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      placeholder="••••••••"
                      className="w-full bg-[#f9f9f9] rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#d2691e] outline-none transition-all placeholder-gray-300"
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-xs flex items-start gap-2.5 font-sans mt-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="font-medium text-red-700 leading-tight">{loginErrorMessage || "Invalid credentials."}</span>
                  </div>
                )}

                <button 
                  onClick={handleLogin}
                  className="w-full bg-[#d2691e] text-white py-3.5 rounded-xl text-sm font-semibold hover:opacity-95 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                  <span>Authenticate Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="bg-[#fcfbf9] border border-[#f5f2ed] rounded-2xl p-4 mt-6 text-xs text-gray-500 space-y-2">
                  <p className="font-bold text-gray-700 tracking-wide uppercase text-[9px]">Demo Portals Available:</p>
                  <div className="mt-1.5">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                      <span className="font-semibold block text-gray-700 text-[11px] mb-1">Cafe Admin:</span>
                      <p className="text-gray-600 space-y-1">
                        <span className="block"><span className="text-gray-400 font-medium">Username:</span> <code className="text-[10px] select-all bg-gray-50 px-1 py-0.5 rounded text-[#d2691e] font-mono">roastedbean</code></span>
                        <span className="block"><span className="text-gray-400 font-medium">Password:</span> <code className="text-[10px] select-all bg-gray-50 px-1 py-0.5 rounded text-gray-500 font-mono">password123</code></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {editingAdmin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setEditingAdmin(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-[#ececec]"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setEditingAdmin(null)}
                className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-semibold text-gray-800">Edit Admin</h2>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">Modify multi-tenant administrator parameters</p>
                </div>
              </div>

              <form onSubmit={handleSaveEditAdmin} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5 pl-1">Restaurant Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text" 
                      required
                      value={editAdminResto}
                      onChange={(e) => setEditAdminResto(e.target.value)}
                      placeholder="Bistro Bella"
                      className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl pl-10 pr-4 py-3 placeholder-gray-300 focus:bg-white focus:border-[#d2691e] outline-none transition-all text-sm text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5 pl-1">Admin Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text" 
                      required
                      value={editAdminUser}
                      onChange={(e) => setEditAdminUser(e.target.value)}
                      placeholder="bistroadmin"
                      className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl pl-10 pr-4 py-3 placeholder-gray-300 focus:bg-white focus:border-[#d2691e] outline-none transition-all text-sm text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5 pl-1">Access Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="password" 
                      value={editAdminPass}
                      onChange={(e) => setEditAdminPass(e.target.value)}
                      placeholder="•••••••• (leave empty to keep unchanged)"
                      className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl pl-10 pr-4 py-3 placeholder-gray-300 focus:bg-white focus:border-[#d2691e] outline-none transition-all text-sm text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#d2691e] font-bold mb-1.5 pl-1">Exclusive AI Token Override (Optional)</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="password" 
                      value={editAdminToken}
                      onChange={(e) => setEditAdminToken(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl pl-10 pr-4 py-3 placeholder-gray-300 focus:bg-white focus:border-[#d2691e] outline-none transition-all text-sm font-mono text-gray-800"
                    />
                  </div>
                </div>

                {editAdminError && (
                  <div className="text-red-00 bg-red-50 p-3 rounded-xl border border-red-100 text-xs font-semibold">
                    {editAdminError}
                  </div>
                )}

                {editAdminSuccess && (
                  <div className="text-green-600 bg-green-50 p-3 rounded-xl border border-green-100 text-xs font-semibold">
                    {editAdminSuccess}
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-[#d2691e] text-white py-3.5 rounded-2xl text-xs font-bold hover:opacity-95 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Update Administrator Details</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {adminToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 font-sans"
            onClick={() => setAdminToDelete(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[28px] p-8 max-w-md w-full shadow-2xl relative border border-red-100 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />

              <button 
                onClick={() => setAdminToDelete(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                title="Close Alert Dial"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mt-2 mb-6">
                <div className="p-4 rounded-full bg-red-50 text-red-500 mb-4 border border-red-100 shadow-sm animate-pulse">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-stone-900">Confirm Account Deletion</h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  Are you sure you want to delete administrator <span className="font-bold text-red-600 font-mono">@{adminToDelete.username}</span> and their restaurant configuration <span className="font-bold text-stone-800">"{adminToDelete.restaurantName}"</span>?
                </p>
                <p className="text-[11px] text-red-500/90 mt-4 bg-red-50/50 px-3.5 py-2.5 rounded-xl border border-red-100/50 leading-relaxed font-sans font-medium text-left">
                  ⚠️ This action is permanent and cannot be undone. All active virtual concierge configuration parameters and details will be deleted.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => setAdminToDelete(null)}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAdmin(adminToDelete.id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-red-200 cursor-pointer"
                >
                  Delete User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 md:ml-16 mb-20 md:mb-0">
        <AnimatePresence mode="wait">
          {activeTab === "config" ? (
            isSuperadmin ? (
              <motion.div 
                key="superadmin"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 md:p-8 max-w-5xl mx-auto font-sans"
              >
                <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ececec] pb-6">
                  <div>
                    <h1 className="text-2xl md:text-4xl font-serif font-medium mb-2 flex items-center gap-3">
                      <ShieldAlert className="w-8 h-8 text-[#d2691e]" /> Super-Admin Control Center
                    </h1>
                    <p className="text-sm text-gray-500">Deploy, manage, and audit multitenant restaurant administrators and dedicated API configurations.</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 text-xs font-bold rounded-xl transition-all border border-red-200 shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" /> End Session
                  </button>
                </header>

                <div className="w-full">
                  {/* Managed Admins Panel (Full-Width) */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm">
                    <h2 className="text-lg font-serif font-medium flex items-center gap-2 mb-5">
                      <Users className="w-5 h-5 text-[#d2691e]" /> Active Administrators ({adminsList.length})
                    </h2>

                    {adminsList.length === 0 ? (
                      <div className="py-12 text-center text-gray-400">
                        <Users className="w-12 h-12 mx-auto stroke-[1.5] opacity-30 mb-3" />
                        <p className="font-serif">No administrators configured.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 font-semibold tracking-wider uppercase">
                              <th className="pb-3 pl-2">Restaurant / Space ID</th>
                              <th className="pb-3">Username / Pwd</th>
                              <th className="pb-3">Custom AI Token</th>
                              <th className="pb-3 text-right pr-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {adminsList.map((admin) => (
                              <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 pl-2">
                                  <div className="font-semibold text-gray-800 text-sm">{admin.restaurantName}</div>
                                  <div className="font-mono text-[9px] text-gray-400 mt-0.5">{admin.restaurantId}</div>
                                </td>
                                <td className="py-4">
                                  <div className="font-medium text-gray-700">{admin.username}</div>
                                  <div className="font-sans text-[10px] text-[#d2691e] font-bold mt-0.5 select-all">{(admin as any).password || "password123"}</div>
                                </td>
                                <td className="py-4">
                                  {admin.hasApiToken ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 font-semibold text-[10px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active Override
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100 font-semibold text-[10px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Fallback Shared Key
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 text-right pr-2">
                                  <div className="flex justify-end items-center gap-1">
                                    <button 
                                      onClick={() => handleStartEditAdmin(admin)}
                                      className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all"
                                      title="Edit Administrator"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => setAdminToDelete(admin)}
                                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                                      title="Delete Administrator"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t border-[#ececec] pt-8">
                  {/* Superadmin Password customization */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm">
                    <h2 className="text-lg font-serif font-medium flex items-center gap-2 mb-2">
                      <Lock className="w-5 h-5 text-[#d2691e]" /> Superadmin Security Credentials
                    </h2>
                    <p className="text-xs text-gray-400 mb-6 font-sans">
                      Customize the security access credentials required to open the Multi-Tenant Superadmin Control Center.
                    </p>
                    
                    <form onSubmit={handleUpdateSuperadminPassword} className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5 pl-1">New Superadmin Password</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                          <input 
                            type="password" 
                            required
                            value={newSuperadminPass}
                            onChange={(e) => setNewSuperadminPass(e.target.value)}
                            placeholder="Type a new, highly secure password..."
                            className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl pl-10 pr-4 py-3 placeholder-gray-300 focus:bg-white focus:border-[#d2691e] outline-none transition-all text-sm font-mono text-gray-800"
                          />
                        </div>
                      </div>

                      {changePassError && (
                        <div className="text-red-00 bg-red-50 p-3 rounded-xl border border-red-100 text-xs font-semibold">
                          {changePassError}
                        </div>
                      )}

                      {changePassSuccess && (
                        <div className="text-green-600 bg-green-50 p-3 rounded-xl border border-green-100 text-xs font-semibold">
                          {changePassSuccess}
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full bg-[#d2691e] text-white py-3.5 rounded-2xl text-xs font-bold hover:opacity-95 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mt-4"
                      >
                        <Key className="w-4 h-4" />
                        <span>Update Portal Credentials</span>
                      </button>
                    </form>
                  </div>

                  {/* Time Zone & Languages configurations */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm">
                    <h2 className="text-lg font-serif font-medium flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-[#d2691e]" /> Multi-Tenant Localization
                    </h2>
                    <p className="text-xs text-gray-400 mb-6 font-sans">
                      Set system-wide localized variables including timezone defaults and restaurant language definitions.
                    </p>
                    
                    <form onSubmit={handleUpdateGlobalSettings} className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5 pl-1">Global Time Zone</label>
                        <div className="relative">
                          <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                          <select 
                            value={globalTimeZone}
                            onChange={(e) => setGlobalTimeZone(e.target.value)}
                            className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl pl-10 pr-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all text-sm text-gray-800 appearance-none font-sans"
                          >
                            <option value="UTC">UTC / Coordinated Universal Time</option>
                            <option value="America/New_York">EST / New York (UTC-5)</option>
                            <option value="America/Chicago">CST / Chicago (UTC-6)</option>
                            <option value="America/Denver">MST / Denver (UTC-7)</option>
                            <option value="America/Los_Angeles">PST / Los Angeles (UTC-8)</option>
                            <option value="Europe/London">GMT / London (UTC+0)</option>
                            <option value="Europe/Paris">CET / Paris (UTC+1)</option>
                            <option value="Asia/Kolkata">IST / Mumbai (UTC+5:30)</option>
                            <option value="Asia/Singapore">SGT / Singapore (UTC+8)</option>
                            <option value="Asia/Tokyo">JST / Tokyo (UTC+9)</option>
                            <option value="Australia/Sydney">AEST / Sydney (UTC+10)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                            <ChevronRight className="w-4 h-4 transform rotate-90" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5 pl-1">Supported Languages</label>
                        <div className="flex gap-2 mb-2">
                          <div className="relative flex-1">
                            <Languages className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                            <input 
                              type="text" 
                              value={newLocaleLang}
                              onChange={(e) => setNewLocaleLang(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLanguage())}
                              placeholder="Add language (e.g. Spanish, German)..."
                              className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl pl-10 pr-4 py-3 placeholder-gray-300 focus:bg-white focus:border-[#d2691e] outline-none transition-all text-sm text-gray-800"
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={handleAddLanguage}
                            className="bg-gray-100 hover:bg-[#d2691e] hover:text-white text-gray-600 px-4 rounded-2xl text-xs font-bold transition-all"
                          >
                            Add
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {globalLanguages.map((lang) => (
                            <span 
                              key={lang} 
                              className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 text-gray-700 text-[11px] px-2.5 py-1 rounded-full font-medium"
                            >
                              <span>{lang}</span>
                              <button 
                                type="button"
                                onClick={() => handleRemoveLanguage(lang)}
                                className="w-3.5 h-3.5 rounded-full hover:bg-red-100 hover:text-red-700 text-gray-400 flex items-center justify-center font-bold text-[9px] transition-all"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {globalSettingsError && (
                        <div className="text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-xs font-semibold">
                          {globalSettingsError}
                        </div>
                      )}

                      {globalSettingsSuccess && (
                        <div className="text-green-600 bg-green-50 p-3 rounded-xl border border-green-100 text-xs font-semibold">
                          {globalSettingsSuccess}
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full bg-[#d2691e] text-white py-3.5 rounded-2xl text-xs font-bold hover:opacity-95 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mt-4"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Save Localization Settings</span>
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="config"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 md:p-8 max-w-4xl mx-auto"
              >
                <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-4xl font-serif font-medium mb-2 w-full flex items-center justify-between">Configure Your Concierge</h1>
                    <p className="text-sm md:text-base text-gray-500">Fill in your restaurant details to train your AI virtual host.</p>
                  </div>
                  <button 
                    onClick={() => setShowFullMenu(true)}
                    className="flex items-center gap-2 bg-white border border-[#ececec] px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <Eye className="w-4 h-4 text-[#d2691e]" /> Preview Live Menu
                  </button>
                </header>
                <section className="space-y-6 md:space-y-8">
                  {/* Daily Sales & Revenue Dashboard */}
                  {(() => {
                    // Helper to check if date matches today calendar day
                    const isOrderDateToday = (dateString: string) => {
                      if (!dateString) return false;
                      const orderDate = new Date(dateString);
                      const today = new Date();
                      return orderDate.getDate() === today.getDate() &&
                             orderDate.getMonth() === today.getMonth() &&
                             orderDate.getFullYear() === today.getFullYear();
                    };

                    // Filter base on chosen timeframe
                    const targetOrders = adminOrders.filter(o => 
                      salesTimeframe === "all" ? true : isOrderDateToday(o.createdAt)
                    );

                    const totalReceivedOrdersCount = targetOrders.length;
                    const nonCancelledOrders = targetOrders.filter(o => o.status !== "cancelled");
                    const activeOrdersCount = nonCancelledOrders.length;

                    // Calculations
                    const deliveredSales = targetOrders
                      .filter(o => o.status === "delivered")
                      .reduce((sum, o) => sum + o.totalPrice, 0);

                    const pipelineSales = targetOrders
                      .filter(o => o.status === "pending" || o.status === "baking")
                      .reduce((sum, o) => sum + o.totalPrice, 0);

                    const cancelledSales = targetOrders
                      .filter(o => o.status === "cancelled")
                      .reduce((sum, o) => sum + o.totalPrice, 0);

                    const grossPotentialSales = deliveredSales + pipelineSales;

                    const averageOrderValue = activeOrdersCount > 0 
                      ? (deliveredSales + pipelineSales) / activeOrdersCount 
                      : 0;

                    // Item popularity compilation
                    const itemSalesMap: Record<string, { quantity: number; revenue: number }> = {};
                    nonCancelledOrders.forEach(order => {
                      order.items.forEach(item => {
                        const name = item.name;
                        const qty = item.quantity || 1;
                        const price = parseFloat(item.price) || 0;
                        if (!itemSalesMap[name]) {
                          itemSalesMap[name] = { quantity: 0, revenue: 0 };
                        }
                        itemSalesMap[name].quantity += qty;
                        itemSalesMap[name].revenue += price * qty;
                      });
                    });

                    const popularItems = Object.entries(itemSalesMap)
                      .map(([name, stats]) => ({ name, ...stats }))
                      .sort((a, b) => b.quantity - a.quantity)
                      .slice(0, 5);

                    const maxQtySold = popularItems.length > 0 ? Math.max(...popularItems.map(i => i.quantity)) : 1;

                    // Hourly sales chart placeholder or basic block list (trends tab)
                    const hourlyTrend: Record<number, number> = {};
                    nonCancelledOrders.forEach(order => {
                      const hour = new Date(order.createdAt).getHours();
                      hourlyTrend[hour] = (hourlyTrend[hour] || 0) + order.totalPrice;
                    });

                    const hourlyData = Object.entries(hourlyTrend)
                      .map(([hour, val]) => ({ hour: parseInt(hour), revenue: val }))
                      .sort((a, b) => a.hour - b.hour);

                    const formatHour = (h: number) => {
                      const ampm = h >= 12 ? 'PM' : 'AM';
                      const displayH = h % 12 === 0 ? 12 : h % 12;
                      return `${displayH} ${ampm}`;
                    };

                    const maxHourlyRev = hourlyData.length > 0 ? Math.max(...hourlyData.map(d => d.revenue)) : 1;

                    return (
                      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm font-sans space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-5">
                          <div className="space-y-1">
                            <h2 className="text-xl font-serif font-medium flex items-center gap-2 text-stone-950">
                              <TrendingUp className="w-5 h-5 text-[#d2691e]" /> 
                              {salesTimeframe === "today" ? "Daily Sales Analytics" : "All-Time Financial Performance"}
                            </h2>
                            <p className="text-xs text-gray-400">
                              Real-time accounting, basket sizes, and live demand mapping.
                            </p>
                          </div>

                          {/* Timeframe selector */}
                          <div className="flex bg-stone-100 p-1 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-500 self-start sm:self-auto border border-stone-200">
                            <button
                              type="button"
                              onClick={() => setSalesTimeframe("today")}
                              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                                salesTimeframe === "today"
                                  ? "bg-white text-[#d2691e] shadow-sm"
                                  : "hover:text-gray-950 hover:bg-stone-200/50"
                              }`}
                            >
                              Today
                            </button>
                            <button
                              type="button"
                              onClick={() => setSalesTimeframe("all")}
                              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                                salesTimeframe === "all"
                                  ? "bg-white text-[#d2691e] shadow-sm"
                                  : "hover:text-gray-950 hover:bg-stone-200/50"
                              }`}
                            >
                              All-Time
                            </button>
                          </div>
                        </div>

                        {/* Top level stats cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Card 1: Completed Revenue */}
                          <div className="bg-emerald-50/50 border border-emerald-100/60 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest block">Net Revenue</span>
                              <div className="bg-emerald-100 p-1 rounded-lg text-emerald-800">
                                <DollarSign className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="mt-2.5">
                              <h3 className="text-xl md:text-2xl font-serif font-bold text-emerald-950">
                                {config.currency}{deliveredSales.toFixed(2)}
                              </h3>
                              <p className="text-[10px] text-emerald-600/80 font-medium">Delivered order values</p>
                            </div>
                          </div>

                          {/* Card 2: Preparing Active Pipeline */}
                          <div className="bg-[#fdfaf6]/60 border border-[#f5f2ed] p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                              <span className="text-[10px] text-[#d2691e] font-bold uppercase tracking-widest block">In Prep pipeline</span>
                              <div className="bg-[#f5f2ed] p-1 rounded-lg text-[#d2691e]">
                                <Clock className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="mt-2.5">
                              <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-900">
                                {config.currency}{pipelineSales.toFixed(2)}
                              </h3>
                              <p className="text-[10px] text-gray-400 font-medium">Pending & baking orders</p>
                            </div>
                          </div>

                          {/* Card 3: Average Order Value */}
                          <div className="bg-stone-50 border border-stone-100 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                              <span className="text-[10px] text-stone-600 font-bold uppercase tracking-widest block">Avg Basket (AOV)</span>
                              <div className="bg-stone-100 p-1 rounded-lg text-stone-600">
                                <Percent className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="mt-2.5">
                              <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-950">
                                {config.currency}{averageOrderValue.toFixed(2)}
                              </h3>
                              <p className="text-[10px] text-gray-400/80 font-medium">Ticket size average</p>
                            </div>
                          </div>

                          {/* Card 4: Orders placed count */}
                          <div className="bg-stone-50 border border-stone-100 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                              <span className="text-[10px] text-stone-600 font-bold uppercase tracking-widest block">Non-Cancelled Orders</span>
                              <div className="bg-stone-100 p-1 rounded-lg text-stone-600">
                                <CalendarRange className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="mt-2.5">
                              <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-950">
                                {activeOrdersCount}
                              </h3>
                              <p className="text-[10px] text-stone-400 font-medium">
                                of {totalReceivedOrdersCount} total reservations
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive analytical breakdowns */}
                        <div className="border border-stone-100 rounded-2xl p-4 bg-stone-50/20 space-y-4">
                          <div className="flex items-center gap-2 border-b border-stone-100 pb-3 overflow-x-auto">
                            <button
                              type="button"
                              onClick={() => setSalesDashboardTab("financials")}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                salesDashboardTab === "financials"
                                  ? "bg-white border border-[#ececec] text-[#d2691e] shadow-xs"
                                  : "text-gray-400 hover:text-gray-600"
                              }`}
                            >
                              Live Flow Sheet
                            </button>
                            <button
                              type="button"
                              onClick={() => setSalesDashboardTab("leaderboard")}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                salesDashboardTab === "leaderboard"
                                  ? "bg-white border border-[#ececec] text-[#d2691e] shadow-xs"
                                  : "text-gray-400 hover:text-gray-600"
                              }`}
                            >
                              Demand Leaderboard
                            </button>
                            <button
                              type="button"
                              onClick={() => setSalesDashboardTab("trends")}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                salesDashboardTab === "trends"
                                  ? "bg-white border border-[#ececec] text-[#d2691e] shadow-xs"
                                  : "text-gray-400 hover:text-gray-600"
                              }`}
                            >
                              Hourly Sales Density
                            </button>
                          </div>

                          {/* Tab Content 1: Financials flow sheet */}
                          {salesDashboardTab === "financials" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                              <div className="space-y-3.5 bg-white p-4 rounded-xl border border-[#ececec]/60">
                                <h4 className="font-serif font-bold text-stone-900 border-b border-stone-50 pb-2 flex justify-between">
                                  <span>Revenue Aggregates</span>
                                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-sans font-normal">Realized</span>
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center text-gray-500">
                                    <span>Settled (Delivered) Sales:</span>
                                    <span className="font-bold text-emerald-600 font-mono">{config.currency}{deliveredSales.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-gray-500">
                                    <span>Preparing pipeline:</span>
                                    <span className="font-bold text-amber-600/90 font-mono">{config.currency}{pipelineSales.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between items-center border-t border-dashed border-stone-100 pt-2 text-stone-900 font-bold">
                                    <span>Gross Operational Sales:</span>
                                    <span className="font-mono text-base">{config.currency}{grossPotentialSales.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3.5 bg-white p-4 rounded-xl border border-[#ececec]/60">
                                <h4 className="font-serif font-bold text-stone-900 border-b border-stone-50 pb-2 flex justify-between">
                                  <span>Order Leakages & Conversions</span>
                                  <span className="text-[10px] text-red-500 uppercase tracking-widest font-sans font-normal">Void</span>
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center text-gray-500">
                                    <span>Voided (Cancelled) Sales:</span>
                                    <span className="font-bold text-red-600 font-mono">{config.currency}{cancelledSales.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-gray-500">
                                    <span>Cancellation Ratio:</span>
                                    <span className="font-bold text-gray-900 font-mono">
                                      {totalReceivedOrdersCount > 0 
                                        ? `${((targetOrders.filter(o => o.status === "cancelled").length / totalReceivedOrdersCount) * 100).toFixed(0)}%`
                                        : "0%"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center border-t border-dashed border-stone-100 pt-2 text-stone-900 font-bold">
                                    <span>Order Conversion Rate:</span>
                                    <span className="font-mono text-stone-950">
                                      {totalReceivedOrdersCount > 0 
                                        ? `${(((totalReceivedOrdersCount - targetOrders.filter(o => o.status === "cancelled").length) / totalReceivedOrdersCount) * 100).toFixed(1)}%`
                                        : "100%"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Tab Content 2: Popular Items leaderboard */}
                          {salesDashboardTab === "leaderboard" && (
                            <div className="space-y-3 bg-white p-4 rounded-xl border border-[#ececec]/60">
                              <h4 className="font-serif font-bold text-stone-900 text-xs flex justify-between items-center pb-2 border-b border-stone-50">
                                <span>Itemized Dishes Demand Scale</span>
                                <span className="text-[9px] text-[#d2691e] font-sans font-bold uppercase tracking-wider">Top sellers</span>
                              </h4>
                              {popularItems.length === 0 ? (
                                <p className="text-center py-4 text-xs text-gray-400">No dishes ordered during this timeframe yet.</p>
                              ) : (
                                <div className="space-y-3.5 pt-1.5">
                                  {popularItems.map((item, idx) => {
                                    const percentageOfMax = (item.quantity / maxQtySold) * 100;
                                    return (
                                      <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs font-semibold">
                                          <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-md bg-[#fdfaf6] border border-[#f5f2ed] flex items-center justify-center text-[10px] text-[#d2691e]">
                                              {idx + 1}
                                            </span>
                                            <span className="text-stone-900 truncate max-w-[150px] sm:max-w-[280px]">{item.name}</span>
                                          </div>
                                          <div className="flex items-center gap-3 font-mono">
                                            <span className="text-stone-500 font-medium">{item.quantity} orders</span>
                                            <span className="text-stone-950 font-bold">{config.currency}{item.revenue.toFixed(2)}</span>
                                          </div>
                                        </div>
                                        {/* Simple Progress Bar */}
                                        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                                          <div 
                                            className="bg-[#d2691e] h-1.5 rounded-full transition-all duration-500" 
                                            style={{ width: `${percentageOfMax}%` }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Tab Content 3: Hourly Sales Trends */}
                          {salesDashboardTab === "trends" && (
                            <div className="space-y-3 bg-white p-4 rounded-xl border border-[#ececec]/60">
                              <h4 className="font-serif font-bold text-stone-900 text-xs flex justify-between items-center pb-2 border-b border-stone-50">
                                <span>Hourly Activity Patterns</span>
                                <span className="text-[9px] text-gray-400 font-sans uppercase tracking-widest font-normal">Operational Peak Metrics</span>
                              </h4>
                              {hourlyData.length === 0 ? (
                                <p className="text-center py-4 text-xs text-gray-400">No transaction times available for trend mapping.</p>
                              ) : (
                                <div className="space-y-3.5 pt-1.5">
                                  {hourlyData.map((data, idx) => {
                                    const percentageOfMax = (data.revenue / maxHourlyRev) * 100;
                                    return (
                                      <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs font-semibold">
                                          <span className="text-stone-700 font-mono font-medium">{formatHour(data.hour)}</span>
                                          <span className="text-stone-950 font-bold font-mono">{config.currency}{data.revenue.toFixed(2)}</span>
                                        </div>
                                        {/* Simple Progress Bar using Emerald for trends */}
                                        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                                          <div 
                                            className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500" 
                                            style={{ width: `${percentageOfMax}%` }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Live Orders Tracker */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm font-sans space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                          <h2 className="text-lg font-serif font-medium flex items-center gap-2 text-stone-950">
                            <ClipboardList className="w-5 h-5 text-[#d2691e]" /> Live Kitchen Orders Feed
                          </h2>
                        </div>
                        <p className="text-xs text-gray-400">
                          Orders placed by guest tables. Auto-refreshing in real time.
                        </p>
                      </div>
                      
                      {/* Filter tabs */}
                      <div className="flex bg-stone-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        {(["all", "pending", "baking", "delivered", "cancelled"] as const).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setOrdersFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                              ordersFilterStatus === status 
                                ? "bg-white text-[#d2691e] shadow-sm" 
                                : "hover:text-gray-950 hover:bg-stone-200/50"
                            }`}
                          >
                            {status} ({
                              status === "all" 
                                ? adminOrders.length 
                                : adminOrders.filter(o => o.status === status).length
                            })
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mini Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-4 gap-4 text-center">
                      <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-100/50">
                        <p className="text-[10px] uppercase font-bold text-amber-600/80 tracking-wider">Pending</p>
                        <p className="text-xl font-bold text-amber-700">{adminOrders.filter(o => o.status === 'pending').length}</p>
                      </div>
                      <div className="bg-[#f0e8dc]/40 rounded-2xl p-3 border border-[#f0e8dc]/50">
                        <p className="text-[10px] uppercase font-bold text-[#d2691e]/80 tracking-wider">Baking</p>
                        <p className="text-xl font-bold text-[#d2691e]">{adminOrders.filter(o => o.status === 'baking').length}</p>
                      </div>
                      <div className="bg-green-50/50 rounded-2xl p-3 border border-green-100/50">
                        <p className="text-[10px] uppercase font-bold text-green-600/80 tracking-wider">Delivered</p>
                        <p className="text-xl font-bold text-green-700">{adminOrders.filter(o => o.status === 'delivered').length}</p>
                      </div>
                      <div className="bg-red-50/50 rounded-2xl p-3 border border-red-100/50">
                        <p className="text-[10px] uppercase font-bold text-red-600/80 tracking-wider">Cancelled</p>
                        <p className="text-xl font-bold text-red-700">{adminOrders.filter(o => o.status === 'cancelled').length}</p>
                      </div>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {(() => {
                        const filtered = adminOrders.filter(o => ordersFilterStatus === "all" || o.status === ordersFilterStatus);
                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-12 text-stone-400 bg-stone-50/50 rounded-2xl border border-stone-100 border-dashed">
                              <ChefHat className="w-10 h-10 text-stone-200 mx-auto mb-3" />
                              <p className="text-xs font-bold uppercase tracking-wider">{t("noOrdersMsg") || "No orders currently found"}</p>
                            </div>
                          );
                        }
                        return filtered.map((order) => (
                          <div key={order.id} className="border border-stone-200/80 rounded-2xl p-4 md:p-5 space-y-4 hover:border-stone-300 transition-colors bg-white shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 pb-3">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="bg-stone-900 text-white font-bold text-xs px-2.5 py-1 rounded-lg">
                                    {order.tableNumber}
                                  </span>
                                  <span className="text-xs font-mono text-gray-400">#{order.id.replace('order-', '')}</span>
                                </div>
                                <p className="text-xs text-gray-500 font-bold flex items-center gap-1">
                                  <span className="text-gray-400 font-normal">Guest Mobile:</span> {order.mobileNumber}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2.5">
                                <span className="text-xs font-mono text-gray-400 text-right">
                                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  order.status === "pending" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                                  order.status === "baking" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                                  order.status === "cancelled" ? "bg-red-50 text-red-600 border border-red-200" :
                                  "bg-green-50 text-green-600 border border-green-200"
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            {/* Items Bullet List */}
                            <div className="space-y-2">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-gray-800">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between p-2 bg-stone-50 rounded-xl border border-stone-100/50">
                                    <span>{item.name}</span>
                                    <span className="text-[#d2691e]">x{item.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-stone-100 text-xs font-sans">
                              <div>
                                <span className="text-gray-400 font-bold">Total Bill:</span>{" "}
                                <span className="font-serif font-bold text-[#d2691e] text-base">{config.currency}{order.totalPrice.toFixed(2)}</span>
                              </div>

                              {/* Quick Status Control Buttons */}
                              <div className="flex gap-2 items-center flex-wrap">
                                {order.status === "pending" && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateOrderStatus(order.id, "baking")}
                                      className="bg-amber-50 hover:bg-[#d2691e] border border-amber-200 text-[#d2691e] hover:text-white px-3.5 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer active:scale-95"
                                    >
                                      Start Baking
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                                      className="bg-green-50 hover:bg-green-600 border border-green-200 text-green-700 hover:text-white px-3.5 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer active:scale-95"
                                    >
                                      Direct Deliver
                                    </button>
                                  </>
                                )}
                                {order.status === "baking" && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                                    className="bg-green-50 hover:bg-green-600 border border-green-200 text-green-700 hover:text-white px-3.5 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer active:scale-95"
                                  >
                                    Serve / Deliver
                                  </button>
                                )}
                                {(order.status === "pending" || order.status === "baking") && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                                    className="bg-red-50 hover:bg-red-600 border border-red-200 text-red-700 hover:text-white px-3.5 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer active:scale-95 shadow-sm"
                                  >
                                    Cancel Order
                                  </button>
                                )}
                                {order.status === "delivered" && (
                                  <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs bg-green-50 border border-green-100 px-2.5 py-1 rounded-xl">
                                    <CheckCircle className="w-4 h-4 text-green-600 fill-current text-green-100" /> Served & Closed
                                  </div>
                                )}
                                {order.status === "cancelled" && (
                                  <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs bg-red-50 border border-red-100 px-2.5 py-1 rounded-xl">
                                    <XCircle className="w-4 h-4 text-red-600" /> Cancelled
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Admin Credentials */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm">
                    <h2 className="text-xl font-serif font-medium flex items-center gap-2 mb-6">
                      <ShieldAlert className="w-5 h-5 text-[#d2691e]" /> Access Credentials
                    </h2>
                    <p className="text-xs text-gray-400 -mt-4 mb-5 leading-normal font-sans">
                      Secure your administrator workspace by updating your password and local system username.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5 font-sans">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Login Username</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                          <input 
                            type="text" 
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl pl-10 pr-4 py-3 placeholder-gray-300 focus:bg-white focus:border-[#d2691e] outline-none transition-all text-sm text-gray-800"
                            placeholder="Change username..."
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 font-sans">
                        <label className="text-[10px] uppercase tracking-widest text-[#d2691e] font-bold ml-1">New Password (Optional)</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                          <input 
                            type="password" 
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl pl-10 pr-4 py-3 placeholder-gray-300 focus:bg-white focus:border-[#d2691e] outline-none transition-all text-sm text-gray-800"
                            placeholder="Type new password to update..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Language & Internationalization */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm">
                    <h2 className="text-xl font-serif font-medium flex items-center gap-2 mb-2">
                      <Languages className="w-5 h-5 text-[#d2691e]" /> Language & Internationalization
                    </h2>
                    <p className="text-xs text-gray-400 mb-6 font-sans">
                      Configure your virtual host's default language and toggle additional languages that guest visitors are allowed to chat in.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5 font-sans">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Default Chat Language</label>
                        <div className="relative">
                          <Languages className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                          <select 
                            value={config.defaultLanguage || "English"}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateConfigField("defaultLanguage", val);
                              const currentActive = config.activeLanguages || ["English"];
                              if (!currentActive.includes(val)) {
                                updateConfigField("activeLanguages", [...currentActive, val]);
                              }
                            }}
                            className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl pl-10 pr-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all text-sm text-gray-800 appearance-none cursor-pointer"
                          >
                            {globalLanguages.map((lang) => (
                              <option key={lang} value={lang}>{lang}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                            <ChevronRight className="w-4 h-4 transform rotate-90" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 font-sans">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Guest Language Selection Options</label>
                        <p className="text-[10px] text-gray-400 mb-2">Guests can toggle between these languages on the chat screen.</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {globalLanguages.map((lang) => {
                            const isActive = (config.activeLanguages || ["English"]).includes(lang);
                            return (
                              <button
                                type="button"
                                key={lang}
                                onClick={() => {
                                  const currentActive = config.activeLanguages || ["English"];
                                  let updated;
                                  if (currentActive.includes(lang)) {
                                    if (currentActive.length === 1) return;
                                    updated = currentActive.filter((l) => l !== lang);
                                    if (config.defaultLanguage === lang && updated.length > 0) {
                                      updateConfigField("defaultLanguage", updated[0]);
                                    }
                                  } else {
                                    updated = [...currentActive, lang];
                                  }
                                  updateConfigField("activeLanguages", updated);
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                  isActive
                                    ? "bg-[#d2691e]/10 border-[#d2691e] text-[#d2691e]"
                                    : "bg-[#f9f9f9] border-[#ececec] text-gray-400 hover:border-gray-300"
                                }`}
                              >
                                {lang}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info & Branding */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm">
                  <h2 className="text-xl font-serif font-medium flex items-center gap-2 mb-6">
                    <ChefHat className="w-5 h-5 text-[#d2691e]" /> Host Persona & Branding
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">AI Agent Name</label>
                      <input 
                        type="text" 
                        value={config.agentName}
                        onChange={(e) => updateConfigField("agentName", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                        placeholder="e.g., Bella"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Restaurant Name</label>
                      <input 
                        type="text" 
                        value={config.restaurantName}
                        onChange={(e) => updateConfigField("restaurantName", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                        placeholder="e.g., The Roasted Bean"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Restaurant Type</label>
                      <input 
                        type="text" 
                        value={config.restaurantType}
                        onChange={(e) => updateConfigField("restaurantType", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                        placeholder="e.g., Cozy neighbourhood café"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Conversation Tone</label>
                      <select 
                        value={config.tone}
                        onChange={(e) => updateConfigField("tone", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all cursor-pointer appearance-none"
                      >
                        <option value="warm and conversational">Warm & Conversational</option>
                        <option value="professional and polished">Professional & Polished</option>
                        <option value="fun and laid-back">Fun & Laid-back</option>
                        <option value="fast-paced and energetic">Fast-paced & Energetic</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Personality Traits</label>
                      <input 
                        type="text" 
                        value={config.personality || ""}
                        onChange={(e) => updateConfigField("personality", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                        placeholder="e.g., friendly, efficient, witty"
                      />
                    </div>
                  </div>
                </div>

                {/* Store Theme & Aesthetic Customization */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-serif font-medium flex items-center gap-2 text-stone-950">
                      <Sparkles className="w-5 h-5 text-[#d2691e]" /> Aesthetic Customization
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Personalize your shop's digital identity. Changes are reflected live on the visitor menu and chatbot interface.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Theme Preset Selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Theme Presets</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { id: "warm", name: "Warm Cafe", primary: "#d2691e", desc: "Cozy chocolate & beige", bg: "#fdfaf6" },
                          { id: "forest", name: "Forest Sage", primary: "#0f5132", desc: "Pine green & sage", bg: "#f3f6f3" },
                          { id: "ocean", name: "Ocean Breeze", primary: "#0a58ca", desc: "Fresh cobalt & sky blue", bg: "#f0f4f8" },
                          { id: "sunset", name: "Sunset Sand", primary: "#b02a37", desc: "Terracotta & peach", bg: "#faf4ee" },
                          { id: "nordic", name: "Nordic Clean", primary: "#2d3748", desc: "Slate & crisp slate gray", bg: "#f7fafc" },
                          { id: "classic-dark", name: "Obsidian Gold", primary: "#e0ad69", desc: "Ink gold & dark mode", bg: "#1a1a17" },
                        ].map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              updateConfigField("themePreset", preset.id);
                              updateConfigField("primaryColor", preset.primary);
                            }}
                            className={`p-3.5 rounded-2xl text-left border transition-all active:scale-95 space-y-2 flex flex-col justify-between ${
                              config.themePreset === preset.id 
                                ? "border-[#d2691e] bg-[#fdfaf6]/50 shadow-sm"
                                : "border-gray-100 hover:border-gray-200 bg-white"
                            }`}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="font-semibold text-xs text-stone-900 block">{preset.name}</span>
                              <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                            </div>
                            <span className="text-[10px] text-gray-400 leading-normal block">{preset.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Logo & Color Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Color Picker Box */}
                      <div className="space-y-2.5">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Custom Brand Color</label>
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center shrink-0">
                            <input 
                              type="color" 
                              value={config.primaryColor || "#d2691e"}
                              onChange={(e) => updateConfigField("primaryColor", e.target.value)}
                              className="absolute inset-0 cursor-pointer w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 opacity-100 border-none outline-none"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <input 
                              type="text" 
                              value={config.primaryColor || "#d2691e"}
                              onChange={(e) => {
                                if (e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                                  updateConfigField("primaryColor", e.target.value);
                                }
                              }}
                              className="w-full bg-[#f9f9f9] border border-transparent rounded-xl px-3 py-1.5 focus:bg-white focus:border-[#d2691e] outline-none font-mono text-xs text-gray-650 transition-all font-bold"
                              placeholder="#d2691e"
                            />
                            <p className="text-[9px] text-gray-400">Click color block to select custom brand accents.</p>
                          </div>
                        </div>
                      </div>

                      {/* Font Family style */}
                      <div className="space-y-2.5">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Font Family Style</label>
                        <select 
                          value={config.fontFamily || "serif"}
                          onChange={(e) => updateConfigField("fontFamily", e.target.value as any)}
                          className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all cursor-pointer appearance-none text-xs"
                        >
                          <option value="serif">Playfair Display (Elegant Serif)</option>
                          <option value="sans">Inter (Modern Clean Sans)</option>
                          <option value="grotesk">Space Grotesk (Tech & Geometrical)</option>
                          <option value="outfit">Outfit (Sophisticated Curved)</option>
                          <option value="mono">JetBrains Mono (Brutalist Minimalist)</option>
                        </select>
                      </div>
                    </div>

                    {/* Logo Icon Picker */}
                    <div className="space-y-2.5">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Logo Icon Design</label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {[
                          { id: "ChefHat", label: "Chef Hat" },
                          { id: "Coffee", label: "Coffee Cup" },
                          { id: "Utensils", label: "Cutlery" },
                          { id: "Sparkles", label: "Magic Glam" },
                          { id: "Pizza", label: "Pizza Slice" },
                          { id: "GlassWater", label: "Soda/Glass" },
                          { id: "Store", label: "Cafe Shop" },
                          { id: "Heart", label: "Sweet Bistro" },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => updateConfigField("logoIcon", item.id)}
                            className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 active:scale-95 ${
                              config.logoIcon === item.id 
                                ? "border-[#d2691e] bg-[#fdfaf6]/80 text-[#d2691e]" 
                                : "border-gray-100 bg-white hover:border-gray-200 text-gray-400 hover:text-gray-600"
                            }`}
                            title={item.label}
                          >
                            {getLogoIconComponent(item.id, "w-5 h-5")}
                            <span className="text-[8px] font-medium tracking-wide truncate max-w-full block">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operations: Hours & Reservations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hours */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm">
                    <h2 className="text-xl font-serif font-medium flex items-center gap-2 mb-6">
                      <Clock className="w-5 h-5 text-[#d2691e]" /> Opening Hours
                    </h2>
                    <div className="space-y-3">
                      {(Object.entries(config.openingHours) as [string, any][]).map(([day, h]) => (
                        <div key={day} className="flex items-center justify-between py-2 group">
                          <span className="text-sm font-medium capitalize w-20 text-gray-600">{day.slice(0, 3)}</span>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={h.isClosed}
                                onChange={(e) => updateHours(day, "isClosed", e.target.checked)}
                                className="w-4 h-4 rounded text-[#d2691e] border-gray-300 focus:ring-[#d2691e]"
                              />
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Closed</span>
                            </label>
                            {!h.isClosed && (
                              <div className="flex items-center gap-1.5 bg-[#f9f9f9] px-2 py-1 rounded-lg border border-[#f5f5f5] group-hover:border-gray-200 transition-colors">
                                <input 
                                  type="time" 
                                  value={h.open} 
                                  onChange={(e) => updateHours(day, "open", e.target.value)}
                                  className="bg-transparent border-none text-[10px] font-bold focus:ring-0 p-0 w-12"
                                />
                                <span className="text-gray-300 text-[10px]">—</span>
                                <input 
                                  type="time" 
                                  value={h.close} 
                                  onChange={(e) => updateHours(day, "close", e.target.value)}
                                  className="bg-transparent border-none text-[10px] font-bold focus:ring-0 p-0 w-12"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reservations */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm flex flex-col">
                    <h2 className="text-xl font-serif font-medium flex items-center gap-2 mb-6">
                      <Wallet className="w-5 h-5 text-[#d2691e]" /> Reservations & Pricing
                    </h2>
                    <div className="space-y-6 flex-1">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Price Range</label>
                        <input 
                          type="text" 
                          value={config.priceRange}
                          onChange={(e) => updateConfigField("priceRange", e.target.value)}
                          className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                          placeholder="e.g., $15 - $30 per person"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Reservation Policy</label>
                        <textarea 
                          value={config.reservations}
                          onChange={(e) => updateConfigField("reservations", e.target.value)}
                          rows={2}
                          className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all resize-none text-sm"
                          placeholder="e.g., Recommended for dinner, walk-ins welcome..."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Method</label>
                        <input 
                          type="text" 
                          value={config.reservationMethod}
                          onChange={(e) => updateConfigField("reservationMethod", e.target.value)}
                          className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                          placeholder="e.g., Website, OpenTable, or Phone"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Currency Type</label>
                        <div className="flex gap-2">
                          {["$", "£", "€", "₹", "¥"].map((curr) => (
                            <button
                              key={curr}
                              onClick={() => updateConfigField("currency", curr)}
                              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${config.currency === curr ? "bg-[#d2691e] text-white" : "bg-[#f9f9f9] text-gray-400 hover:bg-gray-100"}`}
                            >
                              {curr}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Social */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm">
                  <h2 className="text-xl font-serif font-medium flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-[#d2691e]" /> Location & Reach
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Display Address</label>
                      <input 
                        type="text" 
                        value={config.address}
                        onChange={(e) => updateConfigField("address", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Phone</label>
                      <input 
                        type="text" 
                        value={config.phone}
                        onChange={(e) => updateConfigField("phone", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Website URL</label>
                      <input 
                        type="text" 
                        value={config.website}
                        onChange={(e) => updateConfigField("website", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Instagram (@)</label>
                      <input 
                        type="text" 
                        value={config.instagram}
                        onChange={(e) => updateConfigField("instagram", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Email</label>
                      <input 
                        type="text" 
                        value={config.email}
                        onChange={(e) => updateConfigField("email", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities & Accessibility */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm">
                  <h2 className="text-xl font-serif font-medium flex items-center gap-2 mb-6">
                    <Accessibility className="w-5 h-5 text-[#d2691e]" /> Amenities & Policies
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Wifi */}
                    <div className="p-4 bg-[#fcfcfc] rounded-2xl border border-[#f5f5f5] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-[#d2691e]" />
                          <span className="text-xs font-bold text-gray-600">Guest WiFi</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={config.wifi}
                          onChange={(e) => updateConfigField("wifi", e.target.checked)}
                          className="w-4 h-4 rounded text-[#d2691e] border-gray-300"
                        />
                      </div>
                      {config.wifi && (
                        <input 
                          type="text"
                          value={config.wifiPassword}
                          onChange={(e) => updateConfigField("wifiPassword", e.target.value)}
                          placeholder="Password"
                          className="w-full bg-white border border-gray-100 rounded-lg px-3 py-1.5 text-[10px] outline-none focus:border-[#d2691e]"
                        />
                      )}
                    </div>

                    {/* Kid Friendly */}
                    <div className="p-4 bg-[#fcfcfc] rounded-2xl border border-[#f5f5f5] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Baby className="w-4 h-4 text-[#d2691e]" />
                        <span className="text-xs font-bold text-gray-600">Kid Friendly</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={config.kidFriendly}
                        onChange={(e) => updateConfigField("kidFriendly", e.target.checked)}
                        className="w-4 h-4 rounded text-[#d2691e] border-gray-300"
                      />
                    </div>

                    {/* Accessibility */}
                    <div className="p-4 bg-[#fcfcfc] rounded-2xl border border-[#f5f5f5] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Accessibility className="w-4 h-4 text-[#d2691e]" />
                        <span className="text-xs font-bold text-gray-600">Accessible</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={config.wheelchairAccessible}
                        onChange={(e) => updateConfigField("wheelchairAccessible", e.target.checked)}
                        className="w-4 h-4 rounded text-[#d2691e] border-gray-300"
                      />
                    </div>

                    {/* Pet Friendly */}
                    <div className="p-4 bg-[#fcfcfc] rounded-2xl border border-[#f5f5f5] space-y-3">
                      <div className="flex items-center gap-2">
                        <Dog className="w-4 h-4 text-[#d2691e]" />
                        <span className="text-xs font-bold text-gray-600">Pet Policy</span>
                      </div>
                      <input 
                        type="text"
                        value={config.petFriendly}
                        onChange={(e) => updateConfigField("petFriendly", e.target.value)}
                        placeholder="e.g., Outdoor only"
                        className="w-full bg-white border border-gray-100 rounded-lg px-3 py-1.5 text-[10px] outline-none focus:border-[#d2691e]"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Parking</label>
                      <input 
                        type="text" 
                        value={config.parking}
                        onChange={(e) => updateConfigField("parking", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                        placeholder="e.g., Free street parking, Validated valet..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Seating Styles</label>
                      <input 
                        type="text" 
                        value={config.seating}
                        onChange={(e) => updateConfigField("seating", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#d2691e] outline-none transition-all"
                        placeholder="e.g., Indoor booths, High-tops, Patio..."
                      />
                    </div>
                  </div>
                </div>

                {/* Signature Dishes Editor */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h2 className="text-xl font-serif font-medium flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#d2691e]" /> Signature Dishes
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">Highlight your most popular items in the full menu view.</p>
                    </div>
                    <button 
                      onClick={() => updateConfigField("signatureDishes", [...config.signatureDishes, "New Dish — Description"])}
                      className="flex items-center gap-2 bg-[#fdfaf6] text-[#d2691e] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#f8f1e7] border border-[#f0e8dc] transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Signature
                    </button>
                  </div>

                  <div className="space-y-4">
                    {config.signatureDishes.map((dish, idx) => {
                      const [name, ...descParts] = dish.split(" — ");
                      const desc = descParts.join(" — ");
                      
                      return (
                        <div key={idx} className="flex gap-4 items-start bg-[#fcfcfc] p-4 rounded-2xl border border-[#f5f5f5]">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Dish Name</label>
                              <input 
                                type="text"
                                value={name}
                                onChange={(e) => {
                                  const newSigns = [...config.signatureDishes];
                                  newSigns[idx] = `${e.target.value} — ${desc}`;
                                  updateConfigField("signatureDishes", newSigns);
                                }}
                                className="w-full bg-white border border-gray-100 rounded-lg px-3 py-2 text-sm font-bold focus:border-[#d2691e] outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Short Highlight</label>
                              <input 
                                type="text"
                                value={desc}
                                onChange={(e) => {
                                  const newSigns = [...config.signatureDishes];
                                  newSigns[idx] = `${name} — ${e.target.value}`;
                                  updateConfigField("signatureDishes", newSigns);
                                }}
                                className="w-full bg-white border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 italic focus:border-[#d2691e] outline-none"
                                placeholder="Why is it special?"
                              />
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              const newSigns = [...config.signatureDishes];
                              newSigns.splice(idx, 1);
                              updateConfigField("signatureDishes", newSigns);
                            }}
                            className="mt-6 text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                    {config.signatureDishes.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                        <p className="text-sm text-gray-400">No signature dishes added yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Menu Editor */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ececec] shadow-sm">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h2 className="text-xl font-serif font-medium flex items-center gap-2">
                        <Coffee className="w-5 h-5 text-[#d2691e]" /> Menu Knowledge Base
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">Organize your offerings to help the AI answer menu guestions.</p>
                    </div>
                    <button 
                      onClick={addMenuCategory}
                      className="flex items-center gap-2 bg-[#f5f2ed] text-[#d2691e] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#ece6da] transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" /> Add Category
                    </button>
                  </div>

                  <div className="space-y-12">
                    {config.menu.map((cat, catIdx) => (
                      <div key={cat.id} className="relative">
                        <div className="flex items-center gap-4 mb-6">
                          <input 
                            type="text"
                            value={cat.name}
                            onChange={(e) => {
                              const newMenu = [...config.menu];
                              newMenu[catIdx].name = e.target.value;
                              updateConfigField("menu", newMenu);
                            }}
                            className="text-xl font-serif font-medium bg-transparent border-b border-dashed border-[#ececec] focus:border-[#d2691e] focus:ring-0 outline-none pb-1 transition-all"
                          />
                          <button 
                            onClick={() => addMenuItem(cat.id)}
                            className="bg-gray-50 text-gray-400 p-1.5 rounded-lg hover:text-[#d2691e] hover:bg-[#fefce8] transition-all"
                            title="Add item to this category"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button 
                             onClick={() => {
                               const newMenu = [...config.menu];
                               newMenu.splice(catIdx, 1);
                               updateConfigField("menu", newMenu);
                             }}
                             className="ml-auto text-gray-300 hover:text-red-400 transition-colors"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {cat.items.map((item, itemIdx) => (
                            <motion.div 
                              layout
                              key={item.id} 
                              className="bg-[#fcfcfc] p-4 rounded-2xl border border-[#f5f5f5] hover:border-gray-200 transition-all group"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <input 
                                  value={item.name}
                                  onChange={(e) => {
                                    const newMenu = [...config.menu];
                                    newMenu[catIdx].items[itemIdx].name = e.target.value;
                                    updateConfigField("menu", newMenu);
                                  }}
                                  className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 p-0 text-[#1a1a1a]"
                                  placeholder="Item Name"
                                />
                                <div className="flex items-center bg-white px-2 py-0.5 rounded-lg border border-gray-100 ml-2">
                                  <span className="text-[10px] text-gray-300 mr-1">{config.currency}</span>
                                  <input 
                                    value={item.price}
                                    onChange={(e) => {
                                      const newMenu = [...config.menu];
                                      newMenu[catIdx].items[itemIdx].price = e.target.value;
                                      updateConfigField("menu", newMenu);
                                    }}
                                    className="bg-transparent border-none text-[10px] font-bold focus:ring-0 p-0 w-12 text-[#d2691e]"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                              <textarea 
                                value={item.description}
                                onChange={(e) => {
                                  const newMenu = [...config.menu];
                                  newMenu[catIdx].items[itemIdx].description = e.target.value;
                                  updateConfigField("menu", newMenu);
                                }}
                                rows={2}
                                className="w-full bg-transparent border-none text-[10px] text-gray-400 focus:ring-0 p-0 resize-none leading-relaxed"
                                placeholder="Brief description of the dish..."
                              />

                              {/* Food Image URL & Preview */}
                              <div className="mt-2 text-[10px] space-y-1">
                                <label className="text-gray-400 font-bold block uppercase tracking-wider text-[8px]">Food Image URL</label>
                                <div className="flex gap-2">
                                  {item.imageUrl ? (
                                    <img 
                                      src={item.imageUrl} 
                                      alt={item.name} 
                                      referrerPolicy="no-referrer" 
                                      className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0" 
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg border border-dashed border-stone-200 flex items-center justify-center text-stone-300 shrink-0 bg-stone-50">
                                      <Camera className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                  <input 
                                    value={item.imageUrl || ""}
                                    onChange={(e) => {
                                      const newMenu = [...config.menu];
                                      newMenu[catIdx].items[itemIdx].imageUrl = e.target.value;
                                      updateConfigField("menu", newMenu);
                                    }}
                                    className="flex-1 bg-white border border-stone-100 rounded-lg px-2 py-1 text-[10px] focus:border-[#d2691e] outline-none font-sans"
                                    placeholder="https://images.unsplash.com/photo-..."
                                  />
                                </div>
                              </div>

                              {/* Veg flag & Spice levels selectors */}
                              <div className="mt-2.5 grid grid-cols-2 gap-2 text-[10px]">
                                <div className="space-y-1">
                                  <label className="text-gray-400 font-bold block uppercase tracking-wider text-[8px]">Dietary Tag</label>
                                  <select
                                    value={item.isVeg === undefined ? "none" : item.isVeg ? "veg" : "nonveg"}
                                    onChange={(e) => {
                                      const newMenu = [...config.menu];
                                      const val = e.target.value;
                                      if (val === "none") {
                                        newMenu[catIdx].items[itemIdx].isVeg = undefined;
                                        newMenu[catIdx].items[itemIdx].dietaryTags = (item.dietaryTags || []).filter(t => t !== "V" && t !== "VG");
                                      } else if (val === "veg") {
                                        newMenu[catIdx].items[itemIdx].isVeg = true;
                                        const tags = item.dietaryTags || [];
                                        if (!tags.includes("V")) tags.push("V");
                                        newMenu[catIdx].items[itemIdx].dietaryTags = tags;
                                      } else {
                                        newMenu[catIdx].items[itemIdx].isVeg = false;
                                        newMenu[catIdx].items[itemIdx].dietaryTags = (item.dietaryTags || []).filter(t => t !== "V" && t !== "VG");
                                      }
                                      updateConfigField("menu", newMenu);
                                    }}
                                    className="w-full bg-white border border-stone-100 rounded-lg px-2 py-1 focus:border-[#d2691e] outline-none font-sans cursor-pointer text-gray-700"
                                  >
                                    <option value="none">Standard</option>
                                    <option value="veg">Veg 🌱</option>
                                    <option value="nonveg">Non-Veg 🍗</option>
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-gray-400 font-bold block uppercase tracking-wider text-[8px]">Spice Level</label>
                                  <select
                                    value={item.spiceLevel || 0}
                                    onChange={(e) => {
                                      const newMenu = [...config.menu];
                                      newMenu[catIdx].items[itemIdx].spiceLevel = parseInt(e.target.value);
                                      updateConfigField("menu", newMenu);
                                    }}
                                    className="w-full bg-white border border-stone-100 rounded-lg px-2 py-1 focus:border-[#d2691e] outline-none font-sans cursor-pointer text-gray-700"
                                  >
                                    <option value="0">Not Spicy 🌶️0</option>
                                    <option value="1">Mild 🌶️1</option>
                                    <option value="2">Medium 🌶️2</option>
                                    <option value="3">Hot 🌶️3</option>
                                  </select>
                                </div>
                              </div>

                              {/* Custom Toppings List */}
                              <div className="mt-2.5 space-y-1 text-[10px] border-t border-stone-100/60 pt-2.5">
                                <div className="flex justify-between items-center text-gray-400 font-bold uppercase tracking-wider text-[8px]">
                                  <span>Customizations</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newMenu = [...config.menu];
                                      const currentOpts = newMenu[catIdx].items[itemIdx].customizations || [];
                                      newMenu[catIdx].items[itemIdx].customizations = [
                                        ...currentOpts,
                                        { name: "Extra ingredient", price: "1.50" }
                                      ];
                                      updateConfigField("menu", newMenu);
                                    }}
                                    className="text-[#d2691e] hover:underline flex items-center gap-0.5 normal-case tracking-normal"
                                  >
                                    <Plus className="w-2.5 h-2.5" /> add option
                                  </button>
                                </div>
                                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pt-1">
                                  {(item.customizations || []).map((opt, optIdx) => (
                                    <div key={optIdx} className="flex gap-1.5 items-center">
                                      <input 
                                        value={opt.name}
                                        onChange={(e) => {
                                          const newMenu = [...config.menu];
                                          const opts = [...(newMenu[catIdx].items[itemIdx].customizations || [])];
                                          opts[optIdx].name = e.target.value;
                                          newMenu[catIdx].items[itemIdx].customizations = opts;
                                          updateConfigField("menu", newMenu);
                                        }}
                                        className="flex-1 bg-white border border-stone-100 rounded-lg px-2 py-0.5 text-[9px] focus:border-[#d2691e] outline-none font-sans"
                                        placeholder="Add-on e.g. Extra Feta"
                                      />
                                      <div className="flex items-center bg-white px-1.5 py-0.5 rounded-lg border border-stone-100 w-14 shrink-0">
                                        <span className="text-[8px] text-gray-300 mr-0.5">{config.currency}</span>
                                        <input 
                                          value={opt.price}
                                          onChange={(e) => {
                                            const newMenu = [...config.menu];
                                            const opts = [...(newMenu[catIdx].items[itemIdx].customizations || [])];
                                            opts[optIdx].price = e.target.value;
                                            newMenu[catIdx].items[itemIdx].customizations = opts;
                                            updateConfigField("menu", newMenu);
                                          }}
                                          className="bg-transparent border-none text-[9px] font-bold focus:ring-0 p-0 w-full text-stone-700"
                                          placeholder="0.00"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newMenu = [...config.menu];
                                          const opts = [...(newMenu[catIdx].items[itemIdx].customizations || [])];
                                          opts.splice(optIdx, 1);
                                          newMenu[catIdx].items[itemIdx].customizations = opts;
                                          updateConfigField("menu", newMenu);
                                        }}
                                        className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
                                        title="Delete option"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                  {(!item.customizations || item.customizations.length === 0) && (
                                    <p className="text-gray-400/80 italic text-[9px] py-1 font-sans">No customizations configured.</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex justify-end items-center mt-3 pt-3 border-t border-[#f8f8f8]">
                                <button 
                                  onClick={() => {
                                    const newMenu = [...config.menu];
                                    newMenu[catIdx].items.splice(itemIdx, 1);
                                    updateConfigField("menu", newMenu);
                                  }}
                                  className="text-stone-300 hover:text-red-400 group-hover:opacity-100 transition-all text-xs flex items-center gap-1 font-sans font-medium"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete Item
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-40" /> {/* Spacer */}
              </section>

              {/* Floating Action Bar */}
              <div className="fixed bottom-20 md:bottom-8 left-0 md:left-16 right-0 flex justify-center px-4 pointer-events-none z-40">
                <div className="bg-white/80 backdrop-blur-md border border-[#ececec] px-6 py-3 rounded-2xl shadow-xl flex items-center gap-6 pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Live Training</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200" />
                    <button 
                        onClick={() => {
                            setActiveTab("chat");
                            const currentLang = config.defaultLanguage || "English";
                            const updateMsgMap: Record<string, string> = {
                                English: `I've updated my knowledge with your latest changes! I'm ${config.agentName} from ${config.restaurantName}. How can I assist you now?`,
                                Spanish: `¡He actualizado mis conocimientos con tus últimos cambios! Soy ${config.agentName} de ${config.restaurantName}. ¿Cómo te puedo ayudar ahora?`,
                                French: `J'ai mis à jour mes connaissances avec vos dernières modifications ! Je suis ${config.agentName} de ${config.restaurantName}. Comment puis-je vous aider maintenant ?`,
                                German: `Ich habe mein Wissen mit Ihren neuesten Änderungen aktualisiert! Ich bin ${config.agentName} von ${config.restaurantName}. Wie kann ich Ihnen jetzt helfen?`,
                                Chinese: `我已经根据您最新的更改更新了我的知识库！我是来自 ${config.restaurantName} 的 ${config.agentName}。现在有什么可以帮您的？`,
                                Italian: `Ho aggiornato le mie conoscenze con le tue ultime modifiche! Sono ${config.agentName} di ${config.restaurantName}. Come posso aiutarti ora?`,
                                Japanese: `最新の変更に基づいて知識ベースを更新しました！${config.restaurantName}の${config.agentName}です。どのようなご用件でしょうか？`,
                                Portuguese: `Atualizei os meus conhecimentos com as suas alterações mais recentes! Eu sou ${config.agentName} do ${config.restaurantName}. Como posso ajudar você agora?`,
                                Hindi: `मैंने आपके नवीनतम बदलावों के साथ अपनी जानकारी अपडेट कर ली है! मैं ${config.restaurantName} से ${config.agentName} हूँ। अब मैं आपकी क्या सहायता कर सकता हूँ?`
                            };

                            const syncMsgMap: Record<string, string> = {
                                English: "Knowledge base synchronized! Testing mode active.",
                                Spanish: "¡Base de conocimientos sincronizada! Modo de prueba activo.",
                                French: "Base de connaissances synchronisée ! Mode test actif.",
                                German: "Wissensdatenbank synchronisiert! Testmodus aktiv.",
                                Chinese: "知识库同步成功！测试模式已激活。",
                                Italian: "Base di conoscenza sincronizzata! Modalità di test attiva.",
                                Japanese: "知識ベースが同期されました！テストモードが有効です。",
                                Portuguese: "Base de dados de conhecimento sincronizada! Modo de teste ativo.",
                                Hindi: "ज्ञान का आधार सिंक्रनाइज़ किया गया! परीक्षण मोड सक्रिय।"
                            };

                            if (messages.length === 0) {
                                setMessages([{ role: "bot", text: updateMsgMap[currentLang] || updateMsgMap["English"] }]);
                            } else {
                                setMessages(prev => [...prev, { role: "bot", text: syncMsgMap[currentLang] || syncMsgMap["English"] }]);
                            }
                        }}
                        className="flex items-center gap-2 text-xs font-bold text-[#d2691e] hover:opacity-80 transition-opacity"
                    >
                        <MessageSquare className="w-4 h-4" /> Test AI Host
                    </button>
                    <div className="w-px h-4 bg-gray-200" />
                    <button 
                         onClick={handleSaveConfig}
                         className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black transition-colors"
                    >
                        {isSaving ? "Syncing..." : "Sync Knowledge"}
                    </button>
                </div>
              </div>
            </motion.div>
          )
        ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex h-[calc(100vh-5rem)] md:h-screen bg-white"
            >
              {/* Chat View */}
              <div className="flex-1 flex flex-col max-w-2xl mx-auto border-x border-[#ececec] overflow-hidden">
                <header className="px-4 md:px-6 py-3 md:py-4 border-b border-[#ececec] flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#f5f2ed] flex items-center justify-center text-[#d2691e]">
                      {getLogoIconComponent(activeConfig.logoIcon, "w-5 h-5 md:w-6 md:h-6")}
                    </div>
                    <div>
                      <h3 className="font-serif font-medium leading-tight text-sm md:text-base">{activeConfig.agentName}</h3>
                      <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-[#d2691e] font-bold">Virtual Host</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Visitor Language Selector Dropdown */}
                    {enabledLangs.length > 1 && (
                      <div className="relative flex items-center bg-[#fdfaf6] border border-[#f0e8dc] hover:bg-[#f8f1e7] rounded-full transition-all shadow-sm pl-2.5 pr-2 py-1.5 gap-1.5 group select-none">
                        {isTranslating ? (
                          <Loader2 className="w-3.5 h-3.5 text-[#d2691e] animate-spin" />
                        ) : (
                          <Languages className="w-3.5 h-3.5 text-[#d2691e]" />
                        )}
                        <select
                          value={visitorLanguage}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-wider text-gray-700 cursor-pointer appearance-none pr-3"
                        >
                          {enabledLangs.map((lang) => (
                            <option key={lang} value={lang}>
                              {lang === "English" ? "EN" : lang === "Spanish" ? "ES" : lang === "French" ? "FR" : lang === "German" ? "DE" : lang === "Chinese" ? "ZH" : lang === "Italian" ? "IT" : lang === "Japanese" ? "JA" : lang === "Portuguese" ? "PT" : lang === "Hindi" ? "HI" : lang.slice(0, 2).toUpperCase()}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-1.5 top-2.5 flex items-center text-gray-400">
                          <ChevronRight className="w-2.5 h-2.5 transform rotate-90 text-[#d2691e]" />
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => setShowFullMenu(true)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#fdfaf6] border border-[#f0e8dc] rounded-full text-[#d2691e] hover:bg-[#f8f1e7] transition-all shadow-sm"
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{t("fullMenu")}</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowOrderTracker(true)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#fdfaf6] border border-[#f0e8dc] rounded-full text-[#d2691e] hover:bg-[#f8f1e7] transition-all shadow-sm"
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Track Order</span>
                    </button>
                    <button 
                      onClick={clearChat}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title={t("clearHistory")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setShowStoreInfo(true)}
                      className="lg:hidden p-2 text-gray-400 hover:text-[#d2691e] transition-colors"
                    >
                      <Clock className="w-5 h-5" />
                    </button>
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#f5f2ed] rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t("online")}</span>
                    </div>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
                  {messages.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12 md:py-20 space-y-8"
                    >
                       <div className="w-20 h-20 bg-[#fdfaf6] rounded-3xl mx-auto flex items-center justify-center text-[#d2691e] shadow-sm transform -rotate-3">
                         {getLogoIconComponent(activeConfig.logoIcon, "w-10 h-10")}
                       </div>
                       <div className="max-w-xs mx-auto">
                         <h4 className="text-xl md:text-2xl font-serif font-medium">{t("welcome")} {activeConfig.restaurantName}</h4>
                         <p className="text-sm text-gray-500 mt-3 leading-relaxed">{t("intro", { agent: activeConfig.agentName })}</p>
                       </div>
                       <button 
                         onClick={() => setShowFullMenu(true)}
                         className="mx-auto flex items-center gap-3 bg-[#1a1a1a] text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-black/10 group"
                       >
                         <Coffee className="w-5 h-5 text-[#d2691e] group-hover:scale-110 transition-transform" />
                         {t("browseMenu")}
                       </button>
                    </motion.div>
                  )}
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] px-5 py-3 rounded-3xl ${
                        msg.role === "user" 
                        ? "bg-[#d2691e] text-white rounded-tr-none" 
                        : "bg-[#f9f9f9] text-[#1a1a1a] rounded-tl-none border border-[#ececec]"
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-[#f9f9f9] px-5 py-3 rounded-3xl rounded-tl-none border border-[#ececec]">
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75" />
                          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-3 md:p-6 bg-white border-t border-[#ececec] z-10">
                  <div className="relative flex items-center bg-[#f9f9f9] rounded-xl md:rounded-2xl px-3 md:px-4 py-1 border border-transparent focus-within:border-[#d2691e] transition-all shadow-sm">
                    <input 
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder={t("askPlaceholder")}
                      className="flex-1 bg-transparent border-none outline-none py-2 text-sm h-10 md:h-12"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="p-1.5 md:p-2 ml-2 bg-[#d2691e] text-white rounded-lg md:rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                      disabled={isTyping || !inputMessage.trim()}
                    >
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                  <p className="text-[8px] md:text-[10px] text-center text-gray-400 mt-2 md:mt-4 leading-relaxed uppercase tracking-wider font-medium">
                    Designed by Tanishk.
                  </p>
                </div>
              </div>

              {/* Mobile Store Info Modal */}
              <AnimatePresence>
                {showStoreInfo && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-end sm:items-center justify-center p-4"
                    onClick={() => setShowStoreInfo(false)}
                  >
                    <motion.div 
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-serif font-medium">{t("storeInfo")}</h3>
                        <button onClick={() => setShowStoreInfo(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-[#d2691e]" />
                          <div className="text-sm">
                            <p className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                            <p className="text-gray-500">
                              {activeConfig.openingHours[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()]?.isClosed 
                                ? t("noClosed") 
                                : `${activeConfig.openingHours[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()]?.open} - ${activeConfig.openingHours[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()]?.close}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-[#d2691e]" />
                          <div className="text-sm">
                            <p className="font-semibold">{t("location")}</p>
                            <p className="text-gray-500">{activeConfig.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-[#d2691e]" />
                          <div className="text-sm">
                            <p className="font-semibold">{t("contact")}</p>
                            <p className="text-gray-500">{activeConfig.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 pt-4">
                        <a href={activeConfig.website} target="_blank" className="text-center p-3 bg-[#f5f2ed] rounded-xl text-sm font-semibold text-[#d2691e]">{t("visitWebsite")}</a>
                        <button onClick={() => setShowStoreInfo(false)} className="text-center p-3 text-gray-400 text-sm">{t("close")}</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Customer Order Tracker Modal */}
              <AnimatePresence>
                {showOrderTracker && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[120] flex items-end sm:items-center justify-center p-4"
                    onClick={() => setShowOrderTracker(false)}
                  >
                    <motion.div 
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-6 max-h-[85vh] flex flex-col overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="w-5 h-5 text-[#d2691e]" />
                          <h3 className="text-xl font-serif font-medium text-stone-950">Track Your Orders</h3>
                        </div>
                        <button onClick={() => setShowOrderTracker(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Phone Lookup Input */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleTrackOrders();
                        }}
                        className="space-y-3"
                      >
                        <p className="text-xs text-gray-400">
                          Enter the mobile number you registered during checkout to track active kitchen states.
                        </p>
                        <div className="relative flex items-center bg-[#f9f9f9] rounded-xl px-3.5 py-1.5 border border-gray-200 focus-within:border-[#d2691e] transition-all">
                          <Phone className="w-4 h-4 text-gray-450 mr-2.5" />
                          <input 
                            type="tel"
                            value={trackingPhone}
                            onChange={(e) => setTrackingPhone(e.target.value)}
                            placeholder="e.g. (555) 123-4567"
                            className="flex-1 bg-transparent border-none outline-none py-1.5 text-sm"
                            required
                          />
                          <button 
                            type="submit"
                            disabled={isTrackingLoading || !trackingPhone.trim()}
                            className="bg-[#d2691e] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:opacity-95 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {isTrackingLoading ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Search className="w-3 h-3" />
                            )}
                            Track
                          </button>
                        </div>
                        {trackingError && (
                          <p className="text-xs text-red-500 font-semibold">{trackingError}</p>
                        )}
                      </form>

                      {/* Orders Content (Scrollable List) */}
                      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                        {trackingOrders.length > 0 ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400 font-bold uppercase tracking-wider">
                                Active Orders ({trackingOrders.length})
                              </span>
                              <button 
                                type="button"
                                onClick={() => handleTrackOrders()}
                                className="flex items-center gap-1 text-[#d2691e] font-bold hover:underline"
                                disabled={isTrackingLoading}
                              >
                                <RefreshCw className={`w-3 h-3 ${isTrackingLoading ? 'animate-spin' : ''}`} />
                                Refresh Status
                              </button>
                            </div>
                            
                            {trackingOrders.map((order) => (
                              <div 
                                key={order.id} 
                                className="border border-stone-100 rounded-2xl p-4 space-y-3.5 bg-[#fdfaf6]"
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <span className="bg-stone-900 text-white font-bold text-[10px] px-2 py-0.5 rounded mr-2">
                                      Table {order.tableNumber}
                                    </span>
                                    <span className="font-mono text-xs text-gray-400">#{order.id.replace('order-', '')}</span>
                                  </div>
                                  
                                  {/* Custom beautiful badge */}
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    order.status === "pending" ? "bg-amber-100 text-amber-700 animate-pulse animate-duration-1000" :
                                    order.status === "baking" ? "bg-blue-100 text-blue-700 animate-pulse animate-duration-1000" :
                                    order.status === "cancelled" ? "bg-red-100 text-red-700 font-semibold" :
                                    "bg-green-100 text-green-700"
                                  }`}>
                                    {order.status === "pending" ? "Waiting for Prep" :
                                     order.status === "baking" ? "In the Oven" :
                                     order.status === "cancelled" ? "Cancelled" :
                                     "Served / Ready"}
                                  </span>
                                </div>

                                {/* Order details */}
                                <div className="space-y-1 text-xs">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-gray-600">
                                      <span>{item.name}</span>
                                      <span className="font-mono text-[#d2691e]">x{item.quantity}</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex justify-between items-baseline pt-2.5 border-t border-dashed border-stone-200 text-xs text-stone-950">
                                  <span className="text-gray-400 font-bold">Total Cost:</span>
                                  <span className="font-serif font-bold text-[#d2691e]">
                                    {activeConfig.currency}{order.totalPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          !isTrackingLoading && !trackingError && (
                            <div className="text-center py-12 text-gray-300">
                              <ClipboardList className="w-12 h-12 mx-auto mb-2 text-stone-200" />
                              <p className="text-sm">Enter phone number to track your orders in real time.</p>
                            </div>
                          )
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sidebar Info */}
              <div className="hidden lg:flex w-80 flex-col bg-[#fafaf8] border-l border-[#ececec] p-8 space-y-8">
                <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 font-bold">{t("storeInfo")}</h4>
                    <div className="bg-white p-5 rounded-2xl border border-[#ececec] shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-[#d2691e]" />
                            <div className="text-xs">
                                <p className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                <p className="text-gray-500">{activeConfig.openingHours[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()]?.isClosed ? t("noClosed") : `${activeConfig.openingHours[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()]?.open} - ${activeConfig.openingHours[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()]?.close}`}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-[#d2691e]" />
                            <div className="text-xs">
                                <p className="font-semibold">{t("location")}</p>
                                <p className="text-gray-500 break-words">{activeConfig.address}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-[#d2691e]" />
                            <div className="text-xs">
                                <p className="font-semibold">{t("reservations")}</p>
                                <p className="text-gray-500">{activeConfig.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4">{t("storeInfo")} Links</h4>
                    <div className="space-y-2">
                        <a href={activeConfig.website} target="_blank" className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#ececec] text-xs font-semibold hover:bg-[#f5f2ed] transition-colors">
                            {t("officialWebsite")} <ExternalLink className="w-3 h-3" />
                        </a>
                        <a href={`https://instagram.com/${activeConfig.instagram.replace('@', '')}`} target="_blank" className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#ececec] text-xs font-semibold hover:bg-[#f5f2ed] transition-colors">
                            {t("instagramProfile")} <Instagram className="w-3 h-3" />
                        </a>
                    </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dedicated Attractive Full Menu View Overlay */}
        <AnimatePresence>
          {showFullMenu && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-[#f5f5f5]">
                <div className="flex items-center gap-3">
                  {getLogoIconComponent(activeConfig.logoIcon, "w-6 h-6 text-[#d2691e]")}
                  <h2 className="text-2xl font-serif font-medium">{activeConfig.restaurantName} Menu</h2>
                </div>
                <button 
                  onClick={() => setShowFullMenu(false)}
                  className="p-2 bg-[#fcfcfc] rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20 text-center">
                <div className="max-w-4xl mx-auto space-y-16">
                  {/* Signature Dishes Section */}
                  {activeConfig.signatureDishes.length > 0 && (
                    <section className="bg-[#fdfaf6] p-8 md:p-12 rounded-[32px] border border-[#f0e8dc] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Star className="w-32 h-32 text-[#d2691e] rotate-12" />
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex flex-col items-center gap-3 mb-10">
                          <div className="flex items-center gap-2 text-[#d2691e] bg-white px-4 py-1.5 rounded-full border border-[#f0e8dc] shadow-sm">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{t("specials")}</span>
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                          <h3 className="text-4xl md:text-5xl font-serif font-medium italic">{t("chefSignatures")}</h3>
                        </div>
                        
                        <div className="space-y-8">
                          {activeConfig.signatureDishes.map((dish, i) => {
                            const [name, ...descParts] = dish.split(" — ");
                            const desc = descParts.join(" — ");
                            return (
                              <div key={i} className="max-w-2xl mx-auto">
                                <h4 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-tight">{name}</h4>
                                {desc && <p className="text-lg text-gray-500 italic leading-relaxed">{desc}</p>}
                                {i < activeConfig.signatureDishes.length - 1 && (
                                  <div className="w-12 h-px bg-[#d2691e]/20 mx-auto mt-8" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </section>
                  )}

                  {activeConfig.menu.map((category) => (
                    <section key={category.id} className="text-left">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-[#ececec]" />
                        <h3 className="text-3xl font-serif font-medium italic text-[#d2691e] px-4 text-center">{category.name}</h3>
                        <div className="h-px flex-1 bg-[#ececec]" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {category.items.map((item) => {
                          const isInCart = cart.find((i) => i.id === item.id);
                          return (
                            <div key={item.id} className="group bg-white p-5 rounded-3xl border border-stone-200 transition-all hover:border-[#d2691e]/40 hover:shadow-md hover:shadow-stone-200/40 flex flex-col justify-between h-full">
                               <div className="space-y-4">
                                 {/* Flex header with optional food image */}
                                 <div className="flex gap-4">
                                   {item.imageUrl && (
                                     <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-stone-100 bg-stone-50">
                                       <img 
                                         src={item.imageUrl} 
                                         alt={item.name} 
                                         referrerPolicy="no-referrer" 
                                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                       />
                                     </div>
                                   )}
                                   <div className="flex-1 min-w-0">
                                     {/* Badges for dietary specifications */}
                                     {(item.isVeg !== undefined || (item.spiceLevel !== undefined && item.spiceLevel > 0)) && (
                                       <div className="flex flex-wrap gap-1.5 mb-2">
                                         {item.isVeg === true && (
                                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100/60 font-sans">
                                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Veg
                                           </span>
                                         )}
                                         {item.isVeg === false && (
                                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100/60 font-sans">
                                             <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Non-Veg
                                           </span>
                                         )}
                                         {item.spiceLevel !== undefined && item.spiceLevel > 0 ? (
                                           <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100/60 font-sans">
                                             {"🌶️".repeat(item.spiceLevel)}
                                           </span>
                                         ) : null}
                                       </div>
                                     )}
                                     <h4 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-[#d2691e] transition-colors uppercase tracking-tight truncate">
                                       {item.name}
                                     </h4>
                                     <p className="text-xl font-serif font-bold text-[#d2691e] mt-0.5">
                                       {activeConfig.currency}{item.price}
                                     </p>
                                   </div>
                                 </div>
                                 <p className="text-xs md:text-sm text-gray-500 italic leading-relaxed">{item.description}</p>
                                 
                                 {/* Customization options preview list if configured */}
                                 {item.customizations && item.customizations.length > 0 && (
                                   <div className="bg-stone-50/50 rounded-xl p-2.5 border border-stone-100 text-[10px] space-y-1">
                                     <p className="text-[#d2691e] font-bold uppercase tracking-wider text-[8px] flex items-center gap-1 font-sans">
                                       ✨ Customize Options Available
                                     </p>
                                     <div className="flex flex-wrap gap-1.5 mt-1 font-sans">
                                       {item.customizations.map((c, ic) => (
                                         <span key={ic} className="bg-white px-2 py-0.5 rounded-md border border-stone-200/60 text-stone-500 font-medium whitespace-nowrap text-[9px]">
                                           +{c.name} ({activeConfig.currency}{c.price})
                                         </span>
                                       ))}
                                     </div>
                                   </div>
                                 )}
                               </div>
                               
                               <div className="flex justify-end pt-3 mt-4 border-t border-stone-200/40">
                                 {isInCart ? (
                                   <div className="flex items-center gap-3 bg-[#d2691e] text-white rounded-full px-3 py-1 font-sans text-xs shadow-sm">
                                     <button 
                                       type="button"
                                        onClick={() => updateCartQuantity(item.id, -1)}
                                       className="w-5 h-5 flex items-center justify-center hover:bg-black/15 rounded-full font-bold transition-colors select-none text-sm"
                                       title="Decrease quantity"
                                     >
                                       -
                                     </button>
                                     <span className="font-bold w-4 text-center text-sm">{isInCart.quantity}</span>
                                     <button 
                                       type="button"
                                        onClick={() => updateCartQuantity(item.id, 1)}
                                       className="w-5 h-5 flex items-center justify-center hover:bg-black/15 rounded-full font-bold transition-colors select-none text-sm"
                                       title="Increase quantity"
                                     >
                                       +
                                     </button>
                                   </div>
                                 ) : (
                                   <button
                                     type="button"
                                     onClick={() => handleOpenCustomization(item)}
                                     className="px-4 py-1.5 border border-[#d2691e] hover:bg-[#d2691e] text-[#d2691e] hover:text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95 cursor-pointer font-sans"
                                   >
                                     <Plus className="w-3.5 h-3.5" /> 
                                     {item.customizations && item.customizations.length > 0 
                                       ? "Customize" 
                                       : (t("add") || "Add")}
                                   </button>
                                 )}
                               </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                  
                  <div className="pt-20 text-center space-y-4">
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-[0.2em]">{activeConfig.address}</p>
                    <div className="flex justify-center gap-6 text-gray-400">
                       <span className="text-xs font-bold text-black border-b-2 border-[#d2691e] pb-1">{activeConfig.phone}</span>
                       <span className="text-xs font-bold text-[#d2691e]">{activeConfig.website}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating checkout basket ribbon */}
              {cart.length > 0 && (
                <motion.div 
                   initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 80, opacity: 0 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-zinc-900 border border-zinc-800 text-white rounded-full shadow-2xl pl-5 pr-2 py-2 flex items-center gap-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#d2691e] text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-inner">
                      {cart.reduce((s, i) => s + i.quantity, 0)}
                    </div>
                    <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                      {t("basket") || "Basket"}
                    </div>
                  </div>
                  <div className="h-5 w-px bg-zinc-800" />
                  <span className="text-sm font-serif font-bold text-[#d2691e]">{activeConfig.currency}{getCartTotal().toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOrderSuccess(false);
                      setShowCheckoutModal(true);
                    }}
                    className="bg-[#d2691e] hover:bg-[#b05212] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all active:scale-95 cursor-pointer shadow-md"
                  >
                    {t("checkoutOrders") || "Checkout"}
                  </button>
                </motion.div>
              )}

              {/* Secure checkout slide overlay/modal */}
              <AnimatePresence>
                {showCheckoutModal && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                  >
                    <motion.div 
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 15 }}
                      className="bg-white rounded-[32px] max-w-lg w-full p-6 md:p-8 shadow-2xl border border-stone-200 overflow-hidden relative flex flex-col max-h-[90vh]"
                    >
                      {/* Success block */}
                      {orderSuccess ? (
                        <div className="text-center py-6 space-y-6 flex-1 flex flex-col justify-center items-center">
                          <div className="bg-[#d2691e]/10 text-[#d2691e] p-4 rounded-full animate-bounce">
                            <CheckCircle className="w-16 h-16" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-2xl font-serif font-medium text-gray-900">{t("orderPlaced") || "Order Placed Successfully!"}</h3>
                            <p className="text-xs text-gray-400">{t("kitchenStaffNotify") || "We have notified the kitchen staff. Your order is pending prep."}</p>
                          </div>
                          
                          <div className="bg-stone-50 p-4 rounded-2xl w-full text-left space-y-2 text-xs border border-stone-100 font-sans">
                            <p className="flex justify-between"><span className="text-gray-400 uppercase tracking-wider font-bold">Order ID:</span> <span className="font-mono text-gray-900 font-bold">{placedOrderId}</span></p>
                            <p className="flex justify-between"><span className="text-gray-400 uppercase tracking-wider font-bold">Table No:</span> <span className="text-gray-900 font-bold">{orderTableNumber}</span></p>
                            <p className="flex justify-between"><span className="text-gray-400 uppercase tracking-wider font-bold">Mobile:</span> <span className="text-gray-900 font-bold">{orderMobileNumber}</span></p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setShowCheckoutModal(false);
                              setOrderSuccess(false);
                              setTrackingPhone(orderMobileNumber);
                              handleTrackOrders(orderMobileNumber);
                              setShowOrderTracker(true);
                            }}
                            className="w-full bg-[#d2691e] hover:bg-[#b85311] text-white p-3.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all active:scale-95 shadow-lg shadow-[#d2691e]/10 cursor-pointer mb-2 font-sans"
                          >
                            Track Live Order Status
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowCheckoutModal(false);
                              setOrderSuccess(false);
                            }}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white p-3.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all active:scale-95"
                          >
                            {t("continueBrowsing") || "Continue Browsing"}
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handlePlaceOrder} className="space-y-6 flex-1 flex flex-col overflow-hidden">
                          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-serif font-medium">{t("reviewYourOrder") || "Review Your Order"}</h3>
                            <button 
                              type="button" 
                              onClick={() => setShowCheckoutModal(false)}
                              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <X className="w-5 h-5 text-gray-400" />
                            </button>
                          </div>

                          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                            {cart.length === 0 ? (
                              <p className="text-center py-8 text-gray-400 text-sm">{t("emptyBasketMsg") || "Your order basket is currently empty"}</p>
                            ) : (
                              cart.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-stone-50/50 p-3.5 rounded-2xl border border-stone-100">
                                  <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                    <p className="text-xs text-[#d2691e] font-sans font-bold">{activeConfig.currency}{item.price} each</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center bg-stone-200 rounded-full px-2 py-0.5 text-xs text-gray-700">
                                      <button 
                                        type="button"
                                        onClick={() => updateCartQuantity(item.id, -1)}
                                        className="w-4 h-4 flex items-center justify-center hover:bg-gray-300 rounded-full"
                                      >
                                        -
                                      </button>
                                      <span className="w-5 text-center font-bold">{item.quantity}</span>
                                      <button 
                                        type="button"
                                        onClick={() => updateCartQuantity(item.id, 1)}
                                        className="w-4 h-4 flex items-center justify-center hover:bg-gray-300 rounded-full"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <button 
                                      type="button" 
                                      onClick={() => updateCartQuantity(item.id, -item.quantity)}
                                      className="text-gray-400 hover:text-red-500 p-1"
                                      title="Remove item"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}

                            <div className="h-px bg-gray-100" />

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Table number</label>
                                <input
                                  type="text"
                                  required
                                  value={orderTableNumber}
                                  onChange={(e) => setOrderTableNumber(e.target.value)}
                                  placeholder="e.g. Table 12"
                                  className="w-full bg-stone-50 border border-stone-200/80 rounded-xl px-3 py-2 text-sm focus:border-[#d2691e] focus:bg-white outline-none transition-all"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mobile Number</label>
                                <input
                                  type="tel"
                                  required
                                  value={orderMobileNumber}
                                  onChange={(e) => setOrderMobileNumber(e.target.value)}
                                  placeholder="e.g. 555-0199"
                                  className="w-full bg-stone-50 border border-stone-200/80 rounded-xl px-3 py-2 text-sm focus:border-[#d2691e] focus:bg-white outline-none transition-all"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-100 pt-4 space-y-4">
                            <div className="flex justify-between items-baseline">
                              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t("totalCost") || "Total Cost"}:</span>
                              <span className="text-2xl font-serif font-bold text-[#d2691e]">{activeConfig.currency}{getCartTotal().toFixed(2)}</span>
                            </div>

                            <button
                              type="submit"
                              disabled={isPlacingOrder || cart.length === 0}
                              className="w-full bg-[#d2691e] hover:bg-[#b05212] disabled:opacity-50 text-white p-3.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                              {isPlacingOrder ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4" /> {t("placeOrder") || "PLACE SECURE ORDER"}
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Item Customizations Selection Modal */}
              <AnimatePresence>
                {customizingItem && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
                  >
                    <motion.div 
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 15 }}
                      className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-stone-200 overflow-hidden flex flex-col relative max-h-[85vh]"
                    >
                      {/* Header with Cancel button */}
                      <div className="flex justify-between items-start pb-4 border-b border-stone-100">
                        <div>
                          <h3 className="text-xl font-bold text-stone-900 leading-tight">Customize Dish</h3>
                          <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">{customizingItem.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomizingItem(null);
                            setSelectedCustomOpts([]);
                          }}
                          className="p-1 px-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Content and Options list */}
                      <div className="flex-1 overflow-y-auto py-4 space-y-4">
                        {customizingItem.imageUrl && (
                          <div className="w-full h-40 rounded-2xl overflow-hidden border border-stone-150 bg-stone-50">
                            <img 
                              src={customizingItem.imageUrl} 
                              alt={customizingItem.name} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <p className="text-xs text-stone-500 italic leading-relaxed">{customizingItem.description}</p>
                        
                        <div className="space-y-2.5">
                          <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex justify-between">
                            <span>Available Toppings / Add-ons</span>
                            <span className="normal-case text-stone-500 font-medium">Select multiple options</span>
                          </h4>

                          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                            {(customizingItem.customizations || []).map((opt, optIdx) => {
                              const isSelected = selectedCustomOpts.some(o => o.name === opt.name);
                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedCustomOpts(prev => prev.filter(o => o.name !== opt.name));
                                    } else {
                                      setSelectedCustomOpts(prev => [...prev, opt]);
                                    }
                                  }}
                                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                                    isSelected 
                                      ? "bg-[#d2691e]/5 border-[#d2691e] text-[#d2691e] font-semibold" 
                                      : "bg-stone-50/50 border-stone-200 hover:border-stone-300 text-stone-700"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                      isSelected ? "bg-[#d2691e] border-[#d2691e] text-white" : "border-stone-300 bg-white"
                                    }`}>
                                      {isSelected && <span className="text-[10px] leading-none font-bold">✓</span>}
                                    </div>
                                    <span className="text-sm font-sans">{opt.name}</span>
                                  </div>
                                  <span className="text-xs font-bold font-serif text-[#d2691e]">+{activeConfig.currency}{opt.price}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Footer with calculated total and confirm trigger */}
                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider font-sans leading-none">Calculated Price</p>
                          <span className="text-2xl font-serif font-bold text-[#d2691e]">
                            {activeConfig.currency}
                            {(
                              (parseFloat(customizingItem.price) || 0) + 
                              selectedCustomOpts.reduce((acc, current) => acc + (parseFloat(current.price) || 0), 0)
                            ).toFixed(2)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleConfirmCustomization}
                          className="flex-1 bg-[#d2691e] hover:bg-[#b05212] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all active:scale-95 cursor-pointer shadow-md text-center inline-block"
                        >
                          Confirm & Add To Basket
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

