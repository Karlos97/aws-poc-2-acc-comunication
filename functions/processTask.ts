import { SQSEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

const stepfunctions = new AWS.StepFunctions();

interface MessageBody {
  taskId: string;
}

export const handler = async (event: SQSEvent): Promise<{ status: string }> => {
  const records = event.Records;

  for (const record of records) {
    const messageBody = JSON.parse(record.body) as MessageBody;
    const { taskId } = messageBody;

    // Start step function execution
    await stepfunctions
      .startExecution({
        stateMachineArn: process.env.TASK_PROCESSING_STATE_MACHINE!,
        input: JSON.stringify({
          taskId,
        }),
      })
      .promise();
  }

  return { status: "Success" };
};
