const { JWT_SECRET = "super-strong-secret", NODE_ENV } = process.env;

const corsOptions = {
  origin: 'https://aaron2320.happyforever.com',
  optionsSuccessStatus: 200,
};

module.exports = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  corsOptions,
};