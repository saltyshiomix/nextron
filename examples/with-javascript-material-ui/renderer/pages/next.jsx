import React from 'react';
import Head from 'next/head';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '../components/Link';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    },
  })
);

function Next() {
  const classes = useStyles({});

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
          <Link href="/home">Go to the home page</Link>
        </Typography>
        <Button variant="contained" color="primary">
          Do nothing button
        </Button>
      </div>
    </React.Fragment>
  );
};

export default Next;
