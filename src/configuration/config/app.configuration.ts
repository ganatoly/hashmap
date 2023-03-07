export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    appPort: parseInt(process.env.APP_PORT, 10) || 4500,
  },
});
