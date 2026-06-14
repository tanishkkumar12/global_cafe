export interface MenuItemCustomization {
  name: string;
  price: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  dietaryTags: string[]; // e.g. ["V", "VG", "GF", "DF"]
  imageUrl?: string;
  isVeg?: boolean;
  spiceLevel?: number;   // 0 = none, 1 = mild, 2 = medium, 3 = hot
  customizations?: MenuItemCustomization[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface OpeningHours {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface RestaurantConfig {
  agentName: string;
  restaurantName: string;
  restaurantType: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  tone: string;
  personality: string;
  priceRange: string;
  reservations: string;
  reservationMethod: string;
  parking: string;
  seating: string;
  wifi: boolean;
  wifiPassword?: string;
  kidFriendly: boolean;
  petFriendly: string;
  wheelchairAccessible: boolean;
  currency: string;
  paymentMethods: string[];
  openingHours: {
    [key: string]: OpeningHours;
  };
  menu: MenuCategory[];
  specials: { name: string; description: string; price: string; period: string }[];
  signatureDishes: string[];
  apiToken?: string;
  defaultLanguage?: string;
  activeLanguages?: string[];
  // Theme customization
  primaryColor?: string;
  fontFamily?: "serif" | "sans" | "mono" | "playfair" | "grotesk" | "outfit";
  logoIcon?: string; // Lucide icon identifier e.g., "coffee", "utensils", "chef-hat", "cake", "cupcacke", etc.
  themePreset?: "warm" | "forest" | "ocean" | "sunset" | "classic-dark" | "nordic";
}

export interface RestaurantListItem {
  id: string;
  restaurantName: string;
  agentName: string;
  restaurantType: string;
}

export interface AdminAccountItem {
  id: string;
  username: string;
  restaurantId: string;
  restaurantName: string;
  hasApiToken: boolean;
  apiToken?: string;
  password?: string;
}

export const DEFAULT_CONFIG: RestaurantConfig = {
  agentName: "Bella",
  restaurantName: "The Roasted Bean",
  restaurantType: "cozy neighbourhood café",
  address: "123 Espresso Lane, Coffee City, CA 90210",
  phone: "(555) 123-4567",
  email: "hello@roastedbean.com",
  website: "www.roastedbean.com",
  instagram: "@roastedbean",
  tone: "warm and conversational",
  personality: "friendly, efficient, witty",
  priceRange: "$10–$25 per person",
  reservations: "Recommended for brunch, walk-ins welcome",
  reservationMethod: "Website or Phone",
  parking: "Free street parking available",
  seating: "Indoor + Outdoor patio",
  wifi: true,
  wifiPassword: "COFFEE_LOVER",
  kidFriendly: true,
  petFriendly: "Outdoor seating only",
  wheelchairAccessible: true,
  currency: "$",
  paymentMethods: ["Cash", "All major cards", "Apple Pay"],
  openingHours: {
    monday: { open: "08:00", close: "18:00", isClosed: false },
    tuesday: { open: "08:00", close: "18:00", isClosed: false },
    wednesday: { open: "08:00", close: "18:00", isClosed: false },
    thursday: { open: "08:00", close: "18:00", isClosed: false },
    friday: { open: "08:00", close: "20:00", isClosed: false },
    saturday: { open: "09:00", close: "20:00", isClosed: false },
    sunday: { open: "09:00", close: "16:00", isClosed: false },
  },
  menu: [
    {
      id: "cat_starters",
      name: "Starters",
      items: [
        { 
          id: "starter_garlic", 
          name: "Rustic Garlic Bread", 
          description: "Baked artisan sourdough loaf brushed with wild garlic butter, fresh parsley, and sea salt flakes.", 
          price: "6.00", 
          dietaryTags: ["V"],
          imageUrl: "https://images.unsplash.com/photo-1573145959142-ede85f6eac90?auto=format&fit=crop&w=600&q=80",
          isVeg: true,
          spiceLevel: 0,
          customizations: [
            { name: "Extra Mozzarella Cheese", price: "2.00" },
            { name: "Add Jalapeno Slices", price: "1.00" }
          ]
        },
        { 
          id: "starter_cauliflower", 
          name: "Crispy Buffalo Cauliflower", 
          description: "Starch-battered organic florets tossed in fire-red cayenne pepper sauce, paired with herb sour cream.", 
          price: "11.00", 
          dietaryTags: ["V"],
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
          isVeg: true,
          spiceLevel: 2,
          customizations: [
            { name: "Extra Buffalo Glaze", price: "1.50" },
            { name: "Sub vegan dips", price: "0.50" }
          ]
        }
      ]
    },
    {
      id: "cat_mains",
      name: "Main Course",
      items: [
        { 
          id: "main_pizza", 
          name: "Truffle Margherita Pizza", 
          description: "San Marzano tomatoes, fresh hand-torn Mozzarella di Bufala, organic sweet basil, drizzled with cold-pressed black truffle oil.", 
          price: "18.50", 
          dietaryTags: ["V"],
          imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
          isVeg: true,
          spiceLevel: 0,
          customizations: [
            { name: "Burrata cheese crown", price: "4.55" },
            { name: "Gluten-free crust alternative", price: "3.00" }
          ]
        },
        { 
          id: "main_burger", 
          name: "Flame-Grilled Charcoal Burger", 
          description: "Prime Angus beef patty, sharp vintage cheddar, oak leaf lettuce, local heirloom tomato, house smoked brioche bun.", 
          price: "16.00", 
          dietaryTags: [],
          imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
          isVeg: false,
          spiceLevel: 1,
          customizations: [
            { name: "Thick applewood bacon strips", price: "2.50" },
            { name: "Smashed avocado cushion", price: "2.00" }
          ]
        }
      ]
    },
    {
      id: "cat_desserts",
      name: "Desserts",
      items: [
        { 
          id: "dessert_lava", 
          name: "Chocolate Fudge Lava Cake", 
          description: "Decadent dark Belgian cocoa cake with a hot flowing fudge core, dusted with confectioners sugar.", 
          price: "9.50", 
          dietaryTags: ["V"],
          imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
          isVeg: true,
          spiceLevel: 0,
          customizations: [
            { name: "Madagascar vanilla bean ice cream scoop", price: "2.00" },
            { name: "Warm raspberry syrup infusion", price: "1.25" }
          ]
        },
        { 
          id: "dessert_tiramisu", 
          name: "Classic Espresso Tiramisu", 
          description: "Savoiardi fingers soaked in dark roast espresso blend, layered with whipped velvety mascarpone, heavily dusted with raw cocoa.", 
          price: "8.50", 
          dietaryTags: ["V"],
          imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
          isVeg: true,
          spiceLevel: 0,
          customizations: [
            { name: "Double espresso liqueur drizzle", price: "1.50" }
          ]
        }
      ]
    },
    {
      id: "cat_drinks",
      name: "Drinks",
      items: [
        { 
          id: "drink_matcha", 
          name: "Organic Ceremonial Matcha Latte", 
          description: "Authentic stone-ground Kyoto matcha whisked and poured over ice with velvety organic almond milk.", 
          price: "5.50", 
          dietaryTags: ["V"],
          imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
          isVeg: true,
          spiceLevel: 0,
          customizations: [
            { name: "Organic honey sweeteners", price: "0.50" },
            { name: "Sub homemade oat milk", price: "0.75" }
          ]
        },
        { 
          id: "drink_rita", 
          name: "Chili Mango Mojito Mocktail", 
          description: "Fresh Alphonso mango nectar, fresh muddled island mint with wild lime juice, sparkling club soda, hot Tajin chili rim.", 
          price: "12.00", 
          dietaryTags: ["V"],
          imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
          isVeg: true,
          spiceLevel: 1,
          customizations: [
            { name: "Add double shots tequila", price: "5.00" }
          ]
        }
      ]
    }
  ],
  specials: [
    { name: "Pumpkin Spice Latte", description: "Seasonal favorite with real pumpkin purée.", price: "5.50", period: "Fall Season" },
  ],
  signatureDishes: [
    "Avocado Smash — Our most popular brunch item for 5 years running.",
    "House Blend Cold Brew — Steeped for exactly 12 hours for peak smoothness.",
  ],
  apiToken: "",
  defaultLanguage: "English",
  activeLanguages: ["English"],
  primaryColor: "#d2691e",
  fontFamily: "serif",
  logoIcon: "ChefHat",
  themePreset: "warm",
};

export interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

export type OrderStatus = "pending" | "baking" | "delivered" | "cancelled";

export interface Order {
  id: string;
  restaurantId: string;
  tableNumber: string;
  mobileNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
}

