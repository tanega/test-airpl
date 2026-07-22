# Indice ATMO

- `backend/` — API FastAPI + DuckDB
- `frontend/` — Vue 3, Vite, shadcn-vue, TanStack Table, Pinia

## Prérequis

- Python 3.12+ et [uv](https://docs.astral.sh/uv/)
- Node.js 22+ et npm

## Lancement du projet

### 1. Cloner le dépôt

```bash
git clone git@github.com:tanega/test-airpl.git
cd test-airpl
```

### 2. Backend

```bash
cd backend
cp .env.example .env
uv run fastapi dev main.py
```

L'API démarre sur http://localhost:8000 (documentation interactive sur `/docs`).

Le CSV source (`backend/data/`) est déjà présent dans le dépôt, aucune étape supplémentaire n'est nécessaire.

Variable d'environnement (`backend/.env`) :

| Variable        | Description                                          | Défaut                   |
| --------------- | ----------------------------------------------------- | ------------------------- |
| `ALLOW_ORIGINS` | Origines autorisées en CORS, séparées par des virgules | `http://localhost:5173`  |

### 3. Frontend

Dans un second terminal :

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Le site est accessible sur http://localhost:5173.

Variable d'environnement (`frontend/.env`) :

| Variable               | Description             | Défaut                  |
| ---------------------- | ------------------------ | ------------------------ |
| `VITE_API_BASE_URL`    | URL de base de l'API     | `http://localhost:8000` |

Le backend doit être démarré avant le frontend pour que les données s'affichent.
