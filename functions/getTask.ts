import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const taskId = event.pathParameters?.id;

    if (!taskId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing task ID" }),
      };
    }

    const result = await dynamodb
      .get({
        TableName: process.env.TASKS_TABLE!,
        Key: { id: taskId },
      })
      .promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Task not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
