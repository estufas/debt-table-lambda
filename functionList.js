const { getObjectFromS3, seedDataObjectToS3, deleteRowFromDebtObjt, addRowToDebtObjt } = require("./s3.js");

exports.callHandler = async (body) => {
  try {
    if(body.functionName == "queryData") {
      let res = await getObjectFromS3();
      return res;
    } else if (body.functionName == "resetData") {
      let res = await seedDataObjectToS3();
      console.log(res);
      return res;
    } else if(body.functionName == "addRow") {
      let res = await addRowToDebtObjt(body.data);
      return res;
    } else if (body.functionName == "removeRow") {
      let res = await deleteRowFromDebtObjt(body.data);
      return res;
    } else {
      let err = {
        status: 400,
        message: "no matching call"
      }
      throw err;
    }
  } catch(err) {
    console.error(err, 'error shows here');
    throw err;
  }
}