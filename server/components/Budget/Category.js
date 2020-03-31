/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Paper, Divider } from '@material-ui/core';
import Expense from './Expense';


const useStyles = makeStyles((theme) => ({
  paper: {
    flexGrow: 1,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
    textAlign: 'center',
  },
}));

const items = ['exp1', 'exp2', 'exp3'];

export default function Category(props) {
  const { label } = props;

  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paper}>
        <h4 textalign="center">{label}</h4>
        <Divider />
        {items.map((item) => <Expense key={item} label={item} />)}
        <Divider light variant="middle" />
        <Expense label="Add New" />
      </Paper>
      <br />
    </div>
  );
}

Category.propTypes = {
  label: PropTypes.string.isRequired,
};
