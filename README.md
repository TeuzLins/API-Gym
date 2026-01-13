# GymTrack

Sistema full-stack para gestão de academias e treinos, com autenticação JWT, controle por perfis (ADMIN, TRAINER, STUDENT) e módulos para exercícios, alunos, planos e progresso.

## Stack

**Backend**
- Node.js + TypeScript + Express
- Prisma + PostgreSQL
- Autenticação JWT + Refresh Token com rotação
- Validação com Zod
- bcrypt para hash de senha

**Frontend**
- React + TypeScript + Vite
- React Router
- Axios com interceptor para refresh automático

## Requisitos
- Node.js 18+
- PostgreSQL 14+

## Como rodar o backend

```bash
cd server
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

### Variáveis de ambiente (backend)

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gymtrack
JWT_SECRET=supersecret
REFRESH_SECRET=superrefresh
JWT_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### Comandos Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Como rodar o frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

### Variáveis de ambiente (frontend)

```
VITE_API_URL=http://localhost:3001/api
```

## Fluxo de autenticação
- Access token expira em 15 minutos.
- Refresh token expira em 7 dias.
- Refresh token é armazenado em cookie httpOnly para reduzir exposição a XSS.
- A cada refresh um novo refresh token é emitido e o anterior é revogado (rotação).

## Principais rotas da API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Users (ADMIN)
- `GET /api/users`
- `PATCH /api/users/:id`

### Exercises (ADMIN/TRAINER)
- `GET /api/exercises`
- `POST /api/exercises`
- `PATCH /api/exercises/:id`
- `DELETE /api/exercises/:id`

### Students (ADMIN/TRAINER)
- `GET /api/students`
- `GET /api/students/:id`
- `POST /api/students`
- `PATCH /api/students/:id`
- `DELETE /api/students/:id`

### Workout Plans
- `GET /api/plans`
- `GET /api/plans/:id`
- `POST /api/plans`
- `PATCH /api/plans/:id`
- `DELETE /api/plans/:id`

### Workout Days/Items
- `POST /api/plans/:planId/days`
- `PATCH /api/plans/days/:dayId`
- `DELETE /api/plans/days/:dayId`
- `POST /api/plans/days/:dayId/items`
- `PATCH /api/plans/items/:itemId`
- `DELETE /api/plans/items/:itemId`

### Progress
- `GET /api/progress`
- `POST /api/progress`
- `DELETE /api/progress/:id`

## Seed
O seed cria um usuário ADMIN e alguns exercícios iniciais:
- Email: `admin@gymtrack.com`
- Senha: `Admin@123`

## Observações
- As mensagens e documentação estão em português.
- Caso opte por armazenar o refresh token em localStorage, há risco de XSS; por isso este projeto usa cookie httpOnly.
