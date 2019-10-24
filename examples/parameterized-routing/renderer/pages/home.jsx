import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const codec = require('json-url')('lzw');

const Home = ({ blogs, blogProps }) => {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (parameterized-routing)</title>
      </Head>
      <ul>
        {blogs.map((blog, i) => {
          return (
            <li key={i}>
              <Link href={`/blog?props=${blogProps[blog.id]}`}>
                <a>{blog.title}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </React.Fragment>
  );
};

Home.getInitialProps = async () => {
  // fetch blog data from the external api
  const blogs = [
    { id: 1, title: 'My first blog post' },
    { id: 2, title: 'My second blog post' },
    { id: 3, title: 'My last blog post' },
  ];
  const blogProps = {};
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    blogProps[blog.id] = await codec.compress(blog);
  }
  return {
    blogs,
    blogProps,
  };
};

export default Home;
