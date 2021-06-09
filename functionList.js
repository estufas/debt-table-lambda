const { getObjectFromS3, putObjectToS3, seedDataObjectToS3, deleteRowFromDebtObjt, addRowToDebtObjt } = require("./s3.js");

exports.callHandler = async (event) => {
  try {
    if(event.functionName == 'queryData') {
      let res = await getObjectFromS3();
      return res;
    } else if (event.functionName == 'resetData') {
      let res = await seedDataObjectToS3();
      return res;
    } else if(event.functionName == 'addRow') {
      let res = await addRowToDebtObjt(event.data);
      return res;
    } else if (event.functionName == 'removeRow') {
      let res = await deleteRowFromDebtObjt(event.data);
      return res;
    } else {
      let err = {
        status: 401,
        message: "no matching call"
      }
      throw err;
    }
  } catch(err) {
    console.error(err);
    throw err;
  }
}