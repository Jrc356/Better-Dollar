/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import Category from './Category';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

const cats = ['Lifestyle', 'Transportation', 'Home', 'Insurance'];

export default function CategoriesList() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List>
        {cats.map((cat) => <Category key={cat} label={cat} />)}
      </List>
    </div>
  );
}
