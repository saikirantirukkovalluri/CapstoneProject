@echo off
echo ========================================
echo Marriage Hall Application - K8s Deployment
echo ========================================

echo.
echo Step 1: Starting Minikube...
minikube start --driver=docker --memory=4096 --cpus=2

echo.
echo Step 2: Building Docker images...
echo Building backend image...
cd "C:\Users\Sai kiran\Downloads\marriagehall\marriagehall"
docker build -t marriagehall-backend:latest .

echo Building frontend image...
cd "C:\Users\Sai kiran\Desktop\angularfrontendWipro\marriage-hall-frontend"
docker build -t marriagehall-frontend:latest .

echo.
echo Step 3: Loading images into Minikube...
minikube image load marriagehall-backend:latest
minikube image load marriagehall-frontend:latest

echo.
echo Step 4: Creating namespace...
kubectl apply -f k8s-namespace.yaml

echo.
echo Step 5: Deploying MySQL...
kubectl apply -f k8s-mysql-deployment.yaml -n marriagehall

echo.
echo Step 6: Waiting for MySQL to be ready...
kubectl wait --for=condition=ready pod -l app=mysql -n marriagehall --timeout=300s

echo.
echo Step 7: Deploying Backend...
kubectl apply -f k8s-backend-deployment.yaml -n marriagehall

echo.
echo Step 8: Deploying Frontend...
kubectl apply -f k8s-frontend-deployment.yaml -n marriagehall

echo.
echo Step 9: Deploying Ingress...
kubectl apply -f k8s-ingress.yaml -n marriagehall

echo.
echo Step 10: Enabling Ingress addon...
minikube addons enable ingress

echo.
echo Step 11: Waiting for all pods to be ready...
kubectl wait --for=condition=ready pod -l app=marriagehall-backend -n marriagehall --timeout=300s
kubectl wait --for=condition=ready pod -l app=marriagehall-frontend -n marriagehall --timeout=300s

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Services:
echo - Frontend: http://localhost:30080
echo - Backend API: http://localhost:30083
echo.
echo To check status:
echo kubectl get pods -n marriagehall
echo kubectl get services -n marriagehall
echo.
echo To view logs:
echo kubectl logs -f deployment/marriagehall-backend-deployment -n marriagehall
echo kubectl logs -f deployment/marriagehall-frontend-deployment -n marriagehall
echo.
echo To access Minikube dashboard:
echo minikube dashboard
echo.
pause


