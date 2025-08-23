#!/bin/bash

cd ~/project/drafts/bkas/transcendence/auth
sleep 1

docker build . -t auth-service
sleep 10

cd ~/project
docker compose -f docker-compose.auth.yml down
sleep 5
docker compose -f docker-compose.auth.yml up -d
sleep 5

docker ps -a | grep 'auth-service'
echo "Auth service deployment completed."