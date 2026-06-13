# Deployment

This document describes a sample deployment workflow for NeuroCompute.

1. Build & Tag Docker Images

- Frontend
  - docker build -f docker/Dockerfile.frontend -t <registry>/neurocompute-frontend:latest ./
- Backend
  - docker build -f docker/Dockerfile.backend -t <registry>/neurocompute-backend:latest ./

2. Push to Registry

- docker push <registry>/neurocompute-frontend:latest
- docker push <registry>/neurocompute-backend:latest

3. Prepare Kubernetes Cluster

- Ensure the `neurocompute` namespace exists: kubectl apply -f kubernetes/namespace.yaml
- Create secrets for MONGO_URI and JWT_SECRET (example manifest in kubernetes/secret.yaml) or use external secret manager.

4. Apply Manifests

- kubectl apply -f kubernetes/configmap.yaml
- kubectl apply -f kubernetes/backend-deployment.yaml
- kubectl apply -f kubernetes/backend-service.yaml
- kubectl apply -f kubernetes/frontend-deployment.yaml
- kubectl apply -f kubernetes/frontend-service.yaml
- kubectl apply -f kubernetes/ingress.yaml

5. Post-deploy

- Verify pods: kubectl get pods -n neurocompute
- Verify services: kubectl get svc -n neurocompute
- Check ingress and DNS/TLS configuration

6. Rollback

- To rollback, update image tags in the deployment manifests and re-apply, or use kubectl rollout undo deployment/<name> -n neurocompute

Notes:
- Replace placeholders with real registry URLs and secret values before applying.
- TLS: configure an ingress controller and provide TLS secret (neuro-tls) or use cert-manager to provision certificates automatically.
