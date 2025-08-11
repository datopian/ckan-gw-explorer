import React from "react";
export interface CkanGraphicWalkerProps {
    /** CKAN API base URL */
    ckanUrl: string;
    /** Dataset ID to load */
    datasetId: string;
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
    /** Disable WebSocket features (suppresses connection errors) */
    disableWebSocket?: boolean;
}
export declare const CkanGraphicWalker: React.FC<CkanGraphicWalkerProps>;
export default CkanGraphicWalker;
