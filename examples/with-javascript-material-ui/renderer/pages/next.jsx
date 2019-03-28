import React from 'react';
import Head from 'next/head';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { resolve } from '../helpers';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 4,
  },
});

class About extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Next - Nextron (with-javascript-material-ui)</title>
        </Head>

        <div className={classes.root}>
          <Typography variant="h4" gutterBottom>
            Material-UI
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            with Nextron
          </Typography>
          <Typography gutterBottom>
            <a href={resolve('home')}>
              Go to home page
            </a>
          </Typography>
          <Button variant="contained" color="primary">
            Do nothing button
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(About);
