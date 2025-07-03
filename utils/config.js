const { JWT_SECRET = "super-strong-secret", NODE_ENV } = process.env;

const corsOptions = {
  origin: [
    'https://aaron2320.mooo.com',
    'https://www.aaron2320.mooo.com',
    'http://localhost:3000' // Optional for local dev
  ],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  corsOptions,
};