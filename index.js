// const { getObjectFromS3, putObjectToS3, seedDataObjectToS3 } = require("./s3.js");
const { callHandler } = require("functionList.js");

exports.handler = async (event) => {
  try {
    let debObjt = await callHandler(event.body);
    let response = {
      statusCode: 200,
      body: {
        "body": debObjt
      }
    };
    return response;
  } catch(err) {
    console.error(err)
    let response = {
      statusCode: 500,
      body: err,
    };
    return response
  };
};
