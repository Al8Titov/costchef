module.exports = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://Buck:Trevogavjope@cluster0.ruk1ewc.mongodb.net/costchef?retryWrites=true&w=majority&appName=Cluster0',
  JWT_SECRET: process.env.JWT_SECRET || 'costchef_super_secret_jwt_key_2024',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
