import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Task } from "../types";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

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
      owner: "user-1", // Default owner is user-1
      createdBy: "user-1", // Default creator is user-1
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
