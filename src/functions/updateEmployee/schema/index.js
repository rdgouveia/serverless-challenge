const joi = require("joi");

module.exports.joiSchemaBody = joi.object({
  name: joi.string().optional(),
  age: joi.number().integer().positive().optional(),
  role: joi.string().optional(),
});

module.exports.joiSchemaId = joi.string().required();
