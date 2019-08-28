import React from 'react';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';

const Person = ({ data, status }) => {
  if (status === 200) {
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
              <td>{data.name}</td>
              <td>{data.height}</td>
              <td>{data.mass}</td>
              <td>{data.hair_color}</td>
              <td>{data.skin_color}</td>
              <td>{data.eye_color}</td>
              <td>{data.gender}</td>
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
      <p>{data.message}</p>
    </React.Fragment>
  );
};

Person.getInitialProps = async ({ query }) => {
  const response = await fetch(`http://localhost:8888/api/people/${query.id}`);
  const data = await response.json();
  return { data, status: response.status };
}

export default Person;
