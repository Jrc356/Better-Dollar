/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import CategoriesList from './CategoriesList';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function Budget() {
  const classes = useStyles();

  return (
    <Grid item xs={9} className={classes.root}>
      <h1> Budget </h1>
      <CategoriesList />
    </Grid>
  );
}