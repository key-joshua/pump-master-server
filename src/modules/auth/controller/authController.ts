import StatusCodes from 'http-status-codes';
import { sendEmail } from '../../../services/sendEmail';
import responseUtils from '../../../utils/responseUtils';
import authRepository from '../repository/authRepository';
import { hashPassword } from '../../../utils/passwordUtils';
import { generateAccessToken, generateRandomString } from '../../../utils/jwtUtils';

const signup = async (req, res) => {
  try {
    const user = await authRepository.createUser(req.body);

    const refreshToken = generateRandomString();
    const accessToken = generateAccessToken(user._id.toString(), process.env.JWT_SECRET);
    const session = await authRepository.createSession({ user_id: user._id, device_id: req.headers['user-device'], access_token: accessToken, refresh_token: refreshToken });

    if (!user.is_google) {
      await sendEmail({
        receiverEmail: user.email,
        action: 'Verification Account',
        url: `${process.env.CLIENT_BASE_URL}/verify-account/${accessToken}?deviceId=${req.headers['user-device']}`,
      });
    }

    responseUtils.handleSuccess(StatusCodes.CREATED,
      user.is_google
        ? 'Account created successfully, from now-on you will Signin with Google.'
        : 'Account created successfully. Please check your email to verify the account.',
      { user, session }
    );

    return responseUtils.response(res);
  } catch (error: any) {
    responseUtils.handleError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Internal Server Error');
    return responseUtils.response(res);
  }
};

const signin = async (req, res) => {
  try {
    if (req.session) {
      responseUtils.handleSuccess(StatusCodes.OK, 'Logged in successfully', { user: req.user, session: req.session });
      return responseUtils.response(res);
    }

    const refreshToken = generateRandomString();
    const accessToken = generateAccessToken(req.user._id.toString(), process.env.JWT_SECRET);
    const session = await authRepository.createSession({ user_id: req.user._id, device_id: req.deviceId, access_token: accessToken, refresh_token: refreshToken });

    responseUtils.handleSuccess(StatusCodes.OK, 'Logged in successfully', { user: req.user, session });
    return responseUtils.response(res);
  } catch (error: any) {
    responseUtils.handleError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Internal Server Error');
    return responseUtils.response(res);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const user = await authRepository.updateUserByAttributes({ updatedKey: 'is_verified', updatedValue: true, whereKey: '_id', whereValue: req.user._id });
    responseUtils.handleSuccess(StatusCodes.OK, 'Account verified successfully, now you can login.', { user });
    return responseUtils.response(res);
  } catch (error: any) {
    responseUtils.handleError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Internal Server Error');
    return responseUtils.response(res);
  }
};

const signout = async (req, res) => {
  try {
    await authRepository.destroySessionByAttribute({ updatedKey: 'user_id', updatedValue: req.user._id, whereKey: 'access_token', whereValue: req.session.access_token });
    responseUtils.handleSuccess(StatusCodes.OK, 'Logged out successfully', {});
    return responseUtils.response(res);
  } catch (error: any) {
    responseUtils.handleError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Internal Server Error');
    return responseUtils.response(res);
  }
};

const sendVerificationLink = async (req, res) => {
  try {
    const { action } = req.params;
    if (!['verifyAccount', 'resetPassword'].includes(action)) {
      responseUtils.handleError(StatusCodes.BAD_REQUEST, 'Invalid action found');
      return responseUtils.response(res);
    }

    const user = await authRepository.findUserByAttributes({ whereKey: 'email', whereValue: req.body.email });

    if (!user) {
      responseUtils.handleError(StatusCodes.NOT_FOUND, 'Email not found.');
      return responseUtils.response(res);
    }

    if (user.is_google) {
      responseUtils.handleError(StatusCodes.BAD_REQUEST, 'Account is created with Google, continue signin with Google.');
      return responseUtils.response(res);
    }

    const refreshToken = generateRandomString();
    const accessToken = generateAccessToken(user._id.toString(), process.env.JWT_SECRET);
    await authRepository.createSession({ user_id: user._id, device_id: req.headers['user-device'], access_token: accessToken, refresh_token: refreshToken });
    if(action === 'resetPassword') await sendEmail({ receiverEmail: user.email, action: 'Reset Password', url: `${process.env.CLIENT_BASE_URL}/reset-password/${accessToken}` });
    if(action === 'verifyAccount') await sendEmail({ receiverEmail: user.email, action: 'Verification Account', url: `${process.env.CLIENT_BASE_URL}/verify-account/${accessToken}` });

    responseUtils.handleSuccess(StatusCodes.OK, 'Verification email sent successfully.', user);
    return responseUtils.response(res);
  } catch (error: any) {
    responseUtils.handleError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Internal Server Error');
    return responseUtils.response(res);
  }
};

const resetPassword = async (req, res) => {
  try {
    const user = await authRepository.updateUserByAttributes({ updatedKey: 'password', updatedValue: hashPassword(req.body.password), whereKey: '_id', whereValue: req.user._id });
    await authRepository.destroySessionByAttribute({ updatedKey: 'user_id', updatedValue: req.user._id, whereKey: 'access_token', whereValue: req.session.access_token });
    
    responseUtils.handleSuccess(StatusCodes.OK, 'Password reset successfully.', { user, session: req.session });
    return responseUtils.response(res);
  } catch (error: any) {
    responseUtils.handleError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Internal Server Error');
    return responseUtils.response(res);
  }
};

const verifyTokens = async (req, res) => {
  try {
    responseUtils.handleSuccess(StatusCodes.OK, 'Token verified successfully.', { user: req.user, session: req.session });
    return responseUtils.response(res);
  } catch (error: any) {
    responseUtils.handleError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Internal Server Error');
    return responseUtils.response(res);
  }
};


export default {
  signup,
  signin,
  signout,
  verifyEmail,
  verifyTokens,
  resetPassword,
  sendVerificationLink
};
