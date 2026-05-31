import React from "react";
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
export declare const CkanGraphicWalker: React.FC<CkanGraphicWalkerProps>;
export default CkanGraphicWalker;
