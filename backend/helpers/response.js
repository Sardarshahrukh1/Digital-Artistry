module.exports.CustomResponse = (obj, res) => {
  return res.status(obj.code).json({
    code: obj.code,
    message: obj.message,
    payload: obj.payload,
    error: obj.error,
  });
}

