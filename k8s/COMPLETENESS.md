# Kubernetes Manifest Completeness Checklist

## ✅ Completed for Workout & Challenge Services

- [x] **ConfigMaps** - Environment variables configured
- [x] **Deployments** - Application deployments with:
  - [x] Resource limits and requests
  - [x] Health checks (liveness & readiness probes)
  - [x] Environment variable injection from ConfigMaps
  - [x] InitContainers for database migrations (Prisma)
- [x] **Services** - ClusterIP services for internal communication

## ⚠️ What's Missing (Dependencies)

These services depend on external resources that need to be deployed separately:

### Required Dependencies:
1. **PostgreSQL Databases**
   - `workout-db` service (for workout-service)
   - `challenge-db` service (for challenge-service)
   - Need: StatefulSet or Deployment + Service + PersistentVolumeClaim

2. **RabbitMQ**
   - `rabbitmq` service
   - Need: StatefulSet or Deployment + Service + PersistentVolumeClaim

### Optional but Recommended:
3. **Image Registry**
   - Update image references from `workout-service:latest` to your actual registry
   - Example: `registry.example.com/workout-service:v1.0.0`

4. **Secrets** (for production)
   - Database passwords should be in Secrets, not ConfigMaps
   - RabbitMQ credentials should be in Secrets

5. **Ingress** (for external access)
   - If you want to expose services outside the cluster

6. **Network Policies** (for security)
   - Control traffic between pods

7. **HorizontalPodAutoscaler** (for scaling)
   - Auto-scale based on CPU/memory usage

## Quick Start

### 1. Build and push images:
```bash
# Build images
docker build -t workout-service:latest ./services/workout-service
docker build -t challenge-service:latest ./services/challenge-service

# Tag for your registry (if using one)
docker tag workout-service:latest your-registry/workout-service:v1.0.0
docker tag challenge-service:latest your-registry/challenge-service:v1.0.0

# Push to registry
docker push your-registry/workout-service:v1.0.0
docker push your-registry/challenge-service:v1.0.0
```

### 2. Deploy dependencies first:
```bash
# Deploy PostgreSQL databases
# Deploy RabbitMQ
```

### 3. Apply ConfigMaps:
```bash
kubectl apply -f workout-service-configmap.yaml
kubectl apply -f challenge-service-configmap.yaml
```

### 4. Apply Deployments:
```bash
kubectl apply -f workout-service-deployment.yaml
kubectl apply -f challenge-service-deployment.yaml
```

### 5. Verify:
```bash
kubectl get pods -l app=workout-service
kubectl get pods -l app=challenge-service
kubectl get svc workout-service challenge-service
```

## Testing

```bash
# Port forward to test locally
kubectl port-forward svc/workout-service 3001:3001
kubectl port-forward svc/challenge-service 3002:3002

# Test endpoints
curl http://localhost:3001/health
curl http://localhost:3002/health
```

