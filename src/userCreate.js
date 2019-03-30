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

const createUser = (event) => {
    let body = JSON.parse(event.body);

    if (!!body && 'userName' in body) {
        return {
            TableName: process.env.DYNAMO_USER_TABLE,
            Item: {
                "id": body.userName
            },
            ConditionExpression: "attribute_not_exists(id)"
        };
    }

    return null;
}

const putItem = (params) => {
    return new Promise((resolve, reject) => {
        dbClient.put(params, (err, data) => {
            if (!!err) {
                response.statusCode = err.statusCode || 503;
                response.body = JSON.stringify(err.message);
            } else {
                response.statusCode = 201;
                response.body = JSON.stringify(params.Item);
            }

            resolve(response);
        })
    })
}

module.exports.handler = async(event) => {
    let params = createUser(event);

    if (params == null) {
        response.statusCode = 401;
        response.body = JSON.stringify('Body does not contain an valid userName');
        return JSON.stringify(response);
    }

    return await putItem(params);
};
