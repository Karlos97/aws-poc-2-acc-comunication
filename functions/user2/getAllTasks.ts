import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
import { Task } from "../types";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Get all tasks belonging to user-1
    const result = await dynamodb
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

    const tasks = result.Items || [];

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Retrieved all tasks for user-1",
        count: tasks.length,
        tasks,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
