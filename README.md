# AWS Serverless PoC

A proof of concept using:

- Serverless Framework
- AWS DynamoDB
- AWS SQS
- AWS Step Functions
- TypeScript

## Setup

1. Install dependencies:

```bash
npm install
```

2. Deploy to AWS:

```bash
npm run deploy
```

3. Local development:

```bash
npm run dev
```

## API Endpoints

- POST /tasks - Create a new task
- GET /tasks/{id} - Get a task by ID
