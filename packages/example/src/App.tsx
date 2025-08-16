import React from "react";
import { CkanGraphicWalker } from "ckan-gw-explorer";

function App(props: React.ComponentProps<typeof CkanGraphicWalker>) {
  return (
      <div className="app-gw-dataexplorer">
        <CkanGraphicWalker
          className="gw-dataexplorer"
          initialSegment="data"
          uiTheme={{
            light: {
              background: "white",
              foreground: "#333",
              primary: "#206b82",
              "primary-foreground": "white",
              muted: "#f8f9fa",
              "muted-foreground": "#6c757d",
              border: "#dee2e6",
              ring: "#007bff",
            },
            dark: {
              background: "#1a1a1a",
              foreground: "#ffffff",
              primary: "#007bff",
              "primary-foreground": "white",
              muted: "#2d2d2d",
              "muted-foreground": "#a0a0a0",
              border: "#404040",
              ring: "#007bff",
            },
          }}
          {...props}
        />
      </div>
);
}

export default App;
