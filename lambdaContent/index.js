const fs = require('fs')
// Create the DynamoDB service client module
const {DynamoDBClient, ExecuteStatementCommand} = require('@aws-sdk/client-dynamodb')
// Set the AWS Region.
const REGION = 'us-east-1'
// Create an Amazon DynamoDB service client object.
const dbClient = new DynamoDBClient({region: REGION})

exports.handler = async (event, context) => {

    return pageRouter(event.httpMethod, event.queryStringParameters, event.body)
}

async function pageRouter(httpMethod, queryString, formBody) {

    if (httpMethod === 'GET') {
        let htmlContent = fs.readFileSync('contactus.html').toString()
        return {
            'statusCode': 200, headers: {'Content-Type': "text/html"}, body: htmlContent
        }
    }

    if (httpMethod === 'POST') {
        await insertDbRecord(formBody)
        let htmlContent = fs.readFileSync("confirm.html").toString()
        return {
            'statusCode': 200, headers: {'Content-Type': "text/html"}, body: htmlContent
        }
    }
}

async function insertDbRecord(formBody) {
    // Replace HTTP format to PartiQL format
    formBody = formBody.replaceAll("=", "' : '")
    formBody = formBody.replaceAll("&", "', '")
    let formBodyToWrite = `INSERT INTO acmyapp value {'${formBody}'}`

    const params = {
        TableName: 'acmyapp', Statement: formBodyToWrite
    }
    const command = new ExecuteStatementCommand(params)

    // send write command to the DB and handle optional error
    try {
        const data = await dbClient.send(command)
        console.log('Successfully written')
    } catch (err) {
        console.error(err)
    }
}
