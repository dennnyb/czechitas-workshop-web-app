# czechitas-workshop-web-app

## Welcome
Welcome to the Anthology (ex. Blackboard) workshop aimed to create your own web application using cloud technologies 
powered by AWS.
App is called: ac-my-app

(ac stands for: Anthology & Czechitas)

## Brief walk through
### create AWS free tier account
### Create IAM role in the account 
- Trusted type identity: AWS Service
- Common use cases: Lambda
- Policy: PowerUserAccess

Add tags (explain why tagging.)

### Create DynamoDB table
tableName: acmyapp
region: us-east-1

### Create lambda
lambdaName: acmyapp-web-function
runtime: node18

### Create API gateway
- type: rest api
