import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("studio.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS pending_users (
    email TEXT PRIMARY KEY,
    password TEXT,
    name TEXT,
    otp TEXT,
    expires_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    description TEXT,
    video_url TEXT,
    audio_note TEXT,
    reference_link TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    sender_id INTEGER,
    sender_name TEXT,
    text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Routes
  app.post("/api/auth/register-request", (req, res) => {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // 10 mins

    try {
      db.prepare(`
        INSERT OR REPLACE INTO pending_users (email, password, name, otp, expires_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(email, password, name, otp, expiresAt);
      
      console.log(`[OTP Simulation] OTP for ${email} is: ${otp}`);
      res.json({ message: "OTP sent successfully", simulatedOtp: otp });
    } catch (e) {
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  app.post("/api/auth/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    
    const pending = db.prepare("SELECT * FROM pending_users WHERE email = ? AND otp = ?").get(email, otp);
    
    if (!pending) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date(pending.expires_at) < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    try {
      const stmt = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");
      const result = stmt.run(pending.email, pending.password, pending.name);
      
      // Clean up
      db.prepare("DELETE FROM pending_users WHERE email = ?").run(email);
      
      res.json({ id: result.lastInsertRowid, email: pending.email, name: pending.name });
    } catch (e) {
      res.status(400).json({ error: "User already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND password = ?").get(email.trim(), password);
    if (user) {
      res.json({ id: user.id, email: user.email, name: user.name });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Google OAuth Routes
  const getRedirectUri = (req: express.Request) => {
    if (process.env.APP_URL) {
      return `${process.env.APP_URL.replace(/\/$/, "")}/auth/google/callback`;
    }
    return `${req.protocol}://${req.get("host")}/auth/google/callback`;
  };

  app.get("/api/auth/google/url", (req, res) => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const redirect_uri = getRedirectUri(req);
    
    const options = {
      redirect_uri,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    const qs = new URLSearchParams(options);
    res.json({ url: `${rootUrl}?${qs.toString()}` });
  });

  app.get("/auth/google/callback", async (req, res) => {
    const code = req.query.code as string;
    const redirectUri = getRedirectUri(req);

    if (!code) {
      return res.status(400).send("No code provided");
    }

    try {
      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        console.error("Token Exchange Error:", tokenData);
        return res.status(500).send("Failed to exchange token");
      }

      const { access_token } = tokenData;

      // Get user info
      const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const googleUser = await userResponse.json();

      if (!googleUser.email) {
        return res.status(400).send("Google account has no email");
      }

      // Check if user exists, if not create
      let user = db.prepare("SELECT * FROM users WHERE email = ?").get(googleUser.email);
      
      if (!user) {
        const stmt = db.prepare("INSERT INTO users (email, name, password) VALUES (?, ?, ?)");
        const result = stmt.run(googleUser.email, googleUser.name || googleUser.email.split('@')[0], "google-auth-no-password");
        user = { id: result.lastInsertRowid, email: googleUser.email, name: googleUser.name || googleUser.email.split('@')[0] };
      }

      // Send success message to parent window and close popup
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS',
                  user: ${JSON.stringify({ id: user.id, email: user.email, name: user.name })}
                }, '*');
                window.close();
              } else {
                window.location.href = '/dashboard';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Google Auth Error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  // Project Routes
  app.get("/api/projects/:userId", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const { userId, title, description, videoUrl, audioNote, referenceLink } = req.body;
    const stmt = db.prepare("INSERT INTO projects (user_id, title, description, video_url, audio_note, reference_link) VALUES (?, ?, ?, ?, ?, ?)");
    const result = stmt.run(userId, title, description, videoUrl, audioNote, referenceLink);
    res.json({ id: result.lastInsertRowid, title, status: 'pending' });
  });

  // Message Routes
  app.get("/api/messages/:projectId", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages WHERE project_id = ? ORDER BY created_at ASC").all(req.params.projectId);
    res.json(messages);
  });

  app.post("/api/messages", (req, res) => {
    const { projectId, senderId, senderName, text } = req.body;
    const stmt = db.prepare("INSERT INTO messages (project_id, sender_id, sender_name, text) VALUES (?, ?, ?, ?)");
    const result = stmt.run(projectId, senderId, senderName, text);
    res.json({ id: result.lastInsertRowid, text, senderName, createdAt: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
