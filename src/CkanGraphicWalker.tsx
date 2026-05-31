import React, { useState, useEffect, useRef } from "react";
import { GraphicWalker } from '@kanaries/graphic-walker';

/** Convert a #rgb / #rrggbb color to an rgba() string. Returns null if not hex. */
function hexToRgba(hex: string, alpha: number): string | null {
  if (!hex || hex[0] !== "#") return null;
  let h = hex.slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface CkanGraphicWalkerProps {
  /** CKAN API base URL */
  ckanUrl: string;
  /** Dataset ID to load */
  resourceID: string;
  /** Initial segment to show (vis, data, chat) */
  initialSegment?: "vis" | "data" | "chat";
  /** Custom timeout for data fetching */
  timeout?: number;
  /** Appearance theme; "media" follows the system preference. */
  appearance?: "media" | "light" | "dark";
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
  /**
   * Appearance of the main Data/Visualization tabs.
   * - "underline" (default): GraphicWalker's native underline style.
   * - "highlight": filled background highlight (tint derived from the theme's
   *   primary color, or `activeColor`).
   */
  tabStyle?: {
    variant?: "underline" | "highlight";
    /** Base color for the highlight (defaults to uiTheme.light.primary). */
    activeColor?: string;
    /** Opacity of the active-tab background tint (default 0.16). */
    activeOpacity?: number;
    /** Opacity of the hover background tint (default 0.08). */
    hoverOpacity?: number;
    /** Border radius of the tab (default "0.5rem"). */
    radius?: string;
  };
  /**
   * Any additional prop supported by `@kanaries/graphic-walker`'s GraphicWalker
   * — e.g. `hideProfiling`, `hideChartNav`, `hideSegmentNav`, `toolbar`,
   * `vizThemeConfig`, `experimentalFeatures`, `defaultRenderer`, `geographicData`.
   * Spread last, so it overrides the wrapper's defaults; lets consumers
   * configure anything the underlying library provides.
   */
  graphicWalkerProps?: Partial<React.ComponentProps<typeof GraphicWalker>>;
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
  tabStyle,
  graphicWalkerProps,
  onFieldsLoaded,
  onDataFetched,
  onError,
}) => {
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const storeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    // Reset to the loading state when the resource changes so GraphicWalker is
    // unmounted and never rendered with the previous resource's fields (which
    // causes a "(intermediate value) is not iterable" crash on resource switch).
    setLoading(true);
    setFields([]);
    console.log(`Fetching fields from CKAN resource ${resourceID} at ${ckanUrl}...`);
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

  // Apply the initial segment after GraphicWalker (re)mounts. Re-runs on
  // resourceID/loading change too, so switching resources doesn't fall back to
  // GraphicWalker's default (Visualization) segment.
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      if (storeRef.current) {
        storeRef.current.setSegmentKey(initialSegment);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [initialSegment, resourceID, loading]);

  // GraphicWalker renders inside a Shadow DOM, so external CSS can't reach its
  // main Data/Visualization tabs. Inject a small stylesheet into the shadow
  // root to render the active tab as a filled highlight (tint derived from the
  // theme's primary color) instead of the default underline.
  useEffect(() => {
    if (loading) return;
    // Opt-in: only restyle the tabs when "highlight" is requested.
    if (tabStyle?.variant !== "highlight") return;
    const base = tabStyle.activeColor || (uiTheme || defaultUiTheme).light.primary;
    const radius = tabStyle.radius ?? "0.5rem";
    const activeBg = hexToRgba(base, tabStyle.activeOpacity ?? 0.16) || "rgba(0, 0, 0, 0.06)";
    const hoverBg = hexToRgba(base, tabStyle.hoverOpacity ?? 0.08) || "rgba(0, 0, 0, 0.04)";
    const css = `
      [role="tab"].border-b-2 {
        border-radius: ${radius};
        margin-right: 0.25rem;
        border-bottom-color: transparent !important;
      }
      [role="tab"].border-b-2:hover { background-color: ${hoverBg}; }
      [role="tab"].border-b-2[data-state="active"] {
        background-color: ${activeBg} !important;
        border-bottom-color: transparent !important;
      }
    `;
    const STYLE_ID = "ckan-gw-tab-style";
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      const host = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>("*") || []
      ).find((el) => el.shadowRoot);
      const root = host?.shadowRoot;
      if (root) {
        if (!root.getElementById(STYLE_ID)) {
          const style = document.createElement("style");
          style.id = STYLE_ID;
          style.textContent = css;
          root.appendChild(style);
        }
        clearInterval(timer);
      } else if (attempts > 120) {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [loading, uiTheme, tabStyle]);

  const fetchRemoteData = async (payload: any, attempt = 0): Promise<any[]> => {
    const MAX_RETRIES = 3;
    try {
      const response = await fetch(`${ckanUrl}/api/3/action/dsl_query_data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceID: resourceID,
          payload: payload,
        }),
      });

      if (!response.ok) throw new Error(`Network response not ok (${response.status})`);

      let json = await response.json();

      onDataFetched?.(json.result.data);
      return json.result.data;
    } catch (error) {
      // GraphicWalker fires many concurrent "profiling" requests when the field
      // panel renders; some transiently fail (net::ERR_FAILED) under that load.
      // Returning [] crashes GraphicWalker (it reads result[0].count), so retry
      // with backoff before giving up.
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
        return fetchRemoteData(payload, attempt + 1);
      }
      onError?.(error as Error);
      return [];
    }
  };

  if (loading) {
    return <div>Loading fields...</div>;
  }

  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <GraphicWalker
        // Key + per-resource keepAlive ensure each resource gets its own fresh
        // store, so switching resources never reuses stale state.
        key={resourceID}
        computation={fetchRemoteData}
        computationTimeout={timeout}
        fields={fields}
        appearance={appearance}
        className={className}
        storeRef={storeRef}
        keepAlive={keepAlive === true ? resourceID : keepAlive}
        defaultConfig={defaultConfigValue}
        uiTheme={uiTheme || defaultUiTheme}
        {...graphicWalkerProps}
      />
    </div>
  );
};

export default CkanGraphicWalker;
