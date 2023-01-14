import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const htmlTemplate = `<html>
  <body>
    <h1>Items in DynamoDB Table</h1>
    <form action='/' method='post'>
      <label>
        Name:
        <input type='text' name='name'/>
      </label>
      <input type='submit' value='Submit'/>
    </form>
    <ul>
      {{items}}
    </ul>
  </body>
</html>`;

export const handler = async (event) => {
  console.debug(event);
  const methodType = event.requestContext.http.method;
  if (methodType === 'GET') {
    const params = {
      TableName: 'todo'
    };
    try {
      const result = await client.send(new ScanCommand(params));
      const items = result.Items.map(item => `<li>${item.name}</li>`).join('');
      const html = htmlTemplate.replace('{{items}}', items);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: html
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      };
    }
  } else if (methodType === 'POST') {
    const body = atob(event.body);
    console.debug(body);
    const name = body.split('=')[1];
    console.debug(name);
    const params = {
      TableName: 'todo',
      Item: {
        name: name
      }
    };
    try {
      await client.send(new PutCommand(params));
      return {
        statusCode: 302,
        headers: {
          Location: "/" 
        }
      };
    } catch (error) {
      console.debug(error);
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      };
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Unsupported method' })
    };
  }
};
