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

const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV],
);

let ACCESS_TOKEN = null;
let ITEM_ID = null;

const app = next({dev: DEV});
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.urlencoded({
    extended: false,
  }));
  server.use(bodyParser.json());
  
  const prettyPrintResponse = (response) => {
    console.log(util.inspect(response, { colors: true, depth: 4 }));
  };
  
  server.post('/get_access_token', (req, res) => {
    const PUBLIC_TOKEN = req.body.public_token;
    client.exchangePublicToken(PUBLIC_TOKEN, (error, tokenResponse) => {
      if (error != null) {
        prettyPrintResponse(error);
        return res.json({
          error,
        });
      }
      ACCESS_TOKEN = tokenResponse.access_token;
      ITEM_ID = tokenResponse.item_id;
      prettyPrintResponse(tokenResponse);
      return res.json({
        access_token: ACCESS_TOKEN,
        item_id: ITEM_ID,
        error: null,
      });
    });
  });
  
  // Retrieve real-time Balances for each of an Item's accounts
  // https://plaid.com/docs/#balance
  server.get('/balance', (req, res) => {
    client.getBalance(ACCESS_TOKEN, (error, balanceResponse) => {
      if (error != null) {
        prettyPrintResponse(error);
        return res.json({
          error,
        });
      }
      prettyPrintResponse(balanceResponse);
      return res.json({ error: null, balance: balanceResponse });
    });
  });
  
  // Retrieve Transactions for an Item
  // https://plaid.com/docs/#transactions
  server.get('/transactions', (req, res) => {
    // Pull transactions for the Item for the last 30 days
    const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    client.getTransactions(ACCESS_TOKEN, startDate, endDate, {
      count: 250,
      offset: 0,
    }, (error, transactionsResponse) => {
      const answer = {};
  
      if (error != null) {
        prettyPrintResponse(error);
        answer.error = error;
      } else {
        prettyPrintResponse(transactionsResponse);
        answer.error = null;
        answer.transactions = transactionsResponse;
      }
  
      return res.json(answer);
    });
  });
  
  // Retrieve an Item's accounts
  // https://plaid.com/docs/#accounts
  server.get('/accounts', (req, res) => {
    client.getAccounts(ACCESS_TOKEN, (error, accountsResponse) => {
      if (error != null) {
        prettyPrintResponse(error);
        return res.json({
          error,
        });
      }
      prettyPrintResponse(accountsResponse);
      return res.json({ error: null, accounts: accountsResponse });
    });
  });
  
  server.all('*', (req, res) => {
    return handle(req, res);
  })

  server.listen(APP_PORT, err => {
    if (err) throw err;
    console.log(`> server listening on port ${APP_PORT}`);
  });
})

