import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Layout,
  Result,
} from 'antd';

const {
  Header,
  Content,
} = Layout;

function Next() {
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-javascript-ant-design)</title>
      </Head>
      <Header>
        <Link href="/home">
          <a>Go to home page</a>
        </Link>
      </Header>
      <Content style={{ padding: 48 }}>
        <Result
          status="success"
          title="Nextron"
          subTitle="with Ant Design"
        />
      </Content>
    </React.Fragment>
  );
};

export default Next;
