import electron from 'electron';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import Person from '../components/Person';

// prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

const Home = () => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    // componentDidMount()
    if (ipcRenderer) {
      const fn = async () => {
        const response = await fetch(`${ipcRenderer.sendSync('get-base-url')}/api/people`);
        if (response.status === 200) {
          setPeople(await response.json());
        }
      };
      fn();
    }

    return () => {
      // componentWillUnmount()
      if (ipcRenderer) {
        // unregister it
        ipcRenderer.removeAllListeners('ping-pong');
      }
    };
  }, []);

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
