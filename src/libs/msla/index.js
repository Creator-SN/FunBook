"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
};
exports.__esModule = true;
exports.user = exports.onedrive = exports.msla = exports.client = void 0;
var msal_browser_1 = require("@azure/msal-browser");
var microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
var onedrive_1 = require("./onedrive");
var user_1 = require("./user");
var MSLA_CONFIG = {
    auth: {
        clientId: "04504778-db6b-4ac9-8685-94f3996766d4"
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
    },
    system: {
        loggerOptions: {
            loggerCallback: function (level, message, containsPii) {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case msal_browser_1.LogLevel.Error:
                        console.error(message);
                        return;
                    case msal_browser_1.LogLevel.Info:
                        console.info(message);
                        return;
                    case msal_browser_1.LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case msal_browser_1.LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};
var msla = new msal_browser_1.PublicClientApplication(MSLA_CONFIG);
exports.msla = msla;
var permission = ["User.Read", "Files.ReadWrite.All"];
var SlientProvider = {
    getAccessToken: function () { return __awaiter(void 0, void 0, void 0, function () {
        var accounts, result_1, _a, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    accounts = msla.getAllAccounts();
                    if (!(accounts.length > 0)) return [3 /*break*/, 5];
                    result_1 = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, msla.acquireTokenSilent({
                            scopes: permission
                        })];
                case 2:
                    result_1 = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    if (result_1 != null && result_1.expiresOn != null && result_1.expiresOn > new Date())
                        return [2 /*return*/, result_1.accessToken];
                    _b.label = 5;
                case 5: return [4 /*yield*/, msla.loginPopup({
                        scopes: permission
                    })];
                case 6:
                    result = _b.sent();
                    return [2 /*return*/, result.accessToken];
            }
        });
    }); }
};
var options = {
    authProvider: SlientProvider,
    debugLogging: true
};
var client = microsoft_graph_client_1.Client.initWithMiddleware(options);
exports.client = client;
var onedrive = new onedrive_1.OneDrive(client);
exports.onedrive = onedrive;
var user = new user_1.User(client, msla);
exports.user = user;
exports["default"] = { client: client, msla: msla, onedrive: onedrive, user: user };
__exportStar(require("./onedrive"), exports);
__exportStar(require("./user"), exports);
