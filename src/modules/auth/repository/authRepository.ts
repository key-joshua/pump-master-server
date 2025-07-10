import users from '../../../database/models/users';
import sessions from '../../../database/models/sessions';
import { hashPassword } from '../../../utils/passwordUtils';

const createUser = async (body) => {
  const isGoogle = body.is_google === 'false' || body.is_google === false ? false : true;
  
  const is_verified = isGoogle;
  if (is_verified) delete body.password;
  if (body.password) body.password = hashPassword(body.password);

  return await users.create({ ...body, is_verified });
};

const findUserByAttributes = async ({ whereKey, whereValue }) => {
  return await users.findOne({ [whereKey]: whereValue });
};

const updateUserByAttributes = async ({ updatedKey, updatedValue, whereKey, whereValue }) => {
  await users.updateOne({ [whereKey]: whereValue }, { $set: { [updatedKey]: updatedValue } });
  return await users.findOne({ [whereKey]: whereValue });
};

const createSession = async (body) => {
  return await sessions.create(body);
};

const findSessionByAttributes = async ({ updatedKey, updatedValue, whereKey, whereValue }) => {
  return await sessions.findOne({ [updatedKey]: updatedValue, [whereKey]: whereValue });
};

const findSessionByTripleAttributes = async ({ updatedKey, updatedValue, whereKeyI, whereValueI, whereKeyII, whereValueII }) => {
  return await sessions.findOne({ [updatedKey]: updatedValue, [whereKeyI]: whereValueI, [whereKeyII]: whereValueII });
};

const destroySessionByAttribute = async ({ updatedKey, updatedValue, whereKey, whereValue }) => {
  return await sessions.deleteOne({ [updatedKey]: updatedValue, [whereKey]: whereValue });
};

export default {
  createUser,
  createSession,
  findUserByAttributes,
  updateUserByAttributes,
  findSessionByAttributes,
  destroySessionByAttribute,
  findSessionByTripleAttributes,
};
