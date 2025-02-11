# Rubix Wallet API Curl Examples

## User Management

### Create User
```bash
curl -X POST http://localhost:8080/create -d '{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "secret_key": "optional_secret"
}'
```

### Login
```bash
curl -X POST http://localhost:8080/login -d '{
  "email": "user@example.com",
  "password": "password123"
}'
```

## Wallet Operations

### Create Wallet
```bash
curl -X POST http://localhost:8080/create_wallet \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{"port": 20009}'
```

### Get Balance
```bash
curl -X GET "http://localhost:8080/request_balance?did=YOUR_DID" \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Transfer RBT
```bash
curl -X POST http://localhost:8080/request_txn \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "did": "SENDER_DID",
    "receiver": "RECEIVER_DID",
    "rbt_amount": 1.0
  }'
```

## Fungible Token Operations

### Create FT
```bash
curl -X POST http://localhost:8080/create_ft \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "did": "YOUR_DID",
    "ft_name": "MyToken",
    "ft_count": 100,
    "token_count": 1
  }'
```

### Transfer FT
```bash
curl -X POST http://localhost:8080/transfer_ft \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "sender": "SENDER_DID",
    "receiver": "RECEIVER_DID",
    "ft_name": "MyToken",
    "ft_count": 10,
    "creatorDID": "CREATOR_DID",
    "quorum_type": 2
  }'
```

### List All FTs
```bash
curl -X GET "http://localhost:8080/get_all_ft?did=YOUR_DID" \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

## Using Variables

You can use variables in your curl commands for better reusability:

```bash
# Set your variables
TOKEN="your_jwt_token"
DID="your_did"
API_URL="http://localhost:8080"

# Use them in commands
curl -X GET "${API_URL}/request_balance?did=${DID}" \
  -H "Authorization: Bearer ${TOKEN}"
```