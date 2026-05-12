# u2022039 CloudLab Platform

![Node.js](https://img.shields.io/badge/Node.js-20.x-3c873a) ![Express](https://img.shields.io/badge/Express-5.x-black) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791) ![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3--management-ff6600) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ed) ![JWT](https://img.shields.io/badge/Auth-JWT-8a2be2)

Cloud-native university project upgraded for A-grade final submission, viva demo, and portfolio presentation.

## Features
- JWT-based authentication with bcrypt password hashing
- Event creation and retrieval APIs
- Async event publishing to RabbitMQ queue (`eventQueue`)
- Background consumer with JSON event log (`logs/events.json`)
- Live system monitor page (`/monitor.html`)
- Professional frontend dashboard (responsive + animated)
- Docker Compose stack with healthchecks and restart policies
- AWS deployment support (ECR + ECS templates)

## Architecture Diagram
```mermaid
flowchart LR
  U[Frontend UI] --> A[Express API]
  A --> P[(PostgreSQL)]
  A --> R[(RabbitMQ eventQueue)]
  R --> C[Consumer Service]
  C --> L[logs/events.json]
```

## Docker Architecture
```mermaid
flowchart TD
  APP[cloudlab_app]
  DB[cloudlab_postgres]
  MQ[cloudlab_rabbitmq]
  APP --> DB
  APP --> MQ
  MQ --> APP
```

## Project Structure
```text
u2022039_cloudlab/
├── config/              # DB and RabbitMQ config
├── controllers/         # API business logic
├── middleware/          # auth, logging, validation, async wrapper
├── routes/              # auth/events/status routes
├── services/            # publisher + consumer
├── public/              # frontend pages and assets
├── logs/                # consumed event logs
├── aws/                 # ECR/ECS deployment files
├── submission/          # final report material
├── docker-compose.yml
├── Dockerfile
├── server.js
└── README.md
```

## API Documentation (Quick)
- `GET /` -> Landing page
- `GET /status` -> Backend/DB/RabbitMQ status
- `POST /register` -> Register user
- `POST /login` -> Login user and return JWT
- `POST /events` -> Create event and publish queue message (JWT required)
- `GET /events` -> List all events

## Run Locally (Windows + Cursor + Docker Desktop)
```bash
docker compose up --build
```

Open:
- Frontend: [http://localhost:5000](http://localhost:5000)
- RabbitMQ dashboard: [http://localhost:15672](http://localhost:15672) (`guest` / `guest`)

## Screenshots Section
Add final screenshots to `submission/screenshots/`:
- Project structure
- Running containers
- Dashboard
- API monitor
- Register/login success
- Event creation and list
- RabbitMQ dashboard
- `logs/events.json`

## AWS Deployment
- ECR push script: `aws/deploy-ecr.ps1`
- ECS task template: `aws/ecs-task-definition-template.json`
- ECS commands: `aws/deploy-ecs-commands.md`

## Viva Highlights
- Why RabbitMQ? Decouples API writes from async event processing
- Why JWT? Stateless auth for scalable microservice-style APIs
- Why Docker Compose? Deterministic local cloud-like environment
- Why `/status`? Operational visibility and health diagnostics

## Troubleshooting
- If app starts before dependencies, retries in `server.js` handle it.
- If PowerShell blocks npm scripts, use Docker flow instead.
- If RabbitMQ dashboard not opening, ensure container is healthy and port `15672` is free.
