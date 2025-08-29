# Kubernetes Deployment Guide for Marriage Hall Application

## Prerequisites Installation

### 1. Install kubectl
```bash
# Download from: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
# Or use Chocolatey:
choco install kubernetes-cli
```

### 2. Install Minikube
```bash
# Download from: https://minikube.sigs.k8s.io/docs/start/
# Or use Chocolatey:
choco install minikube
```

### 3. Verify Installation
```bash
kubectl version --client
minikube version
```

## Step-by-Step Deployment

### Step 1: Start Minikube
```bash
minikube start --driver=docker --memory=4096 --cpus=2
```

### Step 2: Build Docker Images

#### Build Backend Image
```bash
cd "C:\Users\Sai kiran\Downloads\marriagehall\marriagehall"
docker build -t marriagehall-backend:latest .
```

#### Build Frontend Image
```bash
cd "C:\Users\Sai kiran\Desktop\angularfrontendWipro\marriage-hall-frontend"
docker build -f Dockerfile.frontend -t marriagehall-frontend:latest .
```

### Step 3: Load Images into Minikube
```bash
minikube image load marriagehall-backend:latest
minikube image load marriagehall-frontend:latest
```

### Step 4: Create Namespace
```bash
kubectl apply -f k8s-namespace.yaml
```

### Step 5: Deploy MySQL
```bash
kubectl apply -f k8s-mysql-deployment.yaml -n marriagehall
```

### Step 6: Wait for MySQL to be Ready
```bash
kubectl wait --for=condition=ready pod -l app=mysql -n marriagehall --timeout=300s
```

### Step 7: Deploy Backend
```bash
kubectl apply -f k8s-backend-deployment.yaml -n marriagehall
```

### Step 8: Deploy Frontend
```bash
kubectl apply -f k8s-frontend-deployment.yaml -n marriagehall
```

### Step 9: Deploy Ingress
```bash
kubectl apply -f k8s-ingress.yaml -n marriagehall
```

### Step 10: Enable Ingress Addon
```bash
minikube addons enable ingress
```

### Step 11: Wait for All Pods to be Ready
```bash
kubectl wait --for=condition=ready pod -l app=marriagehall-backend -n marriagehall --timeout=300s
kubectl wait --for=condition=ready pod -l app=marriagehall-frontend -n marriagehall --timeout=300s
```

## Verification Commands

### Check Pod Status
```bash
kubectl get pods -n marriagehall
```

### Check Services
```bash
kubectl get services -n marriagehall
```

### Check Deployments
```bash
kubectl get deployments -n marriagehall
```

### View Logs
```bash
# Backend logs
kubectl logs -f deployment/marriagehall-backend-deployment -n marriagehall

# Frontend logs
kubectl logs -f deployment/marriagehall-frontend-deployment -n marriagehall

# MySQL logs
kubectl logs -f deployment/mysql-deployment -n marriagehall
```

## Accessing the Application

### Method 1: NodePort Services
- Frontend: http://localhost:30080
- Backend API: http://localhost:30083

### Method 2: Minikube IP
```bash
minikube ip
```
Then access:
- Frontend: http://<minikube-ip>:30080
- Backend API: http://<minikube-ip>:30083

### Method 3: Minikube Service
```bash
minikube service marriagehall-frontend-service -n marriagehall
minikube service marriagehall-backend-service -n marriagehall
```

## Minikube Dashboard
```bash
minikube dashboard
```

## Troubleshooting

### Check Pod Status
```bash
kubectl describe pod <pod-name> -n marriagehall
```

### Check Events
```bash
kubectl get events -n marriagehall --sort-by='.lastTimestamp'
```

### Restart Deployment
```bash
kubectl rollout restart deployment/marriagehall-backend-deployment -n marriagehall
kubectl rollout restart deployment/marriagehall-frontend-deployment -n marriagehall
```

### Delete and Redeploy
```bash
kubectl delete namespace marriagehall
kubectl apply -f k8s-namespace.yaml
# Then repeat deployment steps
```

## Cleanup
```bash
# Stop Minikube
minikube stop

# Delete Minikube cluster
minikube delete

# Remove Docker images
docker rmi marriagehall-backend:latest
docker rmi marriagehall-frontend:latest
```

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     MySQL       │
│   (Angular)     │    │  (Spring Boot)  │    │   Database      │
│   Port: 30080   │◄──►│   Port: 30083   │◄──►│   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Kubernetes    │
                    │   Cluster       │
                    │  (Minikube)     │
                    └─────────────────┘
```

## Key Features

1. **High Availability**: 2 replicas each for frontend and backend
2. **Health Checks**: Liveness and readiness probes
3. **Resource Limits**: CPU and memory constraints
4. **Persistent Storage**: MySQL data persistence
5. **Load Balancing**: Kubernetes service load balancing
6. **Scaling**: Easy horizontal scaling with kubectl scale
7. **Monitoring**: Built-in Kubernetes monitoring


