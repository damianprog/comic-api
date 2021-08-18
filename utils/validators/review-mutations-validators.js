const { validateText } = require('./review-validators');

module.exports.validateReviewInput = ({ text }) => {
  const textErrors = validateText(text);
  const errors = {
    ...textErrors,
  };

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};
