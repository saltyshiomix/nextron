import React from 'react';
import Head from 'next/head';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '../components/Link';
import {styled} from '@mui/material';

const Root = styled('div')(({theme}) => {
    return {
        textAlign: 'center',
        paddingTop: theme.spacing(4),
    };
});


function Next() {

    return (
        <React.Fragment>
            <Head>
                <title>Next - Nextron (with-typescript-material-ui)</title>
            </Head>
            <Root>
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
            </Root>
        </React.Fragment>
    );
};

export default Next;
