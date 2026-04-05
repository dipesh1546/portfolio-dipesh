/**
 * Contact API — sends portfolio form submissions to your Gmail via SMTP.
 * Set variables in .env (see .env.example). Never commit .env.
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const rootDir = path.join(__dirname, "..");

/**
 * Merge env files into process.env. Always overwrites keys from the file so
 * empty GMAIL_* vars from the shell/IDE cannot block values in .env.
 * Strips UTF-8 BOM so keys are not read as "\ufeffGMAIL_USER".
 */
function loadEnvFiles() {
  const paths = [
    path.join(rootDir, ".env"),
    path.join(rootDir, ".env.local"),
    path.join(__dirname, ".env"),
  ];
  const loadedFrom = [];
  for (const p of paths) {
    if (!fs.existsSync(p)) continue;
    let buf = fs.readFileSync(p);
    if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
      buf = buf.subarray(3);
    }
    const parsed = dotenv.parse(buf.toString("utf8"));
    Object.assign(process.env, parsed);
    loadedFrom.push(p);
  }
  if (loadedFrom.length === 0) {
    console.warn(
      "[contact-api] No env file found. Create one of:\n" +
        `  ${path.join(rootDir, ".env")}   (recommended — same folder as package.json)\n` +
        `  ${path.join(rootDir, ".env.local")}\n` +
        `  ${path.join(__dirname, ".env")}\n` +
        "Copy .env.example → .env and set GMAIL_USER and GMAIL_APP_PASSWORD."
    );
  } else {
    console.log("[contact-api] Env loaded from:", loadedFrom.join(" → "));
  }
}
loadEnvFiles();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");

// Railway/Render/etc. set PORT. Locally use CONTACT_API_PORT (avoid clashing with CRA dev PORT).
const PORT = Number(process.env.PORT || process.env.CONTACT_API_PORT) || 5001;
const app = express();

app.set("trust proxy", 1);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    methods: ["POST", "OPTIONS", "GET"],
    maxAge: 86400,
  })
);
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: { error: "Too many messages. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let transporter;
function getTransporter() {
  if (transporter) return transporter;
  const user = (process.env.GMAIL_USER || "").trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
  if (!user || !pass) {
    throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD in environment");
  }
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // IMPORTANT for Railway
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false, // prevents SSL issues
    },
  });
}

app.post(
  "/api/contact",
  contactLimiter,
  [
    body("name").trim().isLength({ min: 1, max: 120 }).withMessage("Invalid name"),
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("message").trim().isLength({ min: 1, max: 5000 }).withMessage("Invalid message"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Invalid input",
          details: errors.array({ onlyFirstError: true }).map((e) => e.msg),
        });
      }

      const hp = req.body._hp;
      if (hp && String(hp).trim() !== "") {
        return res.status(400).json({ error: "Invalid request" });
      }

      const name = req.body.name;
      const email = req.body.email;
      const message = req.body.message;
      const notifyTo = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER;

      const transport = getTransporter();
      const fromAddr = process.env.MAIL_FROM || `"Portfolio" <${process.env.GMAIL_USER}>`;

      await transport.sendMail({
        from: fromAddr,
        to: notifyTo,
        replyTo: email,
        subject: `[Portfolio] Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<hr />
<pre style="font-family:sans-serif;white-space:pre-wrap;">${escapeHtml(message)}</pre>`,
      });

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Contact mail error:", err.message);
      const payload = { error: "Could not send message. Try again later." };
      if (process.env.NODE_ENV !== "production" && err.message) {
        payload.hint = err.message;
      }
      return res.status(500).json(payload);
    }
  }
);

const hasGmailUser = !!(process.env.GMAIL_USER || "").trim();
const hasGmailPass = !!(process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
if (!hasGmailUser || !hasGmailPass) {
  console.warn(
    `[contact-api] Gmail env incomplete — GMAIL_USER: ${hasGmailUser ? "ok" : "MISSING"}, ` +
      `GMAIL_APP_PASSWORD: ${hasGmailPass ? "ok" : "MISSING"}. ` +
      "Names must match .env.example exactly (no quotes needed). Restart after saving .env."
  );
}

const buildIndex = path.join(rootDir, "build", "index.html");
const serveProdSite =
  process.env.NODE_ENV === "production" && fs.existsSync(buildIndex);

if (serveProdSite) {
  app.use(express.static(path.join(rootDir, "build")));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(buildIndex);
  });
} else {
  app.get("/", (_req, res) => {
    res.type("html").send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><title>Portfolio contact API</title></head>
<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:2rem auto;padding:0 1rem;">
  <h1>Contact API</h1>
  <p>This is the backend for the portfolio contact form only. It does not serve the website.</p>
  <p>Open your app at <a href="http://localhost:3000">http://localhost:3000</a> (with <code>npm start</code> or <code>npm run dev</code>).</p>
  <p>Checks: <a href="/api/health"><code>GET /api/health</code></a> · form posts to <code>POST /api/contact</code></p>
</body></html>`);
  });
  app.use((req, res) => {
    res.status(404).type("html").send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><title>404</title></head>
<body style="font-family:system-ui,sans-serif;margin:2rem;">
  <h1>404 — Not found</h1>
  <p>Path <code>${escapeHtml(req.path)}</code> is not served by this API.</p>
  <p><a href="/">Home</a> · <a href="/api/health">Health</a></p>
</body></html>`);
  });
}

const server = app.listen(PORT, () => {
  const mode = serveProdSite ? "production (React + API)" : "dev API only";
  console.log(`[contact-api] ${mode} — http://localhost:${PORT}`);
});
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use (another \`npm run server\` or \`npm run dev\`?).\n` +
        `Free it:  lsof -i :${PORT}   then   kill <PID>\n` +
        `Or use another port:  CONTACT_API_PORT=5002 npm run server`
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});
