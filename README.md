# Online Merkato

E-commerce platform with NestJS backend and Next.js frontend.

## Prerequisites

- **Node.js** v18+ (v20 recommended)
- **npm** v9+
- **PostgreSQL** 14+

### Installing Dependencies

<details>
<summary><b>If you don't have Node.js & npm</b></summary>

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install -y nodejs npm
```

**macOS (Homebrew):**
```bash
brew install node
```

**Windows:** Download from https://nodejs.org (v20 LTS)

Verify:
```bash
node --version   # should be v18+
npm --version    # should be 9+
```
</details>

<details>
<summary><b>If you don't have PostgreSQL</b></summary>

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Windows:** Download from https://www.postgresql.org/download/

Create the database:
```bash
sudo -u postgres createdb online_merkato
```
</details>

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/ADVFINALPROJ2/online_merkato-.git
cd online_merkato-

# Install all dependencies (root + backend + frontend)
npm run install:all
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your database URL and secrets

# Frontend (defaults to localhost:5000, usually fine as-is)
cp frontend/.env.local frontend/.env.local
```

### 3. Set Up Database

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
cd ..
```

### 4. Run the App

```bash
# Run both backend and frontend concurrently
npm run dev
```

- **Backend:** http://localhost:5000/api
- **Frontend:** http://localhost:3000

### Run Individually

```bash
npm run backend:dev   # NestJS on :5000
npm run frontend:dev  # Next.js on :3000
```

## Project Structure

```
online_merkato-/
├── backend/          # NestJS API
│   ├── src/          # Source modules
│   ├── prisma/       # Database schema & migrations
│   ├── package.json
│   └── tsconfig.json
├── frontend/         # Next.js app
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
└── package.json      # Root scripts
```
