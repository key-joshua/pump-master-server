import StatusCodes from 'http-status-codes';
import responseUtils from '../utils/responseUtils';
import { comparePassword } from '../utils/passwordUtils';
import authRepository from '../modules/auth/repository/authRepository';
import { generateAccessToken, generateRandomString, verifyToken } from '../utils/jwtUtils';

const isUserExist = async (req, res, next) => {
  try {
    const user = await authRepository.findUserByAttributes({ whereKey: 'email', whereValue: req.body.email });
    if (!user) return next();

    if (user.is_verified && !user.is_google) {
      responseUtils.handleError(StatusCodes.CONFLICT, 'This account already in use. Sign in with email and password.');
    } else if (user.is_verified && user.is_google) {
      responseUtils.handleError(StatusCodes.CONFLICT, 'This Google account already in use. Sign in with Google.');
    } else {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'This account already exists. Please verify your email.');
    }

    return responseUtils.response(res);
  } catch (error: any) {
    responseUtils.handleError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.toString());
    return responseUtils.response(res);
  }
};

const isAccountVerified = async (req, res, next) => {
  try {
    const verifiedToken = await verifyToken(req.params.access_token, process.env.JWT_SECRET);
    const user = await authRepository.findUserByAttributes({ whereKey: '_id', whereValue: verifiedToken.id });

    if (!user) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'Account not found.');
      return responseUtils.response(res);
    }

    if (user.is_verified) {
      responseUtils.handleSuccess(StatusCodes.OK, 'Account already verified, now you can login.', { user });
      return responseUtils.response(res);
    }

    const session = await authRepository.findSessionByAttributes({
      updatedKey: 'user_id',
      updatedValue: verifiedToken.id,
      whereKey: 'access_token',
      whereValue: req.params.access_token
    });

    if (!session) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'Email verification link expired or invalid.');
      return responseUtils.response(res);
    }
    
    req.session = session;
    req.user = user;
    return next();
  } catch (error: any) {
    responseUtils.handleError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.toString());
    return responseUtils.response(res);
  }
};

const isCredentialExist = async (req, res, next) => {
  try {
    let user = await authRepository.findUserByAttributes({ whereKey: 'email', whereValue: req.body.email });

    if (!user && req.body.is_google) {
      user = await authRepository.createUser(req.body);
      const refreshToken = generateRandomString();
      const accessToken = generateAccessToken(user._id.toString(), process.env.JWT_SECRET);

      await authRepository.createSession({
        user_id: user._id,
        device_id: req.headers['user-device'],
        access_token: accessToken,
        refresh_token: refreshToken
      });

      req.user = user;
      req.session = null;
      req.deviceId = req.headers['user-device'];
      return next();
    }

    if (!user) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password.');
      return responseUtils.response(res);
    }

    if (!user.is_google && req.body.is_google) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'This is not a Google account. Sign in with email and password.');
      return responseUtils.response(res);
    }

    if (user.is_google && !req.body.is_google) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'This is not a regular account. Sign in with Google.');
      return responseUtils.response(res);
    }

    if (!user.is_verified) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'This account is not verified. Please verify your account to login.');
      return responseUtils.response(res);
    }

    if (!user.is_google) {
      const passwordMatches = await comparePassword(req.body.password, user.password);
      if (!passwordMatches) {
        responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password.');
        return responseUtils.response(res);
      }
    }

    const session = await authRepository.findSessionByAttributes({
      updatedKey: 'user_id',
      updatedValue: user._id,
      whereKey: 'device_id',
      whereValue: req.headers['user-device']
    });

    req.user = user;
    req.session = session || null;
    req.deviceId = req.headers['user-device'];
    return next();
  } catch (error: any) {
    responseUtils.handleError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.toString());
    return responseUtils.response(res);
  }
};

const isSessionExist = async (req, res, next) => {
  try {
    let session;
    const deviceId = req.headers['user-device'];
    const verifiedToken = await verifyToken(req.params.access_token, process.env.JWT_SECRET);
    const user = await authRepository.findUserByAttributes({ whereKey: '_id', whereValue: verifiedToken.id });

    if (!user) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'Account not found.');
      return responseUtils.response(res);
    }

    if (!user.is_verified) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'This account is not verified. Please verify your account to login.');
      return responseUtils.response(res);
    }
    
    if (deviceId) {
      session = await authRepository.findSessionByTripleAttributes({ updatedKey: 'user_id', updatedValue: verifiedToken.id, whereKeyI: 'access_token', whereValueI: req.params.access_token, whereKeyII: 'device_id', whereValueII: deviceId });
    } else {
      session = await authRepository.findSessionByAttributes({ updatedKey: 'user_id', updatedValue: verifiedToken.id, whereKey: 'access_token', whereValue: req.params.access_token });
    }

    if (!session) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'Email verification link expired or invalid.');
      return responseUtils.response(res);
    }

    req.session = session;
    req.user = user;
    return next();
  } catch (error: any) {
    responseUtils.handleError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.toString());
    return responseUtils.response(res);
  }
};

const isPaginated = (req, res, next) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 30;

  req.pagination = {
    page,
    limit,
    offset: (page - 1) * limit
  };

  return next();
};

export {
  isUserExist,
  isPaginated,
  isSessionExist,
  isCredentialExist,
  isAccountVerified,
};
