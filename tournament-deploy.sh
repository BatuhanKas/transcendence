#!/bin/bash

cd ~/project/drafts/bkas/transcendence/tournament
sleep 1

docker build . -t tournament-service
sleep 10

cd ~/project
docker compose -f docker-compose.tournament.yml down
sleep 5
docker compose -f docker-compose.tournament.yml up -d
sleep 5

docker ps -a | grep 'tournament-service'
echo "Tournament service deployment completed."