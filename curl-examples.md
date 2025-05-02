# API Endpoints Curl Examples

## User-1 Endpoints

### Create Task (POST /tasks)

```bash
curl -X POST \
  https://<aws_hash>.execute-api.eu-central-1.amazonaws.com/dev/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Sample Task",
    "description": "This is a sample task created by user-1"
  }'
```

### Get Task (GET /tasks/{id})

```bash
curl -X GET \
  https://<aws_hash>.execute-api.eu-central-1.amazonaws.com/dev/tasks/TASK_ID_HERE
```

### Update Task (PUT /tasks/{id})

```bash
curl -X PUT \
  https://<aws_hash>.execute-api.eu-central-1.amazonaws.com/dev/tasks/TASK_ID_HERE \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Updated Task Title",
    "description": "This task has been updated",
    "status": "completed"
  }'
```

## User-2 Endpoints

### Create Random Tasks (POST /user2/tasks/random)

```bash
curl -X POST \
  https://<aws_hash>.execute-api.eu-central-1.amazonaws.com/dev/user2/tasks/random
```

### Get All Tasks (GET /user2/tasks)

```bash
curl -X GET \
  https://<aws_hash>.execute-api.eu-central-1.amazonaws.com/dev/user2/tasks
```

### Delete All Tasks (DELETE /user2/tasks)

```bash
curl -X DELETE \
  https://<aws_hash>.execute-api.eu-central-1.amazonaws.com/dev/user2/tasks
```
