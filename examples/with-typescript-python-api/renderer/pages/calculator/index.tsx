import React from 'react';
import Head from 'next/head';
import gql from 'graphql-tag';
import { resolve } from '../../helpers';
import { getAppGlobalClient } from '../_app';
import { css } from './styles.css';

class CalculatorPage extends React.Component {

  public resultDiv:HTMLDivElement;

  public render() {
    return (
      <React.Fragment>
        <Head>
          <title>Calculator - Nextron (with-typescript-python-api)</title>
        </Head>

        <div>
          <style>{css}</style>
          <div className="container">
            <h2>Calculator</h2>
            <ol>
              <li><a href={resolve("home")}>Home</a></li>
            </ol>
            <h1>Hello Calculator!</h1>
            <p>Input something like <code>1 + 1</code>.</p>
            <p>
              This calculator supports <code>+-*/^()</code>,
              whitespaces, and integers and floating numbers.
            </p>
            <input
              style={{ color:"black" }}
              onKeyDown={this.handleKeyDown}
            />
            <div ref={(elem) => this.resultDiv = elem}/>
          </div>
        </div>
      </React.Fragment>
    );
  }

  private handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const math = event.currentTarget.value;
      getAppGlobalClient().query({
        query:gql`query calc($math:String!) {
          calc(math:$math)
        }`,
        variables: {
          math,
        },
      }).then(({ data }) => {
        this.resultDiv.textContent = (data as any).calc;
      });
    }
  }
}

export default CalculatorPage;
