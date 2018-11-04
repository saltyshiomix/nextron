import * as React from "react";
console.log("TODO DEBUG if I import zerorpc here the client code fails silently (server is fine)");
import * as zerorpc from "zerorpc"; // tslint:disable-line
console.log("TODO DEBUG Past import of zerorpc");
import { resolve } from "../../helpers";
import { css } from "./styles.css";

class CalculatorPage extends React.Component {

  public resultDiv:HTMLDivElement;

  public client:any;

  public componentDidMount() {
    //
    // NOTE componentDidMount is only called on the client
    //
    console.log("TODO DEBUG in calc componentDidMount");
    console.log(zerorpc);
    console.log("TODO DEBUG uncomment the following code once zerorpc runs on the client");
    // client = new zerorpc.Client();
    // client.connect("tcp://127.0.0.1:4242");
    // client.invoke("echo", "server is ready", (error, res) => {
    //   if (error) {
    //     console.error(error);
    //   } else {
    //     console.log(res);
    //   }
    // });
  }
  public render() {
    return (
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
    );
  }

  private handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      this.client.invoke("calc", event.currentTarget.value, (error, res) => {
        if (error) {
          console.error(error);
        } else {
          this.resultDiv.textContent = res;
        }
      });
    }
  }
}

export default CalculatorPage;
