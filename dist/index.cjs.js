'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var graphicWalker = require('@kanaries/graphic-walker');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var CkanGraphicWalker = function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var _h = _a.ckanUrl, ckanUrl = _h === void 0 ? "http://localhost:5000" : _h, datasetId = _a.datasetId, _j = _a.initialSegment, initialSegment = _j === void 0 ? "data" : _j, _k = _a.timeout, timeout = _k === void 0 ? 1000000 : _k, _l = _a.appearance, appearance = _l === void 0 ? "light" : _l, _m = _a.className, className = _m === void 0 ? "ckan-gw-explorer" : _m, _o = _a.keepAlive, keepAlive = _o === void 0 ? true : _o, uiTheme = _a.uiTheme, defaultConfig = _a.defaultConfig, onFieldsLoaded = _a.onFieldsLoaded, onDataFetched = _a.onDataFetched, onError = _a.onError, _p = _a.disableWebSocket, disableWebSocket = _p === void 0 ? false : _p;
    var _q = react.useState([]), fields = _q[0], setFields = _q[1];
    var _r = react.useState(true), loading = _r[0], setLoading = _r[1];
    var storeRef = react.useRef(null);
    // Suppress WebSocket errors if disabled
    react.useEffect(function () {
        if (disableWebSocket) {
            var originalError_1 = console.error;
            console.error = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (args[0] &&
                    typeof args[0] === "string" &&
                    args[0].includes("WebSocket")) {
                    // Suppress WebSocket connection errors
                    return;
                }
                originalError_1.apply(console, args);
            };
            return function () {
                console.error = originalError_1;
            };
        }
    }, [disableWebSocket]);
    // Default UI theme
    var defaultUiTheme = {
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
    var defaultConfigValue = {
        config: __assign({ limit: 1000, geoms: ["auto"], coordSystem: "generic", defaultAggregated: true }, defaultConfig === null || defaultConfig === void 0 ? void 0 : defaultConfig.config),
        layout: {
            size: {
                mode: (((_c = (_b = defaultConfig === null || defaultConfig === void 0 ? void 0 : defaultConfig.layout) === null || _b === void 0 ? void 0 : _b.size) === null || _c === void 0 ? void 0 : _c.mode) || "full"),
                width: ((_e = (_d = defaultConfig === null || defaultConfig === void 0 ? void 0 : defaultConfig.layout) === null || _d === void 0 ? void 0 : _d.size) === null || _e === void 0 ? void 0 : _e.width) || 800,
                height: ((_g = (_f = defaultConfig === null || defaultConfig === void 0 ? void 0 : defaultConfig.layout) === null || _f === void 0 ? void 0 : _f.size) === null || _g === void 0 ? void 0 : _g.height) || 600,
            },
        },
    };
    react.useEffect(function () {
        fetch("".concat(ckanUrl, "/api/3/action/show_dsl_metadata?datasetId=").concat(datasetId, "&sort=true"))
            .then(function (response) { return response.json(); })
            .then(function (data) {
            console.log("Loaded fields:", data.result.schema);
            setFields(data.result.schema);
            setLoading(false);
            onFieldsLoaded === null || onFieldsLoaded === void 0 ? void 0 : onFieldsLoaded(data.result.schema);
        })
            .catch(function (error) {
            console.error("Error loading fields:", error);
            setLoading(false);
            onError === null || onError === void 0 ? void 0 : onError(error);
        });
    }, [ckanUrl, datasetId, onFieldsLoaded, onError]);
    // Set initial segment
    react.useEffect(function () {
        if (storeRef.current && !loading) {
            storeRef.current.setSegmentKey(initialSegment);
        }
    }, [loading, initialSegment]);
    var fetchRemoteData = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
        var response, json, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(ckanUrl, "/api/3/action/dsl_query_data"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                datasetId: datasetId,
                                payload: payload,
                            }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("Network response not ok");
                    return [4 /*yield*/, response.json()];
                case 2:
                    json = _a.sent();
                    onDataFetched === null || onDataFetched === void 0 ? void 0 : onDataFetched(json.result.data);
                    return [2 /*return*/, json.result.data];
                case 3:
                    error_1 = _a.sent();
                    onError === null || onError === void 0 ? void 0 : onError(error_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return jsxRuntime.jsx("div", { children: "Loading fields..." });
    }
    return (jsxRuntime.jsx(graphicWalker.GraphicWalker, { computation: fetchRemoteData, computationTimeout: timeout, fields: fields, appearance: appearance, className: className, storeRef: storeRef, keepAlive: keepAlive, defaultConfig: defaultConfigValue, uiTheme: uiTheme || defaultUiTheme }));
};

exports.CkanGraphicWalker = CkanGraphicWalker;
//# sourceMappingURL=index.cjs.js.map
