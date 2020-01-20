require('dotenv').config();

const plaid = require('plaid');
const envvar = require('envvar');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const util = require('util');

const APP_PORT = envvar.number('APP_PORT', 8000);
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

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

const prettyPrintResponse = (response) => {
  console.log(util.inspect(response, { colors: true, depth: 4 }));
};


app.get('/', (request, response) => {
  response.render('index.ejs', {
    PLAID_PUBLIC_KEY,
    PLAID_ENV,
    PLAID_PRODUCTS,
    PLAID_COUNTRY_CODES,
  });
});

app.post('/get_access_token', (request, response) => {
  const PUBLIC_TOKEN = request.body.public_token;
  client.exchangePublicToken(PUBLIC_TOKEN, (error, tokenResponse) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    prettyPrintResponse(tokenResponse);
    return response.json({
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
      error: null,
    });
  });
});

// Retrieve real-time Balances for each of an Item's accounts
// https://plaid.com/docs/#balance
app.get('/balance', (request, response) => {
  client.getBalance(ACCESS_TOKEN, (error, balanceResponse) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    prettyPrintResponse(balanceResponse);
    return response.json({ error: null, balance: balanceResponse });
  });
});

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
app.get('/transactions', (request, response) => {
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

    return response.json(answer);
  });
});

// Retrieve an Item's accounts
// https://plaid.com/docs/#accounts
app.get('/accounts', (request, response) => {
  client.getAccounts(ACCESS_TOKEN, (error, accountsResponse) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    prettyPrintResponse(accountsResponse);
    return response.json({ error: null, accounts: accountsResponse });
  });
});


app.listen(APP_PORT, () => {
  console.log(`server listening on port ${APP_PORT}`);
});
