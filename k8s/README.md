# Kubernetes Configuration

This directory contains Kubernetes manifests for the fitness tracker services.

## ConfigMaps

ConfigMaps store environment variables and configuration data:

- `workout-service-configmap.yaml` - Configuration for workout-service
- `challenge-service-configmap.yaml` - Configuration for challenge-service

## Usage

### Apply ConfigMaps

```bash
# Apply workout service ConfigMap
kubectl apply -f workout-service-configmap.yaml

# Apply challenge service ConfigMap
kubectl apply -f challenge-service-configmap.yaml
```

### Apply Deployments (which use the ConfigMaps)

```bash
# Apply workout service deployment
kubectl apply -f workout-service-deployment.yaml

# Apply challenge service deployment
kubectl apply -f challenge-service-deployment.yaml
```

### View ConfigMaps

```bash
# View workout service ConfigMap
kubectl get configmap workout-service-config -o yaml

# View challenge service ConfigMap
kubectl get configmap challenge-service-config -o yaml
```

### Edit ConfigMaps

```bash
# Edit workout service ConfigMap
kubectl edit configmap workout-service-config

# Edit challenge service ConfigMap
kubectl edit configmap challenge-service-config
```

After editing, restart the pods to pick up changes:

```bash
kubectl rollout restart deployment/workout-service
kubectl rollout restart deployment/challenge-service
```

### Alternative: Using envFrom with specific keys

If you want to use only specific keys from the ConfigMap, you can use `env` instead of `envFrom`:

```yaml
env:
- name: DATABASE_URL
  valueFrom:
    configMapKeyRef:
      name: workout-service-config
      key: DATABASE_URL
- name: RABBITMQ_URL
  valueFrom:
    configMapKeyRef:
      name: workout-service-config
      key: RABBITMQ_URL
```

## Environment Variables

### Workout Service ConfigMap
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Service port (default: 3001)
- `NODE_ENV` - Environment (production/development)
- `RABBITMQ_URL` - RabbitMQ connection string

### Challenge Service ConfigMap
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Service port (default: 3002)
- `NODE_ENV` - Environment (production/development)
- `RABBITMQ_URL` - RabbitMQ connection string

## Secrets

For production, sensitive data like database passwords and RabbitMQ credentials should be stored in Kubernetes Secrets instead of ConfigMaps:

```bash
# Create secret for database credentials
kubectl create secret generic db-credentials \
  --from-literal=db-password=your-secure-password \
  --from-literal=db-user=postgres

# Create secret for RabbitMQ credentials
kubectl create secret generic rabbitmq-credentials \
  --from-literal=rabbitmq-user=guest \
  --from-literal=rabbitmq-password=guest
```

Then reference them in your ConfigMap or Deployment:

```yaml
env:
- name: DATABASE_URL
  value: "postgresql://$(DB_USER):$(DB_PASSWORD)@workout-db:5432/fitness_tracker_workouts"
- name: DB_USER
  valueFrom:
    secretKeyRef:
      name: db-credentials
      key: db-user
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-credentials
      key: db-password
```

