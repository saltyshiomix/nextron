import React from 'react';
import Link from 'next/link';
import {
  Layout,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Slider,
  Button,
} from 'antd';

const {
  Header,
  Content,
} = Layout;
const { Item: FormItem } = Form;
const { Option } = Select;

function Home() {
  return (
    <React.Fragment>
      <Header>
        <Link href="/next">
          <a>Go to next page</a>
        </Link>
      </Header>

      <Content style={{ padding: 48 }}>
        <Form layout='horizontal'>
          <FormItem
            label='Input Number'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <InputNumber size='large' min={1} max={10} style={{ width: 100 }} defaultValue={3} name='inputNumber' />
            <a href='#'>Link</a>
          </FormItem>

          <FormItem
            label='Switch'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Switch defaultChecked />
          </FormItem>

          <FormItem
            label='Slider'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Slider defaultValue={70} />
          </FormItem>

          <FormItem
            label='Select'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Select size='large' defaultValue='lucy' style={{ width: 192 }}>
              <Option value='jack'>jack</Option>
              <Option value='lucy'>lucy</Option>
              <Option value='disabled' disabled>disabled</Option>
              <Option value='yiminghe'>yiminghe</Option>
            </Select>
          </FormItem>

          <FormItem
            label='DatePicker'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <DatePicker name='startDate' />
          </FormItem>
          <FormItem
            style={{ marginTop: 48 }}
            wrapperCol={{ span: 8, offset: 8 }}
          >
            <Button size='large' type='primary' htmlType='submit'>
              OK
            </Button>
            <Button size='large' style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </FormItem>
        </Form>
      </Content>
    </React.Fragment>
  );
};

export default Home;
