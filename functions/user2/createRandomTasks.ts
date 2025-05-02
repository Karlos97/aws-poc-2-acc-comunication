import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Task } from "../types";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();
const region = process.env.AWS_REGION || "eu-central-1";
const accountId = process.env.AWS_ACCOUNT_ID || "";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const tasks: Task[] = [];

    // Create 10 random tasks
    for (let i = 0; i < 10; i++) {
      const taskId = uuidv4();

      const task: Task = {
        id: taskId,
        title: `Random Task ${i + 1}`,
        description: `This is a randomly generated task #${
          i + 1
        } created by user-2`,
        status: "pending",
        createdAt: new Date().toISOString(),
        owner: "user-1", // These tasks belong to user-1 but are created by user-2
        createdBy: "user-2", // Created by user-2
      };

      // Store in DynamoDB
      await dynamodb
        .put({
          TableName: process.env.TASKS_TABLE!,
          Item: task,
        })
        .promise();

      try {
        // Get the SQS Queue URL first
        const queueData = await sqs
          .getQueueUrl({
            QueueName: process.env.USER2_TASK_QUEUE!,
          })
          .promise();

        if (queueData.QueueUrl) {
          // Send task to SQS for notification
          await sqs
            .sendMessage({
              QueueUrl: queueData.QueueUrl,
              MessageBody: JSON.stringify({
                id: task.id,
                title: task.title,
                description: task.description,
                owner: task.owner,
                createdBy: task.createdBy,
              }),
            })
            .promise();
        }
      } catch (sqsError) {
        console.error("Error sending SQS message:", sqsError);
        // Continue with the next task even if SQS fails
      }

      tasks.push(task);
    }

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Successfully created 10 random tasks for user-1",
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
