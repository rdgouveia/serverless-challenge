const joi = require("joi");

module.exports = joi.object({
  name: joi.string().required(),
  age: joi.number().integer().positive().required(),
  role: joi.string().required(),
});
