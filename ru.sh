#!/bin/bash

# Create a match
curl -X PUT http://localhost:3000/api/match/create

# Initialize players
curl -X PUT http://localhost:3000/api/match/init-players \
  -H "Content-Type: application/json" \
  -d '{
    "match_id": 0,
    "player_1": {
      "player_name": "Alice",
      "user_id": 123,
      "is_ai": false
    },
    "player_2": {
      "player_name": "Bob",
      "user_id": 456,
      "is_ai": false
    }
  }'