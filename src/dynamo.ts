import { DynamoDBClient, ListTablesCommand, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import type { CreateTableInput } from "@aws-sdk/client-dynamodb";

async function ListTables(client: DynamoDBClient) {
  try {
    const data = await client.send(new ListTablesCommand({}))
    console.log("Tables: ", data.TableNames)
    return data.TableNames
  } catch (err) {
    console.error(err)
    return err
  }
}

async function CreateTable(client: DynamoDBClient) {
  try {
    const input: CreateTableInput = {
      // TODO: Fix
      TableName: "",
    }
    const data = await client.send(new CreateTableCommand(input))
  } catch (err) {
    console.error(err)
    return err
  }
}
