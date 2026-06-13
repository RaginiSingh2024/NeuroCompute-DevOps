# Architecture

NeuroCompute is composed of:

- React frontend served by Nginx
- Express backend exposing REST APIs
- MongoDB Atlas for persistence
- Authentication via JWT
- CI/CD pipeline via Jenkins
- Containerization using Docker
- Kubernetes for orchestration
- Monitoring with Prometheus + Grafana
- Centralized logging with ELK
- Secrets management with Vault

Components:
- Frontend <-> Backend via /api
- Backend <-> MongoDB
- Ingress routes external traffic to frontend and backend
