import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { loadDatabase, saveDatabase } from "./server-db";
import { DEFAULT_CONFIG } from "./src/types";

dotenv.config();

const app = express();
app.use(express.json());

// Debugging & path correction middleware for Vercel and serverless environments
app.use((req, res, next) => {
  // If Vercel rewrote req.url but preserved the original URL path in headers or other fields
  const originalUrl = req.originalUrl || req.url;
  console.log(`[HTTP Request] ${req.method} ${req.url} (originalUrl: ${originalUrl})`);
  
  // Handshake to ensure Vercel routed Express app matches the original /api route structure
  next();
});

  // API routes FIRST
  app.post("/api/chat", async (req, res) => {
    const { message, history, systemInstruction, restaurantId, language } = req.body;

    let apiKey = process.env.GEMINI_API_KEY;
    let isOpenRouter = false;

    // Check if we have a restaurant specific API token
    if (restaurantId) {
      try {
        const db = loadDatabase();
        const resto = db.restaurants[restaurantId];
        if (resto && resto.apiToken && resto.apiToken.trim() !== "") {
          const customKey = resto.apiToken.trim();
          if (customKey.startsWith("sk-")) {
            apiKey = customKey;
            isOpenRouter = true;
          } else {
            apiKey = customKey;
          }
        }
      } catch (err) {
        console.error("Error checking restaurant API token:", err);
      }
    }

    if (!apiKey) {
      if (process.env.OPENROUTER_API_KEY) {
        apiKey = process.env.OPENROUTER_API_KEY;
        isOpenRouter = true;
      }
    }

    if (!apiKey) {
      console.error("No API key configured for chat.");
      return res.status(500).json({ error: "AI Service API Key is not configured." });
    }

    let finalSystemInstruction = systemInstruction;
    if (language) {
      finalSystemInstruction += `\n\n## LANGUAGE DIRECTIVE\n- The user's preferred language is: ${language}.\n- YOU MUST RESPOND SOLELE AND EXCLUSIVELY IN ${language.toUpperCase()}.\n- Regardless of your default prompt settings or previous dialogue language, output all statements in ${language}. Keep the conversation friendly, helpful, natural, and fully localized to native speaker conventions in ${language}.`;
    }

    // 1. If using OpenRouter fallback
    if (isOpenRouter) {
      const host = req.headers.host || "localhost:3000";
      const protocol = req.protocol || (host.includes("localhost") ? "http" : "https");
      const referer = process.env.APP_URL || `${protocol}://${host}`;

      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        defaultHeaders: {
          "HTTP-Referer": referer,
          "X-Title": "RestoHost AI",
        }
      });

      try {
        const response = await openai.chat.completions.create({
          model: "openrouter/free",
          messages: [
            { role: "system", content: finalSystemInstruction },
            ...(history || []),
            { role: "user", content: message },
          ],
          stream: true,
          max_tokens: 2048,
          temperature: 0.7,
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");

        const heartbeatInterval = setInterval(() => {
          if (!res.writableEnded) {
            res.write(": heartbeat\n\n");
            if ((res as any).flush) (res as any).flush();
          }
        }, 10000);

        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
              if ((res as any).flush) (res as any).flush();
            }
          }
          res.write("data: [DONE]\n\n");
        } finally {
          clearInterval(heartbeatInterval);
        }
      } catch (error: any) {
        console.error("OpenRouter API Error:", error);
        const errorMessage = error.message || "Failed to fetch response from AI";
        if (!res.headersSent) {
          res.status(500).json({ error: errorMessage });
        } else {
          res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        }
      } finally {
        res.end();
      }
      return;
    }

    // 2. Default: Native Gemini API Streaming (using @google/genai)
    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const geminiContents = (history || []).map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content || "" }]
      }));
      geminiContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents: geminiContents,
        config: {
          systemInstruction: finalSystemInstruction,
          temperature: 0.7,
        }
      });

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      const heartbeatInterval = setInterval(() => {
        if (!res.writableEnded) {
          res.write(": heartbeat\n\n");
          if ((res as any).flush) (res as any).flush();
        }
      }, 10000);

      try {
        for await (const chunk of responseStream) {
          const content = chunk.text || "";
          if (content) {
            res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            if ((res as any).flush) (res as any).flush();
          }
        }
        res.write("data: [DONE]\n\n");
      } finally {
        clearInterval(heartbeatInterval);
      }
    } catch (error: any) {
      console.error("Gemini API Error in chat:", error);
      const errorMessage = error.message || "Failed to fetch response from Gemini";
      if (!res.headersSent) {
        res.status(500).json({ error: errorMessage });
      } else {
        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      }
    } finally {
      res.end();
    }
  });

  // Dynamic config translation endpoint
  app.post("/api/translate-config", async (req, res) => {
    try {
      const { config, targetLanguage, restaurantId } = req.body;
      if (!config || !targetLanguage) {
        return res.status(400).json({ error: "Missing config or targetLanguage" });
      }

      let apiKey = process.env.GEMINI_API_KEY;
      let isOpenRouter = false;

      if (restaurantId) {
        try {
          const db = loadDatabase();
          const resto = db.restaurants[restaurantId];
          if (resto && resto.config && resto.apiToken && resto.apiToken.trim() !== "") {
            const customKey = resto.apiToken.trim();
            if (customKey.startsWith("sk-")) {
              apiKey = customKey;
              isOpenRouter = true;
            } else {
              apiKey = customKey;
            }
          }
        } catch (err) {
          console.error("Error checking token for translate-config:", err);
        }
      }

      if (!apiKey) {
        if (process.env.OPENROUTER_API_KEY) {
          apiKey = process.env.OPENROUTER_API_KEY;
          isOpenRouter = true;
        }
      }

      if (!apiKey) {
        console.error("No API key configured for translation.");
        return res.status(500).json({ error: "AI Service API Key is not configured." });
      }

      const fieldsToTranslate = {
        restaurantType: config.restaurantType || "",
        reservations: config.reservations || "",
        reservationMethod: config.reservationMethod || "",
        parking: config.parking || "",
        seating: config.seating || "",
        petFriendly: config.petFriendly || "",
        menu: (config.menu || []).map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          items: (cat.items || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price
          }))
        })),
        specials: (config.specials || []).map((spec: any) => ({
          name: spec.name,
          description: spec.description,
          price: spec.price,
          period: spec.period
        })),
        signatureDishes: config.signatureDishes || []
      };

      const prompt = `You are a highly professional restaurant translator. Translate the following restaurant properties and menu JSON into fluent, native, culturally natural ${targetLanguage}.
Keep all categories, items, prices, and IDs matching their structure exactly. Do not translate the actual IDs (like "cat1", "i1").
Translate all user-facing names, descriptions, and terms elegantly (e.g. translating category names like "Coffee & Drinks" or "Brunch Mains", ingredients, coffee details, price range, hours notes, pet friendly terms, wifi details).
Return the translated object in the exact same JSON format. Produce NO explanation, NO introduction, NO markdown blocks. Return ONLY the raw JSON.

JSON to translate:
${JSON.stringify(fieldsToTranslate, null, 2)}`;

      let content = "";

      if (isOpenRouter) {
        const host = req.headers.host || "localhost:3000";
        const protocol = req.protocol || (host.includes("localhost") ? "http" : "https");
        const referer = process.env.APP_URL || `${protocol}://${host}`;

        const openai = new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: apiKey,
          defaultHeaders: {
            "HTTP-Referer": referer,
            "X-Title": "RestoHost AI Translate",
          }
        });

        const response = await openai.chat.completions.create({
          model: "openrouter/free",
          messages: [
            { role: "system", content: "You output only raw, valid, minified JSON without markdown formatting." },
            { role: "user", content: prompt }
          ],
          max_tokens: 3000,
          temperature: 0.1,
        });

        content = response.choices[0]?.message?.content || "";
      } else {
        const ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are a highly professional restaurant translator JSON mode. Output only the requested JSON without any surrounding markdown code blocks (no ```json).",
            responseMimeType: "application/json",
            temperature: 0.1,
          }
        });

        content = response.text || "";
      }

      content = content.trim();
      
      // Normalize JSON block if model still formats with markdown
      if (content.startsWith("```")) {
        content = content.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "").trim();
      }

      const translatedData = JSON.parse(content);
      res.json({ translated: translatedData });
    } catch (err: any) {
      console.error("Translation api error:", err);
      // If AI translation fails, fallback to empty translated object or similar gracefully
      res.status(500).json({ error: err.message || "Failed to translate configuration" });
    }
  });

  // Load and init DB endpoint
  app.post("/api/init", (req, res) => {
    try {
      const db = loadDatabase();
      const list = Object.entries(db.restaurants).map(([id, data]) => ({
        id,
        restaurantName: data.config.restaurantName,
        agentName: data.config.agentName,
        restaurantType: data.config.restaurantType,
      }));
      res.json({ 
        restaurants: list,
        globalTimeZone: db.globalTimeZone || "UTC",
        globalLanguages: db.globalLanguages || ["English", "Spanish", "French"]
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get individual restaurant public config
  app.get("/api/restaurant/:id", (req, res) => {
    try {
      const { id } = req.params;
      const db = loadDatabase();
      const resto = db.restaurants[id];
      if (!resto) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      // Send safe copy of configuration (masking apiToken)
      const safeConfig = { ...resto.config };
      delete safeConfig.apiToken;
      res.json({ 
        id, 
        config: safeConfig, 
        globalLanguages: db.globalLanguages || ["English", "Spanish", "French"],
        globalTimeZone: db.globalTimeZone || "UTC"
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      // Check Superadmin
      const db = loadDatabase();
      const activeSuperadminPassword = db.superadminPassword || "superadmin123";
      if (username === "superadmin" && password === activeSuperadminPassword) {
        return res.json({
          success: true,
          role: "superadmin",
          restaurantId: "",
          globalTimeZone: db.globalTimeZone || "UTC",
          globalLanguages: db.globalLanguages || ["English", "Spanish", "French"]
        });
      }

      // Check Admins
      const admin = db.admins.find(
        (a) => a.username.toLowerCase() === username.toLowerCase() && a.passwordHash === password
      );

      if (admin) {
        const resto = db.restaurants[admin.restaurantId];
        return res.json({
          success: true,
          role: "admin",
          username: admin.username,
          restaurantId: admin.restaurantId,
          config: resto ? resto.config : null,
          apiToken: "", // Securely hide API key from non-superadmin clients
        });
      }

      return res.status(401).json({ error: "Invalid username or password" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Save Restaurant Config / Admin Settings
  app.post("/api/admin/save-config", (req, res) => {
    try {
      const { restaurantId, config, apiToken, password, username, originalUsername } = req.body;
      if (!restaurantId || !config) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const db = loadDatabase();
      const resto = db.restaurants[restaurantId];
      if (!resto) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      // Update config & apiToken
      resto.config = config;
      if (apiToken !== undefined) {
        resto.apiToken = apiToken;
      }

      // Optional password / username update
      if (originalUsername) {
        const adminIndex = db.admins.findIndex(
          (a) => a.username.toLowerCase() === originalUsername.toLowerCase()
        );
        if (adminIndex !== -1) {
          if (username && username.toLowerCase() !== originalUsername.toLowerCase()) {
            // Check if new username is already taken
            const exists = db.admins.some(
              (a) => a.username.toLowerCase() === username.toLowerCase()
            );
            if (exists) {
              return res.status(400).json({ error: "Username already taken" });
            }
            db.admins[adminIndex].username = username;
          }
          if (password) {
            db.admins[adminIndex].passwordHash = password;
          }
          // Update restaurantName in admin summary
          db.admins[adminIndex].restaurantName = config.restaurantName;
        }
      }

      saveDatabase(db);
      res.json({ success: true, config: resto.config, apiToken: "" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // LIST admins for Superadmin view
  app.post("/api/superadmin/list-admins", (req, res) => {
    try {
      const { superadminPassword } = req.body;
      const db = loadDatabase();
      const actualSuperadminPassword = db.superadminPassword || "superadmin123";
      if (superadminPassword !== actualSuperadminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const list = db.admins.map((a) => {
        const resto = db.restaurants[a.restaurantId];
        return {
          id: a.id,
          username: a.username,
          password: a.passwordHash,
          restaurantId: a.restaurantId,
          restaurantName: a.restaurantName,
          hasApiToken: !!(resto && resto.apiToken && resto.apiToken.trim() !== ""),
          apiToken: resto ? resto.apiToken : "",
        };
      });

      res.json({ 
        admins: list,
        globalTimeZone: db.globalTimeZone || "UTC",
        globalLanguages: db.globalLanguages || ["English", "Spanish", "French"]
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // CREATE an admin (Superadmin)
  app.post("/api/superadmin/create-admin", (req, res) => {
    try {
      const { superadminPassword, username, password, restaurantName, apiToken } = req.body;
      const db = loadDatabase();
      const actualSuperadminPassword = db.superadminPassword || "superadmin123";
      if (superadminPassword !== actualSuperadminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!username || !password || !restaurantName) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check conflict
      if (
        username.toLowerCase() === "superadmin" ||
        db.admins.some((a) => a.username.toLowerCase() === username.toLowerCase())
      ) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const newRestoId = "resto-" + Math.random().toString(36).substring(2, 11);
      const newAdminId = "admin-" + Math.random().toString(36).substring(2, 11);

      // Prepare default config with custom restaurantName
      const customConfig = {
        ...DEFAULT_CONFIG,
        restaurantName: restaurantName,
        agentName: "Concierge",
      };

      // Save
      db.admins.push({
        id: newAdminId,
        username: username,
        passwordHash: password,
        restaurantId: newRestoId,
        restaurantName: restaurantName,
      });

      db.restaurants[newRestoId] = {
        id: newRestoId,
        config: customConfig,
        apiToken: apiToken || "",
      };

      saveDatabase(db);
      res.json({ success: true, adminId: newAdminId, restaurantId: newRestoId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE an Admin's data (Superadmin)
  app.post("/api/superadmin/update-admin", (req, res) => {
    try {
      const { superadminPassword, adminId, username, password, restaurantName, apiToken } = req.body;
      const db = loadDatabase();
      const actualSuperadminPassword = db.superadminPassword || "superadmin123";
      if (superadminPassword !== actualSuperadminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const admin = db.admins.find((a) => a.id === adminId);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      if (username) {
        const usernameConflict = db.admins.some(
          (a) => a.id !== adminId && a.username.toLowerCase() === username.toLowerCase()
        );
        if (usernameConflict || username.toLowerCase() === "superadmin") {
          return res.status(400).json({ error: "Username is already taken" });
        }
        admin.username = username;
      }

      if (password) {
        admin.passwordHash = password;
      }

      if (restaurantName) {
        admin.restaurantName = restaurantName;
        const resto = db.restaurants[admin.restaurantId];
        if (resto) {
          resto.config.restaurantName = restaurantName;
        }
      }

      if (apiToken !== undefined) {
        const resto = db.restaurants[admin.restaurantId];
        if (resto) {
          resto.apiToken = apiToken;
        }
      }

      saveDatabase(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE superadmin password (Superadmin)
  app.post("/api/superadmin/update-password", (req, res) => {
    try {
      const { superadminPassword, newPassword } = req.body;
      const db = loadDatabase();
      const actualSuperadminPassword = db.superadminPassword || "superadmin123";
      if (superadminPassword !== actualSuperadminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!newPassword || newPassword.trim().length === 0) {
        return res.status(400).json({ error: "New password is required" });
      }

      db.superadminPassword = newPassword;
      saveDatabase(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE global settings (Superadmin)
  app.post("/api/superadmin/update-global-settings", (req, res) => {
    try {
      const { superadminPassword, timeZone, languages } = req.body;
      const db = loadDatabase();
      const actualSuperadminPassword = db.superadminPassword || "superadmin123";
      if (superadminPassword !== actualSuperadminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (timeZone) {
        db.globalTimeZone = timeZone;
      }
      if (languages && Array.isArray(languages)) {
        db.globalLanguages = languages;
      }

      saveDatabase(db);
      res.json({ 
        success: true, 
        globalTimeZone: db.globalTimeZone, 
        globalLanguages: db.globalLanguages 
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE an admin (Superadmin)
  app.post("/api/superadmin/delete-admin", (req, res) => {
    try {
      const { superadminPassword, adminId } = req.body;
      const db = loadDatabase();
      const actualSuperadminPassword = db.superadminPassword || "superadmin123";
      if (superadminPassword !== actualSuperadminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!adminId) {
        return res.status(400).json({ error: "Admin ID is required" });
      }

      const adminIndex = db.admins.findIndex((a) => a.id === adminId);
      if (adminIndex === -1) {
        return res.status(404).json({ error: "Admin not found" });
      }

      const deleted = db.admins.splice(adminIndex, 1)[0];
      // Delete associated restaurant config
      if (deleted.restaurantId) {
        delete db.restaurants[deleted.restaurantId];
      }

      saveDatabase(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET orders for a specific restaurant
  app.get("/api/orders/:restaurantId", (req, res) => {
    try {
      const { restaurantId } = req.params;
      const db = loadDatabase();
      const restaurantOrders = (db.orders || [])
        .filter((o) => o.restaurantId === restaurantId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json({ success: true, orders: restaurantOrders });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // PLACE/POST order
  app.post("/api/orders", (req, res) => {
    try {
      const { restaurantId, tableNumber, mobileNumber, items, totalPrice } = req.body;
      if (!restaurantId || !tableNumber || !mobileNumber || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Missing required order details" });
      }

      const db = loadDatabase();
      
      const newOrder = {
        id: "order-" + Math.random().toString(36).substring(2, 11),
        restaurantId,
        tableNumber: String(tableNumber),
        mobileNumber: String(mobileNumber),
        items,
        status: "pending" as const,
        totalPrice: Number(totalPrice || 0),
        createdAt: new Date().toISOString()
      };

      if (!db.orders) {
        db.orders = [];
      }
      db.orders.push(newOrder);
      saveDatabase(db);

      res.json({ success: true, order: newOrder });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // TRACK orders by mobile number and restaurant id
  app.post("/api/orders/track", (req, res) => {
    try {
      const { restaurantId, mobileNumber } = req.body;
      if (!restaurantId || !mobileNumber) {
        return res.status(400).json({ error: "Restaurant ID and mobile number are required" });
      }

      const db = loadDatabase();
      const cleanInput = String(mobileNumber).replace(/\D/g, "");
      
      const matchedOrders = (db.orders || [])
        .filter((o) => o.restaurantId === restaurantId && String(o.mobileNumber).replace(/\D/g, "") === cleanInput)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      res.json({ success: true, orders: matchedOrders });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE order status
  app.post("/api/orders/update-status", (req, res) => {
    try {
      const { orderId, status } = req.body;
      if (!orderId || !status) {
        return res.status(400).json({ error: "Order ID and status are required" });
      }

      const db = loadDatabase();
      if (!db.orders) db.orders = [];

      const orderIndex = db.orders.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) {
        return res.status(404).json({ error: "Order not found" });
      }

      db.orders[orderIndex].status = status;
      saveDatabase(db);

      res.json({ success: true, order: db.orders[orderIndex] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Setup Vite & standalone listener conditionally
  if (process.env.NODE_ENV !== "production") {
    createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    }).then((vite) => {
      app.use(vite.middlewares);
      const PORT = 3000;
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    }).catch((err) => {
      console.error("Failed to start Vite dev server:", err);
    });
  } else {
    // Standard standalone server (e.g. for non-Vercel deployments)
    if (!process.env.VERCEL) {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });

      const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Standalone production server running on port ${PORT}`);
      });
    }
  }

export default app;
