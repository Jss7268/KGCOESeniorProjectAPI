module.exports = {
	PORT: (process.env.PORT || 3000),
	DATABASE_URL: (process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/edcs'),
  SECRET: (process.env.SECRET || '8gEIT7sbOZUlviTcLJmebFPg6r2tIXIX'),
  JWT_EXPIRATION: (process.env.JWT_EXPIRATION || 86400)
};