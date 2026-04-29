# LABIA: Longitudinal Academic Behavior & Integrity Analytics

LABIA is a next-generation academic integrity platform designed to protect institutional reputation through deep forensic analysis of linguistic drift and behavioral anomalies. By leveraging advanced Natural Language Processing (NLP) and longitudinal tracking, LABIA establishes a unique "writing fingerprint" for every student to detect academic misconduct before it happens.

---

## 🚀 Key Features

- **AI Forensics Engine**: Utilizes **spaCy** and **NLTK** to analyze lexical diversity, sentence structure, and Part-of-Speech (POS) patterns.
- **Longitudinal Tracking**: Establishes a historical baseline for each student and flags submissions that radically deviate from their past work.
- **Interactive Dashboards**: 
  - **Student Portal**: Securely submit assignments and view submission history.
  - **Faculty Analysis Lab**: Real-time monitoring of incoming submissions with deep-dive radar charts and trend analysis.
  - **Admin Global Analytics**: Executive oversight with risk heatmaps and cross-departmental statistics.
- **AI Chatbot Assistant**: A live, MySQL-connected chatbot that provides real-time statistics about students, faculty, and submissions.
- **Glassmorphism UI**: A futuristic, high-performance interface built with React, Tailwind CSS, and Framer Motion.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (Custom Uranium-Green Theme)
- **Animations**: Framer Motion
- **Visualization**: Chart.js / react-chartjs-2
- **Icons**: Lucide-React

### Backend
- **Framework**: Python (Flask)
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MySQL (Hosted on Aiven Cloud)
- **ORM**: SQLAlchemy

### AI/NLP
- **NLTK**: Tokenization and lexical metrics.
- **spaCy**: Part-of-Speech tagging and syntactic diversity analysis.

---

## 📂 Project Structure

```text
labia-system/         # React Frontend
├── src/
│   ├── components/   # Reusable UI components (Sidebar, Chatbot, etc.)
│   ├── pages/        # Main views (Landing, Dashboards)
│   └── App.jsx       # Routing and State Management
└── tailwind.config.js # Custom design tokens

labia-backend/        # Flask Backend
├── app.py            # Main entry point & Blueprint registration
├── models.py         # SQLAlchemy Database Models
├── analyzer.py       # Core NLP Forensic Engine (NLTK/spaCy)
└── routes/           # Decoupled API controllers (Student, Faculty, Admin, Chat)
```

---

## ⚙️ Setup & Installation

### 1. Backend Setup
```bash
cd labia-backend
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Configure environment variables (.env)
# DATABASE_URI=mysql+pymysql://user:pass@host:port/db?ssl_ca=ca.pem
# JWT_SECRET_KEY=your_secret_key

# Run the server
python app.py
```

### 2. Frontend Setup
```bash
cd labia-system
npm install
npm run dev
```

---

## 🔒 Security & RBAC
LABIA implements strict **Role-Based Access Control (RBAC)**:
- **Admin**: Oversees the entire institution.
- **Faculty**: Manages specific courses and analyzes individual student submissions.
- **Student**: Can only access their own submission portal and history.

---

## 📜 Demo Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@labia.edu | admin123 |
| **Faculty** | alan@labia.edu | fac123 |
| **Student** | student1@labia.edu | stud123 |

---

## 🛡️ License
Proprietary System - Developed for Advanced Academic Integrity Monitoring.
