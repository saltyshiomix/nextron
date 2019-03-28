import React from 'react';
import Head from 'next/head';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles, WithStyles, Theme, createStyles } from '@material-ui/core/styles';
import { resolve } from '../helpers';

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    textAlign: 'center',
    paddingTop: spacing.unit * 4,
  },
});

interface Props extends WithStyles<typeof styles> {}

const About = withStyles(styles)(
  class extends React.Component<Props> {
    render() {
      const { classes } = this.props;

      return (
        <React.Fragment>
          <Head>
            <title>Next - Nextron (with-typescript-material-ui)</title>
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
);

export default About;
