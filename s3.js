const AWS = require('aws-sdk');
const axios = require("axios");

async function seedDataObjectToS3(){
  const s3 = new AWS.S3();
  try {
    let debtData = await axios.get('https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json');
    const objectData = JSON.stringify(debtData.data);
    const params = {
      Bucket: process.env.BUCKET,
      Key: 'debt-file.json',
      Body: objectData,
      ContentType: 'application/json',
    };
    let result = await s3.putObject(params).promise();
    console.log(`File uploaded successfully at https:/` + process.env.BUCKET +   `.s3.amazonaws.com/`);
    return debtData.data;
  } catch (err) {
    console.err(err);
    err['status'] = err.response.statusCode;
    throw err;
  }
};

async function addRowToDebtObjt(data){
  const s3 = new AWS.S3();
  try {
    let debtData = await getObjectFromS3();
    if (data.firstName == data.creditorName) {
      let err = {
        "statusCode": 400,
        "message": "creditor and firstName cannot be the same"
      };
      throw err;
    }
    let objectData = debtData.concat(data);
    const params = {
      Bucket: process.env.BUCKET,
      Key: 'debt-file.json',
      Body: JSON.stringify(objectData),
      ContentType: 'application/json',
    };
    let result = await s3.putObject(params).promise();
    console.log(`File uploaded successfully at https:/` + process.env.BUCKET +   `.s3.amazonaws.com/`);
    return objectData;
  } catch (err) {
    throw err;
  }
};

async function deleteRowFromDebtObjt(rows){
  const s3 = new AWS.S3();
  try {
    let debtData = await getObjectFromS3();
    rows.forEach(element => {
      debtData = debtData.filter(function( obj ) {
        return obj.id !== element.id;
      });
    });
    const params = {
      Bucket: process.env.BUCKET,
      Key: 'debt-file.json',
      Body: JSON.stringify(debtData),
      ContentType: 'application/json',
    };
    let result = await s3.putObject(params).promise();
    console.log(`File uploaded successfully at https:/` + process.env.BUCKET +   `.s3.amazonaws.com/`);
    return debtData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

async function getObjectFromS3(){
  try {
    var s3 = new AWS.S3();
    var params = {
      Bucket : process.env.BUCKET,
      Key : 'debt-file.json'
    }
    let response = await s3.getObject(params).promise();
    response = JSON.parse(response.Body.toString('utf-8'))
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  getObjectFromS3, seedDataObjectToS3, deleteRowFromDebtObjt, addRowToDebtObjt
}