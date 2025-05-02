import { SQSEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import { Task } from "../types";

const sqs = new AWS.SQS();

interface TaskMessage {
  id: string;
  title: string;
  description: string;
  owner: string;
  createdBy: string;
}

export const handler = async (event: SQSEvent): Promise<{ status: string }> => {
  try {
    const records = event.Records;

    for (const record of records) {
      const message = JSON.parse(record.body) as TaskMessage;

      try {
        // Get the SQS Queue URL first
        const queueData = await sqs
          .getQueueUrl({
            QueueName: process.env.USER2_NOTIFICATION_QUEUE!,
          })
          .promise();

        if (queueData.QueueUrl) {
          // Send a notification message to the user-2 queue
          await sqs
            .sendMessage({
              QueueUrl: queueData.QueueUrl,
              MessageBody: JSON.stringify({
                message: `Task ${message.id} was created for ${message.owner} by ${message.createdBy}`,
                taskDetails: message,
              }),
            })
            .promise();
        }
      } catch (sqsError) {
        console.error("Error sending notification to queue:", sqsError);
      }
    }

    return { status: "Success" };
  } catch (error) {
    console.error("Error processing SQS messages:", error);
    return { status: "Failed" };
  }
};
