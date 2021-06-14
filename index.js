const { callHandler } = require("functionList.js");

exports.handler = async (event, context, callback) => {
  try {
    let body = JSON.parse(event.body)
    let debObjt = await callHandler(body);
    return {
      statusCode: 201,
      body: JSON.stringify({
        id: context.awsRequestId,
        data: debObjt
      }),
      headers: {
        "Content-Type": "application/json",
      }
    };
  } catch(err) {
    const response = {
      statusCode: err.statusCode,
      body: JSON.stringify({
        id: context.awsRequestId,
        message: err.message
      }),
      headers: {
        "Content-Type": "application/json",
      }
    };
    return response
  };
};
