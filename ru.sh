#!/bin/bash

# Create a match
curl -X PUT http://localhost:3000/api/match/create \
  -H "Content-Type: application/json" \
  -d '{
    "scoreGoal": 5,
    "match_id": 555
  }'

# Initialize players
curl -X PUT http://localhost:3000/api/match/init-player \
  -H "Content-Type: application/json" \
  -d '{
      "player_name": "Alice",
      "user_id": 7,
      "is_ai": true,
      "isTraining": false
  }'

curl -X PUT http://localhost:3000/api/match/init-player \
  -H "Content-Type: application/json" \
  -d '{
      "player_name": "Bob",
      "user_id": 42,
      "is_ai": false,
      "isTraining": false
  }'

  curl -X PUT http://localhost:3000/api/match/init-player \
  -H "Content-Type: application/json" \
  -d '{
      "player_name": "Charlie",
      "user_id": 99,
      "is_ai": true,
      "isTraining": false
  }'

  curl -X PUT http://localhost:3000/api/match/init-player \
  -H "Content-Type: application/json" \
  -d '{
      "player_name": "Diana",
      "user_id": 101,
      "is_ai": false,
      "isTraining": false
  }'