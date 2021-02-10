export default {
  checkfield (req, res, next) {
    const fields = ['phone', 'userId', 'ownerId'];
    let count = 0
    fields.forEach(field => {
      if (!req.body[field]) 
      return res.status(400).json({
        message:  `${field} is required to create contact`, 
      });
      if (!req.body[field].toString().trim()) 
      return res.status(400).json({
        message:  `${field} cannot be empty`, 
      });
      count++
    });

    // check that all fields are validated 
    if (fields.length === count) {
      return next();
    }
  },
  validateUpdate (req, res, next) {
    const fields = ['userId', 'ownerId'];
    let count = 0
    fields.forEach(field => {
      if (!req.body[field]) 
      return res.status(400).json({
        message:  `${field} is required to update contact`, 
      });
      if (!req.body[field].toString().trim()) 
      return res.status(400).json({
        message:  `${field} cannot be empty`, 
      });
      count++
    });

    // check that all fields are validated 
    if (fields.length === count) {
      return next();
    }
  }
}
