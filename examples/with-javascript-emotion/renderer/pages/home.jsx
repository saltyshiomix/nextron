import React from 'react';
import Head from 'next/head';
import { BasicCard } from '../components/BasicCard';
import { TitleCard } from '../components/TitleCard';
import { HoverableCard } from '../components/HoverableCard';
import { resolve } from '../helpers';

export default () => {
  return (
    <React.Fragment>
      <Head>
        <title>Nextron with Emotion</title>
      </Head>
      <div>
        <TitleCard>
          Nextron with Emotion
        </TitleCard>
        <BasicCard>
          <a href={resolve('next')}>Go to Next Page</a>
        </BasicCard>
        <HoverableCard>
          With <code>:hover</code>.
        </HoverableCard>
      </div>
    </React.Fragment>
  )
}
