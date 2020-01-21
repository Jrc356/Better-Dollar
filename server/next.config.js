require('dotenv').config();

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.node = { fs: 'empty', net: 'empty', tls: 'empty' };
    return config;
  },
  env: {
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_SECRET: process.env.PLAID_SECRET,
    PLAID_PUBLIC_KEY: process.env.PLAID_PUBLIC_KEY,
    PLAID_PRODUCTS: process.env.PLAID_PRODUCTS,
    PLAID_COUNTRY_CODES: process.env.PLAID_COUNTRY_CODES,
    PLAID_ENV: process.env.PLAID_ENV,
  },
};
