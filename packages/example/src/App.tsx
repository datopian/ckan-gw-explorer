import React from "react";
import { CkanGraphicWalker } from "ckan-gw-explorer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>CKAN Graphic Walker Explorer - Example App</h1>
        <p>This example app demonstrates the CkanGraphicWalker component</p>
      </header>
      <main className="App-main">
        <div className="component-demo">
          <div className="component-container">
            <CkanGraphicWalker
              ckanUrl="http://ckan.com"
              datasetId="012474d1-7506-469d-926f-0e7a3d9aa41a"
              appearance="light"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
