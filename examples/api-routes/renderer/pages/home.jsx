import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import electron from 'electron';
import fetch from 'isomorphic-unfetch';
import Person from '../components/Person';

// prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

const Home = () => {
  const [people, setPeople] = useState([]);

  if (ipcRenderer) {
    useEffect(() => {
      const fn = async () => {
        const response = await fetch(`${ipcRenderer.sendSync('get-base-url')}/api/people`);
        if (response.status === 200) {
          setPeople(await response.json());
        }
      };
      fn();
    }, []);
  }

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (api-routes)</title>
      </Head>
      <ul>
        {people.map((person, index) => (
          <Person key={index} person={person} />
        ))}
      </ul>
    </React.Fragment>
  );
};

export default Home;
