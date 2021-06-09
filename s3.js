const AWS = require('aws-sdk');
const axios = require("axios");

async function putObjectToS3(bucket, key, data){
  var s3 = new AWS.S3();
  const objectName = 'helloworld.json'; // File name which you want to put in s3 bucket
  const objectData = '{ "message" : "Hello World!" }'; // file data you want to put
  const objectType = 'application/json'; // type of file
  try {
    // setup params for putObject
    const params = {
      Bucket: bucket,
      Key: objectName,
      Body: objectData,
      ContentType: objectType,
    };
    let result = await s3.putObject(params).promise();
    console.log(`File uploaded successfully at https:/` + bucket +   `.s3.amazonaws.com/` + objectName);
    return result;
  } catch (error) {
    console.log('error');
  }
};

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
  } catch (error) {
    console.log('error');
  }
};

async function addRowToDebtObjt(data){
  const s3 = new AWS.S3();
  try {
    let debtData = await getObjectFromS3();
    let objectData = debtData.concat(data);
    console.log(objectData);
    const params = {
      Bucket: process.env.BUCKET,
      Key: 'debt-file.json',
      Body: JSON.stringify(objectData),
      ContentType: 'application/json',
    };
    let result = await s3.putObject(params).promise();
    console.log(`File uploaded successfully at https:/` + process.env.BUCKET +   `.s3.amazonaws.com/`);
    return objectData;
  } catch (error) {
    console.log('error');
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
  } catch (error) {
    console.log('error');
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
    console.log(response)
    return response;
  } catch (err) {
    console.error(err)
  }
};

module.exports = {
  putObjectToS3, getObjectFromS3, seedDataObjectToS3, deleteRowFromDebtObjt, addRowToDebtObjt
}