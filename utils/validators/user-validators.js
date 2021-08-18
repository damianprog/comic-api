module.exports.validateNickname = (nickname) => {
  const errors = {};
  if (nickname.trim() === '') {
    errors.nickname = 'Nickname must not be empty';
  }
  if (nickname.trim().length > 20) {
    errors.nickname = 'Maximum length of nickname is 20';
  }
  if (nickname.trim().length < 3) {
    errors.nickname = 'Minimum length of nickname is 3';
  }

  return errors;
};

module.exports.validateEmail = (email) => {
  const errors = {};
  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }

  return errors;
};

module.exports.validatePassword = (password) => {
  const errors = {};
  if (password.length > 25) {
    errors.password = 'Maximum length of password is 25';
  }
  if (password.length < 6) {
    errors.password = 'Minimum length of password is 6';
  }

  return errors;
};

module.exports.validateBirthDate = (birthDate) => {
  const errors = {};
  if (birthDate.trim() === '') {
    errors.birthDate = 'Birth date must not be empty';
  }

  return errors;
};

module.exports.validateInterests = (interests) => {
  const errors = {};
  if (interests.trim().length > 150) {
    errors.interests = 'Maximum length of interests is 150';
  }

  return errors;
};

module.exports.validateAbout = (about) => {
  const errors = {};
  if (about.trim().length > 250) {
    errors.about = 'Maximum length of about is 250';
  }

  return errors;
};

module.exports.validateUserComicCategory = (category) => {
  const errors = {};
  if (category.trim().length === 0) {
    errors.category = 'Category must not empty';
  }

  if (category.trim().length > 20) {
    errors.category = 'Maximum length of category is 20';
  }

  return errors;
};
