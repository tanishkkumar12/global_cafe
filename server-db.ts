import fs from "fs";
import path from "path";
import { RestaurantConfig, DEFAULT_CONFIG, Order } from "./src/types";

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string; // Stored simply for this app structure
  restaurantId: string;
  restaurantName: string;
}

export interface RestaurantData {
  id: string;
  config: RestaurantConfig;
  apiToken: string;
}

export interface DatabaseSchema {
  admins: AdminUser[];
  restaurants: { [id: string]: RestaurantData };
  superadminPassword?: string;
  globalTimeZone?: string;
  globalLanguages?: string[];
  orders?: Order[];
}

const DB_FILE_PATH = path.join(process.cwd(), "db.json");

function getInitialDatabase(): DatabaseSchema {
  const defaultRestoId = "resto-roasted-bean";
  return {
    admins: [
      {
        id: "admin-roasted-bean",
        username: "roastedbean",
        passwordHash: "password123", // Default credentials
        restaurantId: defaultRestoId,
        restaurantName: "The Roasted Bean"
      }
    ],
    restaurants: {
      [defaultRestoId]: {
        id: defaultRestoId,
        config: DEFAULT_CONFIG,
        apiToken: "" // Empty initially to fall back to environment variable if desired
      }
    },
    superadminPassword: "superadmin123",
    globalTimeZone: "UTC",
    globalLanguages: ["English", "Spanish", "French"],
    orders: []
  };
}

export function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const db = JSON.parse(content);
      // Ensure structure is correct
      if (!db.admins || !db.restaurants) {
        return getInitialDatabase();
      }
      if (!db.superadminPassword) {
        db.superadminPassword = "superadmin123";
      }
      if (!db.globalTimeZone) {
        db.globalTimeZone = "UTC";
      }
      if (!db.globalLanguages) {
        db.globalLanguages = ["English", "Spanish", "French"];
      }
      if (!db.orders) {
        db.orders = [];
      }
      return db;
    }
  } catch (error) {
    console.error("Error reading database file, using fallback:", error);
  }

  
  // Write initial database
  const initial = getInitialDatabase();
  saveDatabase(initial);
  return initial;
}

export function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database file:", error);
  }
}
