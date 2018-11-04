import * as React from "react";
import { resolve } from "../../helpers";
import { css } from "./styles.css";

class Page extends React.Component {

  public componentDidMount() {
    console.log("in home componentDidMount");
  }
  
  public render() {
    return (
      <div>
        <style>{css}</style>
        <div className="container">
          <h2>Home</h2>
          <ol>
            <li><a href={resolve("calculator")}>Calculator</a></li>
            <li><a href={resolve("next")}>Next</a></li>
          </ol>
        </div>
      </div>
    );
  }
}

export default Page;
