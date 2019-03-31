const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dbClient = new AWS.DynamoDB.DocumentClient();

const response = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: ''
}

module.exports.handler = async(event) => {
    let params = {
        TableName: process.env.DYNAMO_USER_TABLE
    };

    return await new Promise((resolve, reject) => {
        dbClient.scan(params)
        .promise()
        .then((data) => {
            response.body = JSON.stringify(data.Items);
            resolve(response);
        }).catch((err) => {
            response.statusCode = err.statusCode || 503;
            response.body = JSON.stringify(err.message);
            resolve(response)
        })
    });
};