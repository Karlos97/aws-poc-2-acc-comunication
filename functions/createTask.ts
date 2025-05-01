import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamodb = new AWS.DynamoDB.DocumentClient();

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody = JSON.parse(event.body || "{}");
    const taskId = uuidv4();

    const task: Task = {
      id: taskId,
      title: requestBody.title,
      description: requestBody.description,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Store in DynamoDB
    await dynamodb
      .put({
        TableName: process.env.TASKS_TABLE!,
        Item: task,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(task),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
