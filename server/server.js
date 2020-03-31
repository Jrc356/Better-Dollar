require('dotenv').config();

// Imports
const plaid = require('plaid');
const envvar = require('envvar');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const next = require('next');
const util = require('util');

// env vars
const APP_PORT = envvar.number('APP_PORT', 8000);
const DEV = envvar.string('NODE_ENV') !== 'production';
const PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID');
const PLAID_SECRET = envvar.string('PLAID_SECRET');
const PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY');
const PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox');
const PLAID_PRODUCTS = envvar.string('PLAID_PRODUCTS', 'transactions');
const PLAID_COUNTRY_CODES = envvar.string('PLAID_COUNTRY_CODES', 'US');

// Create plaid client
const plaidClient = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV],
);

// For plaid
let ACCESS_TOKEN = null;
let ITEM_ID = null;

const app = next({ dev: DEV });
const handle = app.getRequestHandler();

const prettyPrintResponse = (response) => {
  console.log(util.inspect(response, { colors: true, depth: 4 }));
};

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.urlencoded({
    extended: false,
  }));
  server.use(bodyParser.json());

  // Retrieve an access token
  server.post('/get_access_token', (req, res) => {
    console.log('> Received public token request');
    console.log('> headers:');
    prettyPrintResponse(req.headers);
    console.log('> body:');
    prettyPrintResponse(req.body);
    const PUBLIC_TOKEN = req.body.public_token;

    console.log('Retrieving access token...');
    plaidClient.exchangePublicToken(PUBLIC_TOKEN)
      .then((tokenResponse) => {
        ACCESS_TOKEN = tokenResponse.access_token;
        ITEM_ID = tokenResponse.item_id;
        console.log('> Token retreived');
        prettyPrintResponse(tokenResponse);
        return res.json({
          access_token: ACCESS_TOKEN,
          item_id: ITEM_ID,
          error: null,
        });
      })
      .catch((err) => res.json({
        err,
      }));
  });

  // Retrieve real-time Balances for each of an Item's accounts
  // https://plaid.com/docs/#balance
  server.get('/balance', (req, res) => {
    plaidClient.getBalance(ACCESS_TOKEN)
      .then((balanceResponse) => {
        prettyPrintResponse(balanceResponse);
        return res.json({ error: null, balance: balanceResponse });
      })
      .catch((err) => res.json({ err }));
  });

  // Retrieve Transactions for an Item
  // https://plaid.com/docs/#transactions
  server.get('/transactions', (req, res) => {
    // Pull transactions for the Item for the last 30 days
    const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    plaidClient.getTransactions(ACCESS_TOKEN, startDate, endDate, {
      count: 250,
      offset: 0,
    })
      .then((transactionsResponse) => {
        const answer = {};
        prettyPrintResponse(transactionsResponse);
        answer.error = null;
        answer.transactions = transactionsResponse;
        return res.json(answer);
      })
      .catch((err) => res.json({ err }));
  });

  // Retrieve an Item's accounts
  // https://plaid.com/docs/#accounts
  server.get('/accounts', (req, res) => {
    plaidClient.getAccounts(ACCESS_TOKEN)
      .then((accountsResponse) => {
        prettyPrintResponse(accountsResponse);
        return res.json({ error: null, accounts: accountsResponse });
      })
      .catch((err) => res.json({ err }));
  });

  server.all('*', (req, res) => handle(req, res));

  server.listen(APP_PORT, (err) => {
    if (err) throw err;
    console.log(`> server listening on port ${APP_PORT}`);
  });
});
