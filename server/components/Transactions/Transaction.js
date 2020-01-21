/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, ListItem, ListItemText } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  paper: {
    flexGrow: 1,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  item: {
    flexGrow: 1,
  },
}));

export default function Transaction(props) {
  const { label } = props;

  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paper}>
        <ListItem button className={classes.item}>
          <ListItemText primary={label} />
        </ListItem>
      </Paper>
      <br />
    </div>
  );
}

Transaction.propTypes = {
  label: PropTypes.string.isRequired,
};
