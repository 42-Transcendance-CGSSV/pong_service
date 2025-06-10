#!/bin/bash



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
      "player_name": "gabriel",
      "user_id": 1014,
      "is_ai": false,
      "isTraining": false
  }'

    curl -X PUT http://localhost:3000/api/match/init-player \
  -H "Content-Type: application/json" \
  -d '{
      "player_name": "yuri",
      "user_id": 1042,
      "is_ai": false,
      "isTraining": false
  }'

      curl -X PUT http://localhost:3000/api/match/init-player \
  -H "Content-Type: application/json" \
  -d '{
      "player_name": "yummy",
      "user_id": 2042,
      "is_ai": false,
      "isTraining": false
  }'

      curl -X PUT http://localhost:3000/api/match/init-player \
  -H "Content-Type: application/json" \
  -d '{
      "player_name": "marc",
      "user_id": 2242,
      "is_ai": false,
      "isTraining": false
  }'

        curl -X PUT http://localhost:3000/api/match/init-player \
  -H "Content-Type: application/json" \
  -d '{
      "player_name": "marcus",
      "user_id": 2742,
      "is_ai": false,
      "isTraining": false
  }'