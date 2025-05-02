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

### User-1 Endpoints

- POST /tasks - Create a new task
- GET /tasks/{id} - Get a task by ID
- PUT /tasks/{id} - Update a task by ID

### User-2 Endpoints

- POST /user2/tasks/random - Create 10 random tasks for user-1
- GET /user2/tasks - Get all tasks for user-1
- DELETE /user2/tasks - Delete all tasks for user-1

## Multi-Account Setup

This application demonstrates communication between two AWS accounts:

- **User-1 Account**: The primary account that owns the tasks
- **User-2 Account**: A secondary account that can create, view, and delete tasks on user-1's account

### Architecture

- DynamoDB is used to store task data
- SQS queues are used for communication between accounts
- Task creation notifications are processed asynchronously

## Project Structure

```
/functions
  /user1            # User-1 specific functions
    - createTask.ts
    - getTask.ts
    - updateTask.ts
  /user2            # User-2 specific functions
    - createRandomTasks.ts
    - getAllTasks.ts
    - deleteAllTasks.ts
    - notifyTaskCreation.ts
  - types.ts        # Shared types
```
