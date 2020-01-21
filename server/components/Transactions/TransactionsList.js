/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, List } from '@material-ui/core';
import Transaction from './Transaction';

const useStyles = makeStyles((theme) => ({
  grid: {
    flexGrow: 1,
    position: 'fixed',
  },
}));

const transactions = ['trans1', 'trans2', 'trans3'];

export default function TransactionsList() {
  const classes = useStyles();

  return (
    <Grid item xs={3}>
      <div className={classes.grid}>
        <h1> Transactions </h1>
        <List>
          {transactions.map((t) => <Transaction key={t} label={t} />)}
        </List>
      </div>
    </Grid>
  );
}