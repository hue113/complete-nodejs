module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// const asyncHandler = (fn) => (req, res, next) =>
//   Promise.resolve(fn(req, res, next)).catch(next);

// app.get(
//   '/async',
//   asyncHandler(async (req, res) => {
//     const result = await request('http://example.com');
//     res.end(result);
//   }),
// );
