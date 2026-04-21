import { DynamoDBClient, ListTablesCommand, CreateTableCommand } from "@aws-sdk/client-dynamodb";

export async function ListTables(client: DynamoDBClient) {
  const data = await client.send(new ListTablesCommand({}))
  console.dir("Tables: ", data.TableNames)
  return data.TableNames
}

export async function CreateTable(client: DynamoDBClient) {
  const data = await client.send(new CreateTableCommand({
    TableName: `tabla-dynamo-${Date.now()}`,
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }, { AttributeName: "content", KeyType: "RANGE" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }, { AttributeName: "content", AttributeType: "S" }],
    BillingMode: "PAY_PER_REQUEST",
  }));
  return data
}
