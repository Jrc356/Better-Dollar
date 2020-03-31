/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

export default function Expense(props) {
  const { label } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ListItem button>
        <ListItemText primary={label} />
      </ListItem>
    </div>
  );
}

Expense.propTypes = {
  label: PropTypes.string.isRequired,
};
