const {
  validateNickname,
  validateEmail,
  validatePassword,
  validateBirthDate,
  validateInterests,
  validateAbout,
  validateUserComicCategory,
} = require('./user-validators');

module.exports.validateSignupInput = ({
  nickname,
  email,
  password,
  birthDate,
}) => {
  const nicknameErrors = validateNickname(nickname);
  const emailErrors = validateEmail(email);
  const passwordErrors = validatePassword(password);
  const birthDateErrors = validateBirthDate(birthDate);

  const errors = {
    ...nicknameErrors,
    ...emailErrors,
    ...passwordErrors,
    ...birthDateErrors,
  };

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

module.exports.validateSigninInput = ({ email, password }) => {
  const emailErrors = validateEmail(email);
  const passwordErrors = validatePassword(password);

  const errors = {
    ...emailErrors,
    ...passwordErrors,
  };
  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

module.exports.validateUpdateUserInput = ({
  nickname,
  interests,
  about,
  birthDate,
}) => {
  const nicknameErrors = validateNickname(nickname);
  const interestsErrors = validateInterests(interests);
  const aboutErrors = validateAbout(about);
  const birthDateErrors = validateBirthDate(birthDate);

  const errors = {
    ...nicknameErrors,
    ...interestsErrors,
    ...aboutErrors,
    ...birthDateErrors,
  };
  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

module.exports.validateCreateUserComicInput = ({ category }) => {
  const categoryErrors = validateUserComicCategory(category);

  const errors = {
    ...categoryErrors,
  };

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};
