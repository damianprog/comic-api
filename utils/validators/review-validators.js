module.exports.validateText = (text) => {
  const errors = {};
  if (text.trim().length === 0) {
    errors.text = 'Review must not be empty';
  }
  if (text.length > 5000) {
    errors.text = 'Maximum length of review is 5000';
  }

  return errors;
};
