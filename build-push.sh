#!/bin/bash

docker build --platform linux/amd64 -t harbor.javajon.duckdns.org/library/found-workout-service:v1.0 ./services/workout-service

docker build --platform linux/amd64 -t harbor.javajon.duckdns.org/library/found-challenge-service:v1.0 ./services/challenge-service

docker build --platform linux/amd64 -t harbor.javajon.duckdns.org/library/found-data-consistency-service:v1.0 ./services/data-consistency-service

docker push harbor.javajon.duckdns.org/library/found-workout-service:v1.0

docker push harbor.javajon.duckdns.org/library/found-challenge-service:v1.0

docker push harbor.javajon.duckdns.org/library/found-data-consistency-service:v1.0


# New images if you can push for us.
docker build -t harbor.javajon.duckdns.org/library/found-auth-service:v1.0 ./services/auth-service 
docker push harbor.javajon.duckdns.org/library/found-auth-service:v1.0 

docker build -t harbor.javajon.duckdns.org/library/found-user-service:v1.0 ./services/user-service 
docker push harbor.javajon.duckdns.org/library/found-user-service:v1.0


