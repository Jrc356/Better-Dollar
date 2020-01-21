/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  }
}));

export default function CategoryItem(props) {
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

CategoryItem.propTypes = {
  label: PropTypes.string.isRequired,
};
