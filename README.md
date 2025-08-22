# 🤖 Chat-Agent

**Chat-Agent** is a customizable AI-powered customer support solution that enables businesses to deploy **personalized AI agents** for engaging with customers, managing leads, and driving growth.  

Powered by **Llama 3 (via Ollama)** and **ChromaDB**, Chat-Agent provides an intuitive interface with analytics, integrations, and a modular setup for real-world usage.  

---

## 🚀 Features

### 🔹 Agent Tabs
Each agent provides **7 powerful tabs**:

1. **Playground** – Configure settings & test your agent in real-time.  
2. **Activity** – View chat logs, feedback (👍👎😐), and captured leads.  
3. **Analytics** – Insights into total chats, tokens, sentiment breakdown, keywords & activity timeline.  
4. **Sources** – Train agents with files, text snippets, and Q&A pairs.  
5. **Actions** – Configure API calls, buttons, redirects, and lead collection forms.  
6. **Integrate** – Embed your chatbot via iFrame or script integration.  
7. **Settings** – Update agent preferences or delete agents.  

---

## 🛠️ Tech Stack

**Frontend**  
- ⚛️ React  
- 🎨 Radix UI + Tailwind CSS  

**Backend**  
- 🚀 Express.js  
- 🍃 MongoDB  
- 🔑 JWT Authentication  

**AI & Vector DB**  
- 🦙 Llama 3 (via [Ollama](https://ollama.com/))  
- 🗄️ ChromaDB (for embeddings & vector search)  

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
- PORT=3000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret


### Frontend (`frontend/.env`)
- VITE_API_BASE_URL=http://localhost:3000/api

---

## 📦 Installation & Setup

### 1️⃣ Clone Repository
- ```git clone https://github.com/your-username/chat-agent.git```
- ```cd chat-agent```


### 2️⃣ Setup Backend
- ```cd backend```
- ```npm install```

- Create `.env` file with backend variables.  

Start backend:
- ```npm run dev```


### 3️⃣ Setup Frontend
- ```cd frontend```
- ```npm install```

- Create `.env` file with frontend variable.  

Start frontend:
```npm run dev```

Frontend will be available at [http://localhost:5173](http://localhost:5173).

---

## 🦙 Running Llama 3 with Ollama

1. **Install Ollama** → [Download here](https://ollama.com/download).  
2. **Pull the model**:
```ollama pull llama3```

3. **Run the Ollama server**:
```ollama run llama3```

---

## 📊 Running ChromaDB

1. Install ChromaDB:
```pip install chromadb```

2. Start the ChromaDB server:
```chroma run --path ./chroma-data```


Embeddings will be stored in `./chroma-data`. Make sure backend is connected to the running ChromaDB instance.

---

## 🎯 Usage Workflow

1. **Sign up / Log in**  
2. **Create a new agent**  
3. Configure & test it in the **Playground**  
4. Add **Sources** (files / text / QnA) and retrain your agent  
5. Track conversations & leads via **Activity**  
6. Monitor performance with **Analytics**  
7. Extend functionality via **Actions**  
8. Embed chatbot on your website with **Integrate**  
9. Adjust preferences in **Settings**  

✨ With **Chat-Agent**, you can empower your users with smart, context-aware AI support directly on your website!  
