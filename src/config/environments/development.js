module.exports = {
  PORT: process.env.PORT || 3000,
  DB: {
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  },
};
