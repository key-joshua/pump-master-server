import Joi from 'joi';

const signupSchema = Joi.object({
  file: Joi.string().messages({
      'string.base': 'file should be a type of string',
      'string.empty': 'file cannot be an empty field',
  }),
  username: Joi.string().messages({
    'string.base': 'username must be a string',
    'string.empty': 'username is is not allowed to be empty',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'string.base': 'Email should be a type of string',
    'string.empty': 'Email cannot be an empty field',
  }),
  is_google: Joi.boolean().default(false).required().messages({
    'any.required': 'is_google field is required',
    'any.empty': 'is_google field cannot be empty',
    'boolean.base': 'is_google field must be a boolean value (true or false).',
  }),
  password: Joi.when('is_google', {
    is: false,
    then: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$')).required().messages({
      'string.empty': 'password cannot be an empty field',
      'string.base': 'password should be a type of string',
      'string.min': 'password should have a minimum length of 8 characters',
      'any.required': 'password field is required when the is_google field set to false',
      'string.pattern.base': 'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'password field is not allowed when the is_google field set to true'
    })
  }),
});

const signinSchema = Joi.object({
  username: Joi.string().messages({
    'string.base': 'username must be a string',
    'string.empty': 'username is is not allowed to be empty',
  }),
  email: Joi.string().email().required().messages({
      'any.required': 'email is required',
      'string.email': 'email must be a valid email',
      'string.base': 'email should be a type of string',
      'string.empty': 'email cannot be an empty field',
  }),
  is_google: Joi.boolean().default(false).required().messages({
    'any.required': 'is_google field is required',
    'any.empty': 'is_google field cannot be empty',
    'boolean.base': 'is_google field must be a boolean value (true or false).',
  }),
  password: Joi.when('is_google', {
    is: false,
    then: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$')).required().messages({
      'string.empty': 'password cannot be an empty field',
      'string.base': 'password should be a type of string',
      'string.min': 'password should have a minimum length of 8 characters',
      'any.required': 'password field is required when the is_google field set to false',
      'string.pattern.base': 'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'password field is not allowed when the is_google field set to true'
    })
  }),
});

const userDeviceSchema = Joi.object().keys({
  'user-device': Joi.string().required().messages({
      'any.required': 'User-Device is required',
      'string.base': 'User-Device should be a type of string',
      'string.empty': 'User-Device cannot be an empty field',
  }),
}).unknown(true);

const authorizationSchema = Joi.object().keys({
  'authorization': Joi.string().required().messages({
      'any.required': 'Authorization is required',
      'string.base': 'Authorization should be a type of string',
      'string.empty': 'Authorization cannot be an empty field',
  })
}).unknown(true);

const accessTokenSchema = Joi.object({
  access_token: Joi.string().required().messages({
    'any.required': 'access_token is required',
    'string.base': 'access_token should be a type of string',
    'string.empty': 'access_token cannot be an empty field',
  }),
});

const sendEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'string.base': 'Email should be a type of string',
    'string.empty': 'Email cannot be an empty field',
  }),
});

const passwordSchema = Joi.object({
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$')).required().messages({
    'string.empty': 'password cannot be an empty field',
    'string.base': 'password should be a type of string',
    'string.min': 'password should have a minimum length of 8 characters',
    'any.required': 'password field is required when the is_google field set to false',
    'string.pattern.base': 'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  }),
});

const sendVerificationMailSchema = Joi.object({
  action: Joi.string().valid('verifyAccount', 'resetPassword').required().messages({
      'any.required': 'action is required',
      'string.base': 'action should be a type of string',
      'string.empty': 'action cannot be an empty field',
      'any.only': 'action must be either "verifyAccount" or "resetPassword"',
    }),
});

const idSchema = Joi.object().keys({
  'id': Joi.string().required().messages({
      'any.required': 'id is required',
      'string.empty': 'id cannot be an empty field',
      'string.base': 'id should be a type of string',
  }),
}).unknown(true);

export {
  idSchema,
  signupSchema,
  signinSchema,
  passwordSchema,
  sendEmailSchema,
  userDeviceSchema,
  accessTokenSchema,
  authorizationSchema,
  sendVerificationMailSchema
};