import React from 'react';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import Person from '../components/Person';

const Home = ({ people }) => (
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

Home.getInitialProps = async () => {
  const response = await fetch('http://localhost:8888/api/people');
  const people = await response.json();
  return { people };
};

export default Home;
