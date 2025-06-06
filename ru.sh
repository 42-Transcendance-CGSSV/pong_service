#!/bin/bash

# Create a match
curl -X PUT http://localhost:3000/api/match/create

# Initialize players
curl -X PUT http://localhost:3000/api/match/init-players \
  -H "Content-Type: application/json" \
  -d '{
    "match_id": 555,
    "player_1": {
      "player_name": "Alice",
      "user_id": 7,
      "is_ai": true,
      "isTraining": true
    },
    "player_2": {
      "player_name": "Bob",
      "user_id": 42,
      "is_ai": false,
      "isTraining": false
    }
  }'