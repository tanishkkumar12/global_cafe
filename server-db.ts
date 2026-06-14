import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
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

let DB_FILE_PATH = path.join(process.cwd(), "db.json");

// Find the file name and directory path in a manner compatible with ES Modules
let currentDirname = "";
try {
  currentDirname = path.dirname(fileURLToPath(import.meta.url));
} catch (e) {
  // Fallback in case of environments where import.meta.url is not defined
}

// Locate the bundled db.json template
const possiblePaths = [
  path.join(process.cwd(), "db.json"),
];
if (currentDirname) {
  possiblePaths.push(path.resolve(path.join(currentDirname, "db.json")));
  possiblePaths.push(path.resolve(path.join(currentDirname, "..", "db.json")));
}

let sourceDbPath = "";
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    sourceDbPath = p;
    break;
  }
}

// If on Vercel or under serverless conditions, copy db.json to a writable location (/tmp/db.json)
if (process.env.VERCEL || process.env.NOW_REGION || process.env.AWS_EXECUTION_ENV) {
  const tmpPath = "/tmp/db.json";
  try {
    if (!fs.existsSync(tmpPath)) {
      if (sourceDbPath) {
        fs.copyFileSync(sourceDbPath, tmpPath);
        console.log(`[DB Setup] Copied database template from ${sourceDbPath} to writable path ${tmpPath}`);
      } else {
        // Create an empty initial db
        const initial = getInitialDatabase();
        fs.writeFileSync(tmpPath, JSON.stringify(initial, null, 2), "utf-8");
        console.log(`[DB Setup] Created new initial database in writable path ${tmpPath}`);
      }
    } else {
      console.log(`[DB Setup] Using existing writable database cloned in ${tmpPath}`);
    }
    DB_FILE_PATH = tmpPath;
  } catch (err) {
    console.error(`[DB Setup] Error setting up writable database in /tmp:`, err);
    if (sourceDbPath) {
      DB_FILE_PATH = sourceDbPath;
    }
  }
} else {
  if (sourceDbPath) {
    DB_FILE_PATH = sourceDbPath;
  }
  console.log(`[DB Setup] SQLite-equivalent JSON Database File Path resolved to: ${DB_FILE_PATH}`);
}

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
        console.warn(`Database schema invalid in ${DB_FILE_PATH}, loading fallback.`);
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
      console.log(`Database loaded successfully from ${DB_FILE_PATH}. Admins count: ${db.admins.length}, Restaurants count: ${Object.keys(db.restaurants).length}`);
      return db;
    } else {
      console.log(`Database file does not exist at ${DB_FILE_PATH}. Creating and loading initial database.`);
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
