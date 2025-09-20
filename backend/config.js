module.exports = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: 'mongodb+srv://Buck:Trevogavjope@cluster0.ruk1ewc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  JWT_SECRET: 'your_jwt_secret_key_here_change_in_production',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
