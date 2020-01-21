/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Fab, Grid } from '@material-ui/core';
import envvar from 'envvar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function addAccount() {
  const handler = window.Plaid.create({
    apiVersion: 'v2',
    clientName: 'Better Dollar',
    env: process.env.PLAID_ENV,
    product: process.env.PLAID_PRODUCTS.split(','),
    key: process.env.PLAID_PUBLIC_KEY,
    countryCodes: process.env.PLAID_COUNTRY_CODES.split(','),
    onSuccess: (publicToken) => {
      fetch('/get_access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token: publicToken }),
      }).then((data) => {
        // leaving for now
      });
    },
  });
  handler.open();
}

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container justify="center">
        <Fab onClick={addAccount}>Add Bank Account</Fab>
      </Grid>
    </div>
  );
}
