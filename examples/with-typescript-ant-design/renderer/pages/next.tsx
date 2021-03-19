import React from 'react';
import Link from 'next/link';
import {
  Layout,
  Result,
} from 'antd';

const {
  Header,
  Content,
} = Layout;

const Next = () => {
  return (
    <React.Fragment>

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
