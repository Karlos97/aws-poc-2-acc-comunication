import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
import { Task } from "../types";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Get all tasks belonging to user-1
    const scanResult = await dynamodb
      .scan({
        TableName: process.env.TASKS_TABLE!,
        FilterExpression: "#ownerAttr = :ownerValue",
        ExpressionAttributeNames: {
          "#ownerAttr": "owner",
        },
        ExpressionAttributeValues: {
          ":ownerValue": "user-1",
        },
      })
      .promise();

    const tasks = scanResult.Items || [];

    if (tasks.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No tasks found for user-1",
        }),
      };
    }

    // Delete all tasks
    const deletedTasks: Task[] = [];
    for (const task of tasks) {
      await dynamodb
        .delete({
          TableName: process.env.TASKS_TABLE!,
          Key: { id: task.id },
        })
        .promise();

      deletedTasks.push(task as Task);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully deleted ${deletedTasks.length} tasks for user-1`,
        deletedTasks,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
