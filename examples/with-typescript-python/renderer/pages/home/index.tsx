import * as React from "react";
import { resolve } from "../../helpers";
import { css } from "./styles.css";

class Page extends React.Component {
  public render() {
    return (
      <div>
        <style>{css}</style>
        <div className="container">
          <h2>Home</h2>
          <ol>
            <li><a href={resolve("calculator")}>Open calculator page</a></li>
          </ol>
        </div>
      </div>
    );
  }
}

export default Page;
