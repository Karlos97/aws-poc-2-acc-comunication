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

    // First check if the task exists and belongs to user-1
    const taskResult = await dynamodb
      .get({
        TableName: process.env.TASKS_TABLE!,
        Key: { id: taskId },
      })
      .promise();

    if (!taskResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Task not found" }),
      };
    }

    if (taskResult.Item.owner !== "user-1") {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Not authorized to update this task" }),
      };
    }

    // Build update expression dynamically based on provided fields
    let updateExpression = "set updatedAt = :updatedAt";
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {
      ":updatedAt": new Date().toISOString(),
    };

    // Add status update
    updateExpression += ", #status = :status";
    expressionAttributeNames["#status"] = "status";
    expressionAttributeValues[":status"] = requestBody.status;

    // Add title update if provided
    if (requestBody.title) {
      updateExpression += ", #title = :title";
      expressionAttributeNames["#title"] = "title";
      expressionAttributeValues[":title"] = requestBody.title;
    }

    // Add description update if provided
    if (requestBody.description) {
      updateExpression += ", #description = :description";
      expressionAttributeNames["#description"] = "description";
      expressionAttributeValues[":description"] = requestBody.description;
    }

    // Update task in DynamoDB
    const result = await dynamodb
      .update({
        TableName: process.env.TASKS_TABLE!,
        Key: {
          id: taskId,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
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
