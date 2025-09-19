# ✨ Build or Bounce - Your AI Co-Founder

**Build or Bounce (BoB)** is a full-stack SaaS application designed to act as your AI-powered co-founder.  
It takes a startup idea from a simple concept to a validated, branded, and deployable MVP in minutes.

The platform guides users through a structured workflow, leveraging multiple AI models to automate the most time-consuming parts of launching a new venture — from market research to brand identity and website creation.

---

## 🚀 Core Features

- **🤖 AI-Powered Idea Validation**  
  Submit your startup idea and get a VC-style validation report with a **"Build" or "Bounce" verdict**, generated via market research and LLM reasoning.

- **🧠 Mission & Vision Cross-Questioner**  
  A guided Q&A flow helps define your **mission, vision, and unique value proposition**.

- **🌐 Intelligent Domain Naming**  
  AI brainstorms brandable names and checks real-time domain availability, with fallback suggestions.

- **🎨 Premium Brand Identity Generation**  
  - **Logo:** Multiple professional SVG logo concepts via Google Gemini.  
  - **Branding:** AI-generated color palette & font pairings.  
  - **Business Card:** Pixel-perfect, print-ready PDFs via Puppeteer.

- **💻 “Sexy” AI Website Generation**  
  A complete, single-page, responsive landing page built with your brand assets and stock photos from Pexels.

- **💬 Personalized AI Business Coach**  
  Each project includes a **chatbot powered by RAG**, tailored to your idea and project data.

- **🔒 Full SaaS Account System**  
  Secure registration, JWT-based login, password management, and user dashboards.

- **🔑 User-Provided API Keys**  
  Users can securely store their own encrypted keys (OpenAI, Gemini, Pexels) to control usage quotas.

---

## 🛠️ Tech Stack

| Area       | Technology / Service |
|------------|-----------------------|
| Backend    | Node.js, Express.js, Mongoose |
| Frontend   | React (Vite), lucide-react |
| Database   | MongoDB (Atlas) |
| AI Models  | OpenAI (GPT-4o, GPT-4o-mini), Google Gemini |
| Services   | Pexels API, Puppeteer |
| Auth       | JSON Web Tokens (JWT), bcrypt.js |

---

## 📦 Prerequisites

Before starting, ensure you have:

- **Node.js** v18+  
- **npm** or **yarn**  
- **Git**

You’ll also need API keys for:

- [MongoDB Atlas](https://www.mongodb.com/atlas)  
- [OpenAI](https://platform.openai.com/)  
- [Google AI Studio](https://ai.google.dev/)  
- [Pexels](https://www.pexels.com/api/)  

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd build-or-bounce
```

### 2. Backend Setup (`/server`)
```bash
cd server
npm install
```

Create `.env` in `/server`:
```env
# --- Server & Database ---
PORT=5001
MONGODB_URI="your_mongodb_atlas_connection_string_here"

# --- Authentication ---
JWT_SECRET="your_super_long_and_random_jwt_secret_string"
ENCRYPTION_SECRET="your_super_long_and_random_encryption_secret_for_api_keys"

# --- System API Keys (Fallbacks) ---
OPENAI_API_KEY="sk-..."
GOOGLE_API_KEY="..."
PEXELS_API_KEY="..."
TAVILY_API_KEY="tvly-..."
```

### 3. Frontend Setup (`/client`)
```bash
cd client
npm install
```

Create `.env` in `/client`:
```env
# Backend base URL
VITE_API_BASE_URL=http://localhost:5001
```

### 4. Run the Application

Run **backend**:
```bash
cd server
npm run dev
```
Your backend API will run on: `http://localhost:5001`

Run **frontend**:
```bash
cd client
npm run dev
```
Your frontend app will run on: `http://localhost:5173`

---

## 📂 Project Structure

```
.
├── client/         # Frontend React App (Vite)
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── .env        # Frontend environment variables
│
└── server/         # Backend Node.js App (Express)
    ├── controllers/  # Request/response logic
    ├── middleware/   # Auth protection
    ├── models/       # Mongoose schemas
    ├── routes/       # API endpoints
    ├── services/     # Business logic & AI calls
    ├── templates/    # HTML templates (e.g., business card)
    ├── utils/        # Helpers (encryption, etc.)
    └── .env          # Backend environment variables
```

---

## ✨ Future Enhancements

- **Stripe Integration** → Subscription plans for commercial SaaS.  
- **Pitch Deck Generator** → Auto-generate pitch decks (PDF).  
- **One-Click Deployment** → Vercel/Netlify integration for hosting.  
- **Collaboration** → Invite team members to projects.  
