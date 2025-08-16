import React, { useState, useEffect, useRef } from "react";
import { GraphicWalker } from '@kanaries/graphic-walker';

export interface CkanGraphicWalkerProps {
  /** CKAN API base URL */
  ckanUrl: string;
  /** Dataset ID to load */
  resourceID: string;
  /** Initial segment to show (vis, data, chat) */
  initialSegment?: "vis" | "data" | "chat";
  /** Custom timeout for data fetching */
  timeout?: number;
  /** Custom appearance theme */
  appearance?: "light" | "dark";
  /** Custom CSS class name */
  className?: string;
  /** Keep component alive between renders */
  keepAlive?: boolean;
  /** Custom UI theme configuration */
  uiTheme?: {
    light: {
      background: string;
      foreground: string;
      primary: string;
      "primary-foreground": string;
      muted: string;
      "muted-foreground": string;
      border: string;
      ring: string;
    };
    dark: {
      background: string;
      foreground: string;
      primary: string;
      "primary-foreground": string;
      muted: string;
      "muted-foreground": string;
      border: string;
      ring: string;
    };
  };
  /** Default configuration for GraphicWalker */
  defaultConfig?: {
    config?: {
      limit?: number;
      geoms?: string[];
      coordSystem?: "generic" | "geographic";
      defaultAggregated?: boolean;
    };
    layout?: {
      size?: {
        mode?: "auto" | "fixed" | "full";
        width?: number;
        height?: number;
      };
    };
  };
  /** Callback when fields are loaded */
  onFieldsLoaded?: (fields: any[]) => void;
  /** Callback when data is fetched */
  onDataFetched?: (data: any[]) => void;
  /** Callback for errors */
  onError?: (error: Error) => void;
}

export const CkanGraphicWalker: React.FC<CkanGraphicWalkerProps> = ({
  ckanUrl = "http://localhost:5000",
  resourceID,
  initialSegment = "data",
  timeout = 1000000,
  appearance = "light",
  className = "ckan-gw-explorer",
  keepAlive = true,
  uiTheme,
  defaultConfig,
  onFieldsLoaded,
  onDataFetched,
  onError,
}) => {
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const storeRef = useRef<any>(null);

  // Default UI theme
  const defaultUiTheme = {
    light: {
      background: "white",
      foreground: "#333",
      primary: "#007bff",
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
  };

  // Default configuration
  const defaultConfigValue = {
    config: {
      limit: 1000,
      geoms: ["auto"],
      coordSystem: "generic" as const,
      defaultAggregated: true,
      ...defaultConfig?.config,
    },
    layout: {
      size: {
        mode: (defaultConfig?.layout?.size?.mode || "full") as
          | "auto"
          | "fixed"
          | "full",
        width: defaultConfig?.layout?.size?.width || 800,
        height: defaultConfig?.layout?.size?.height || 600,
      },
    },
  };

  useEffect(() => {
    fetch(
      `${ckanUrl}/api/3/action/show_dsl_metadata?resourceID=${resourceID}&sort=true`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Loaded fields:", data.result.schema);
        setFields(data.result.schema);
        setLoading(false);
        onFieldsLoaded?.(data.result.schema);
      })
      .catch((error) => {
        console.error("Error loading fields:", error);
        setLoading(false);
        onError?.(error);
      });
  }, [ckanUrl, resourceID, onFieldsLoaded, onError]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (storeRef.current) {
        storeRef.current.setSegmentKey(initialSegment);
        clearInterval(interval); 
      }
    }, 50);
    return () => clearInterval(interval); 
  }, [initialSegment]);

  const fetchRemoteData = async (payload: any) => {
    try {
      const response = await fetch(`${ckanUrl}/api/3/action/dsl_query_data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceID: resourceID,
          payload: payload,
        }),
      });

      if (!response.ok) throw new Error("Network response not ok");

      let json = await response.json();

      onDataFetched?.(json.result.data);
      return json.result.data;
    } catch (error) {
      onError?.(error as Error);
      return [];
    }
  };

  if (loading) {
    return <div>Loading fields...</div>;
  }

  return (
    <GraphicWalker
      computation={fetchRemoteData}
      computationTimeout={timeout}
      fields={fields}
      appearance={appearance}
      className={className}
      storeRef={storeRef}
      keepAlive={keepAlive}
      defaultConfig={defaultConfigValue}
      uiTheme={uiTheme || defaultUiTheme}
    />
  );
};

export default CkanGraphicWalker;
