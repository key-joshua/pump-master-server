import Joi from 'joi';
import StatusCodes from 'http-status-codes';
import responseUtils from '../utils/responseUtils';

const routeHeaderValidation = (schema: Joi.ObjectSchema | Joi.ArraySchema) => async (req, res, next) => {
    try {
        const { error } = schema.validate(req.headers, { abortEarly: false });
        if (error) {
            const errorMessage = `${error.details[0].message} in the headers.`;
            responseUtils.handleError(StatusCodes.BAD_REQUEST, errorMessage);
            return responseUtils.response(res);
        }
    
        return next();
    } catch (error: any) {
        responseUtils.handleError(error?.status || StatusCodes.INTERNAL_SERVER_ERROR, error.toString());
        return responseUtils.response(res);
    }
};

const routeParamsValidation = (schema: Joi.ObjectSchema | Joi.ArraySchema) => async (req, res, next) => {
  try {
    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) {
        const errorMessage = `${error.details[0].message} in the params.`;
        responseUtils.handleError(StatusCodes.BAD_REQUEST, errorMessage);
        return responseUtils.response(res);
    }

    return next();
    } catch (error: any) {
        responseUtils.handleError(error?.status || StatusCodes.INTERNAL_SERVER_ERROR, error.toString());
        return responseUtils.response(res);
    }
};

const routeQueryValidation = (schema: Joi.ObjectSchema | Joi.ArraySchema) => async (req, res, next) => {
  try {
    const { error } = schema.validate(req.query, { abortEarly: false });
    if (error) {
        const errorMessage = `${error.details[0].message} in the query params.`;
        responseUtils.handleError(StatusCodes.BAD_REQUEST, errorMessage);
        return responseUtils.response(res);
    }

    return next();
    } catch (error: any) {
        responseUtils.handleError(error?.status || StatusCodes.INTERNAL_SERVER_ERROR, error.toString());
        return responseUtils.response(res);
    }
};

const routeBodyValidation = (schema: Joi.ObjectSchema | Joi.ArraySchema) => async (req, res, next) => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMessage = `${error.details[0].message} in the body.`;
        responseUtils.handleError(StatusCodes.BAD_REQUEST, errorMessage);
        return responseUtils.response(res);
      }
  
      return next();
    } catch (error: any) {
        responseUtils.handleError(error?.status || StatusCodes.INTERNAL_SERVER_ERROR, error.toString());
        return responseUtils.response(res);
    }
};

export { routeHeaderValidation, routeParamsValidation, routeQueryValidation, routeBodyValidation };
