import electron from 'electron';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

// prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

const Person = ({ id }) => {
  const [person, setPerson] = useState({});

  if (ipcRenderer) {
    useEffect(() => {
      const fn = async () => {
        const response = await fetch(`${ipcRenderer.sendSync('get-base-url')}/api/people/${id}`);
        if (response.status === 200) {
          setPerson(await response.json());
        }
      };
      fn();
    }, []);
  }

  if (person.id) {
    return (
      <React.Fragment>
        <Head>
          <title>Next - Nextron (api-routes)</title>
        </Head>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Height</th>
              <th>Mass</th>
              <th>Hair color</th>
              <th>Skin color</th>
              <th>Eye color</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{person.name}</td>
              <td>{person.height}</td>
              <td>{person.mass}</td>
              <td>{person.hair_color}</td>
              <td>{person.skin_color}</td>
              <td>{person.eye_color}</td>
              <td>{person.gender}</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <p>
          Back to{' '}
          <Link href="/home">
            <a>home</a>
          </Link>
        </p>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (api-routes)</title>
      </Head>
      <p>Not Found.</p>
    </React.Fragment>
  );
};

Person.getInitialProps = async ({ query: { id } }) => {
  return { id };
}

export default Person;
