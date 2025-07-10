import StatusCodes from 'http-status-codes';
import { verifyToken } from '../utils/jwtUtils';
import responseUtils from '../utils/responseUtils';
import authRepository from '../modules/auth/repository/authRepository';

export const isAuthenticated = async (req, res, next) => {
  try {
    let session;
    const authHeader = req.header('Authorization');
    const deviceId = req.headers['user-device'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'Authorization token missing or invalid.');
      return responseUtils.response(res);
    }

    const authorizationToken = authHeader.replace('Bearer ', '');
    const verifiedToken = await verifyToken(authorizationToken, process.env.JWT_SECRET);

    if (deviceId) {
      session = await authRepository.findSessionByTripleAttributes({ updatedKey: 'user_id', updatedValue: verifiedToken.id, whereKeyI: 'access_token', whereValueI: authorizationToken, whereKeyII: 'device_id', whereValueII: deviceId });
    } else {
      session = await authRepository.findSessionByAttributes({ updatedKey: 'user_id', updatedValue: verifiedToken.id, whereKey: 'access_token', whereValue: authorizationToken });
    }

    if (!session) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'Session not found or already logged out.');
      return responseUtils.response(res);
    }

    const user = await authRepository.findUserByAttributes({ whereKey: '_id', whereValue: verifiedToken.id });
    if (!user) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'User not found.');
      return responseUtils.response(res);
    }

    if (!user.is_verified) {
      responseUtils.handleError(StatusCodes.UNAUTHORIZED, 'This account is not verified. Please verify your account to login.');
      return responseUtils.response(res);
    }

    req.session = session;
    req.user = user;
    return next();
  } catch (error: any) {
    responseUtils.handleError(error?.status || StatusCodes.INTERNAL_SERVER_ERROR, error.toString());
    return responseUtils.response(res);
  }
};
