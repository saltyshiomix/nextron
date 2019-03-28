import React from 'react';
import Head from 'next/head';
import { BasicCard } from '../components/BasicCard';
import { TitleCard } from '../components/TitleCard';
import { bounce, AnimatedCard } from '../components/AnimatedCard';
import { resolve } from '../helpers';

export default () => {
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-javascript-emotion)</title>
      </Head>
      <div>
        <TitleCard>
          Nextron with Emotion
        </TitleCard>
        <BasicCard>
          <a href={resolve('home')}>Go to home page</a>
        </BasicCard>
        <AnimatedCard animation={bounce}>
          Let's bounce.
        </AnimatedCard>
      </div>
    </React.Fragment>
  )
}
