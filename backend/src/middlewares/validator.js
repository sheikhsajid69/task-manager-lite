const validator = (schema) => (req, res, next) => {
  const { error,value } = schema.validate(req.body);
  if(error){
    error.status=400;
    next(error);
  }
  req.body=value;
  next();
};

export default validator;