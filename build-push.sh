#!/bin/bash

# Define registry and platform
REGISTRY="harbor.javajon.duckdns.org/library"
PLATFORM="linux/amd64"

echo "==============================================="
echo "Building and Pushing All Services to $REGISTRY"
echo "==============================================="

# Helper function to build and push
build_and_push() {
    SERVICE_NAME=$1
    DIR_PATH=$2
    IMAGE="$REGISTRY/found-$SERVICE_NAME:v1.0"
    
    # Build v1.4 for ai-coach-service to force update
    if [ "$SERVICE_NAME" == "ai-coach-service" ]; then
        IMAGE="$REGISTRY/found-$SERVICE_NAME:v1.4"
    fi

    echo "Processing $SERVICE_NAME..."
    docker build --platform $PLATFORM -t $IMAGE $DIR_PATH
    docker push $IMAGE
    echo "-----------------------------------------------"
}

# Backend Services
build_and_push "auth-service" "./services/auth-service"
build_and_push "user-service" "./services/user-service"
build_and_push "workout-service" "./services/workout-service"
build_and_push "challenge-service" "./services/challenge-service"
build_and_push "data-consistency-service" "./services/data-consistency-service"
build_and_push "leaderboard-service" "./services/leaderboard-service"
build_and_push "ai-coach-service" "./services/ai-coach-service"

# Frontend
build_and_push "frontend" "./fitness-app-react-ui"

echo "==============================================="
echo "Restarting Deployments in Kubernetes"
echo "==============================================="

kubectl rollout restart deployment/auth-service -n found-fitness-app
kubectl rollout restart deployment/user-service -n found-fitness-app
kubectl rollout restart deployment/workout-service -n found-fitness-app
kubectl rollout restart deployment/challenge-service -n found-fitness-app
kubectl rollout restart deployment/data-consistency-service -n found-fitness-app
kubectl rollout restart deployment/leaderboard-service -n found-fitness-app
kubectl rollout restart deployment/ai-coach-service -n found-fitness-app
kubectl rollout restart deployment/frontend -n found-fitness-app

echo "==============================================="
echo "Deployment Update Complete!"
echo "==============================================="
