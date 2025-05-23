const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

function validateClothingItem() {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'The "imageUrl" field must be a valid url',
      }),
      weather: Joi.string().valid("hot", "warm", "cold").required(),
    }),
  });
}
function validateUserInfo() {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateURL).messages({
        "string.empty": 'The "avatar" field must be filled in',
        "string.uri": 'The "avatar" field must be a valid url',
      }),
    }),
  });
}

function validateAuthentication() {
  return celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  });
}

function validateIds() {
  return celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().length(24),
    }),
  });
}

module.exports = {
  validateClothingItem,
  validateUserInfo,
  validateAuthentication,
  validateIds,
  validateURL,
};
