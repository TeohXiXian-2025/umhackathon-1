# 🧠 PeopleGraph

> **An On-Demand Skill-to-Revenue Orchestrator and AI Decision Engine for Malaysian SMEs**

PeopleGraph is a full-stack HR intelligence platform that maps workforce activities directly to revenue outcomes. It combines a Force-Directed Value Graph, predictive AI analytics, unstructured data ingestion, and Malaysian statutory compliance automation — all in one unified dashboard.

📹 **Pitch Video**: [Watch on Google Drive](https://drive.google.com/file/d/1GDIpl02ZSARlF4wh13Vv9ylmJIws4RLX/view?usp=drivesdk)

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🕸️ **Value Graph (Digital Twin)** | Force-directed D3.js visualization mapping human activities to revenue flows |
| 🤖 **Decision Intelligence** | Automated expansion, optimization & outsourcing blueprints from forensic data |
| 📥 **Unstructured Data Ingestion** | Analyzes WhatsApp logs, sales CSVs, and payroll PDFs — no manual KPI entry |
| 📈 **AI Predictive Analytics** | Ensemble forecasting for hiring impact and 30-day revenue projections |
| 💬 **NLP & Sentiment Analysis** | YTL AI Labs ILMU-GLM-5.1 integration for employee feedback and SaaS onboarding |
| 🏖️ **Cuti Peristiwa Shock Simulation** | Models public holiday operational risk and warehouse SLA disruption |
| 📊 **Real-Time Dashboard** | Attendance heatmaps, team energy metrics, and HR KPIs at a glance |
| ⚖️ **Statutory Compliance** | Automated EPF / SOCSO / EIS / PCB calculations with strict Malaysian law enforcement |
| 💡 **Strategic Insight Panel** | Dual-mode Hiring ROI & EA1955 Severance Risk calculator |

---

## 🏗️ Project Structure

```
umhackathon-1/
├── backend/                    # FastAPI application (Python)
│   ├── app/
│   │   ├── main.py             # App entry point, CORS, router mounting
│   │   ├── config.py           # Environment & settings
│   │   ├── database.py         # Async SQLAlchemy engine
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── routers/            # API route handlers
│   │   │   ├── employees.py
│   │   │   ├── compliance.py
│   │   │   ├── dashboard.py
│   │   │   └── ai_analytics.py
│   │   ├── services/           # Business logic layer
│   │   └── schemas/            # Pydantic request/response schemas
│   ├── seed.py                 # Demo data seeder
│   ├── seed_attendance.py      # Attendance seeder
│   ├── seed_from_json.py       # JSON-based seeder
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                   # Next.js application (TypeScript)
│   ├── app/                    # App Router pages
│   │   └── components/         # Reusable React components
│   │       ├── StrategicInsightPanel.js
│   │       └── StatutoryView.js
│   ├── lib/                    # Utility functions
│   ├── public/                 # Static assets
│   └── Dockerfile
├── src/                        # Utility & standalone scripts
├── Data PreprocessingV2/       # Latest data processing pipeline
├── Data_PreprocessingV1/       # Legacy data processing scripts
├── Documentation/              # Architecture and design docs
├── deploy/                     # Deployment configurations
├── docker-compose.yml          # Local development Docker setup
├── docker-compose.prod.yml     # Production Docker setup
└── requirements.txt            # Root-level Python dependencies
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|---|---|
| Python | 3.10+ |
| Node.js | 18+ |
| npm / yarn | Latest |
| PostgreSQL | 14+ (with `pgvector` extension) |

---

### 🐍 Backend Setup

```bash
cd backend

# 1. Create & activate virtual environment
python -m venv .venv
.venv\Scripts\Activate          # Windows
# source .venv/bin/activate     # Linux / Mac

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment — create backend/.env
```

**`backend/.env`** (minimum required):
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/peoplegraph
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

```bash
# 4. Create the database
psql -U postgres -c "CREATE DATABASE peoplegraph;"

# 5. Run migrations
alembic upgrade head

# 6. (Optional) Seed demo data
python seed.py

# 7. Start backend server
uvicorn app.main:app --reload --port 8000
```

---

### ⚛️ Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Build for production:**
```bash
npm run build
npm start
```

---

### 🐳 Docker (Recommended)

```bash
# Start all services locally
docker compose up --build

# Production
docker compose -f docker-compose.prod.yml up --build
```

---

## 📡 API Documentation

Once the backend is running, visit:

| Interface | URL |
|---|---|
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Health Check | http://localhost:8000/health |

### API Endpoints Overview

| Router | Prefix | Description |
|---|---|---|
| Employees | `/api/v1/employees` | CRUD for employee records |
| Compliance | `/api/v1/compliance` | EPF / SOCSO / EIS / PCB calculations |
| Dashboard | `/api/v1/dashboard` | Attendance, sentiment, and KPI data |
| AI Analytics | `/api/v1/ai` | Predictive models and simulations |

### 🏖️ Cuti Peristiwa Shock Simulation

Simulate the financial impact of a sudden public holiday on peak-demand operations:

**`POST /api/v1/ai/simulate-cuti-peristiwa`**

```json
{
  "max_daily_demand_units": 18000,
  "daily_capacity_units": 12000,
  "logistics_staff_count": 8,
  "ordinary_rate_of_pay_rm": 115.38,
  "profit_per_item_rm": 5,
  "post_holiday_surge_percent": 0.2
}
```

Returns a comparison of statutory Public Holiday wage penalty vs. estimated SLA impact from warehouse shutdown.

---

## 🛠️ Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** — Async REST API framework
- **SQLAlchemy (async)** — ORM with async support
- **SQLite / PostgreSQL** — Development & production databases
- **scikit-learn** — Ensemble forecasting models
- **pandas** — Data processing and aggregation
- **Alembic** — Database migrations

### Frontend
- **[Next.js 16](https://nextjs.org/)** — React framework with App Router
- **React 19** — UI component library
- **[D3.js](https://d3js.org/)** — Force-directed graph visualizations
- **Tailwind CSS 4** — Utility-first styling
- **TypeScript** — Type-safe development

### Infrastructure
- **Docker & Docker Compose** — Containerized deployment
- **CORS Middleware** — Secure cross-origin API access

---

## 🌐 Deployment

See [`DEPLOY_PROD.md`](./DEPLOY_PROD.md) for full production deployment instructions.

---

## 👥 Team

Built for **UM Hackathon 2025** — University of Malaya.

Repository: [TeohXiXian-2025/umhackathon-1](https://github.com/TeohXiXian-2025/umhackathon-1)
