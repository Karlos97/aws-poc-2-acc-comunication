import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const taskId = event.pathParameters?.id;
    const requestBody = JSON.parse(event.body || "{}");

    if (!taskId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing task ID" }),
      };
    }

    if (!requestBody.status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Status is required" }),
      };
    }

    // Update task status in DynamoDB
    const result = await dynamodb
      .update({
        TableName: process.env.TASKS_TABLE!,
        Key: {
          id: taskId,
        },
        UpdateExpression: "set #status = :status, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": requestBody.status,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
