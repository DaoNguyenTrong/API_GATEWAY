/**
 * It takes a function as an argument, and returns a new function that will catch any errors that occur
 * when the original function is executed
 * @param {function} fn - The function that we want to catch errors for.
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;
