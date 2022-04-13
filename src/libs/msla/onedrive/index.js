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
exports.OneDrive = void 0;
var microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
var render_1 = require("../tools/render");
var model_1 = require("./model");
var OneDriveEndpoint = {
    MyDrive: "/me/drive",
    MyDriveRootInfo: "/me/drive/root",
    MyDriveRootChildren: "/me/drive/root/children",
    MyDriveItem: "/me/drive/items/${itemId}",
    MyDriveItemChildren: "/me/drive/items/${itemId}/children",
    MyDriveItemFile: "/me/drive/items/${itemId}/content",
    MyDriveItemUploadContent: "/me/drive/items/${parentItemId}:/${filename}:/content",
    MyDriveItemLargeFileContentSession: "/me/drive/items/${parentItemId}:/${filename}:/createUploadSession"
};
/**
 * OneDrive API
 */
var OneDrive = /** @class */ (function () {
    /**
     * Construct function
     * @param client Client Instance
     */
    function OneDrive(client) {
        this.client = client;
    }
    OneDrive.prototype.getMyDriveInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.api(OneDriveEndpoint.MyDrive).get()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OneDrive.prototype.getMyDriveRootInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.api(OneDriveEndpoint.MyDriveRootInfo).get()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OneDrive.prototype.getMyDriveRootChildren = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.api(OneDriveEndpoint.MyDriveRootChildren).get()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OneDrive.prototype.getMyDriveItemChildren = function (itemId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.api(render_1.StringRender.render(OneDriveEndpoint.MyDriveItemChildren, { itemId: itemId })).get()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OneDrive.prototype.getMyDriveItem = function (itemId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.api(render_1.StringRender.render(OneDriveEndpoint.MyDriveItem, { itemId: itemId })).get()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OneDrive.prototype.postMyDriveFolder = function (itemId, folder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (folder === undefined) {
                            folder = model_1.defaultFolder;
                        }
                        return [4 /*yield*/, this.client.api(render_1.StringRender.render(OneDriveEndpoint.MyDriveItemChildren, { itemId: itemId })).post(JSON.stringify(folder))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OneDrive.prototype.getMyDriveItemFile = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(item["@microsoft.graph.downloadUrl"] != undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.client.api(item["@microsoft.graph.downloadUrl"]).responseType(microsoft_graph_client_1.ResponseType.BLOB).get()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                }
            });
        });
    };
    OneDrive.prototype.deleteMyDriveItem = function (itemId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.api(render_1.StringRender.render(OneDriveEndpoint.MyDriveItem, { itemId: itemId }))["delete"]()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OneDrive.prototype.putMyDriveSmallFile = function (parentItemId, file) {
        return __awaiter(this, void 0, void 0, function () {
            var form;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (file.size > 4 * 1024 * 1024) {
                            throw new Error("file size must be less than 4 MB!");
                        }
                        form = new FormData();
                        form.append("file", file);
                        return [4 /*yield*/, this.client.api(render_1.StringRender.render(OneDriveEndpoint.MyDriveItemUploadContent, { parentItemId: parentItemId, filename: file.name })).put(form)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OneDrive.prototype.putMyDriveLargeFile = function (parentItemId, file, conflictBehavior, progress, description) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, session, fileObject, uploadEventHandlers, options, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = model_1.defaultUploadLargeFileSessionPayLoad;
                        payload.item.name = file.name;
                        if (description != undefined) {
                            payload.item.description = description;
                        }
                        if (conflictBehavior != undefined) {
                            payload.item["@microsoft.graph.conflictBehavior"] = conflictBehavior;
                        }
                        return [4 /*yield*/, microsoft_graph_client_1.LargeFileUploadTask.createUploadSession(this.client, render_1.StringRender.render(OneDriveEndpoint.MyDriveItemLargeFileContentSession, { parentItemId: parentItemId, filename: file.name }), payload)];
                    case 1:
                        session = _a.sent();
                        fileObject = new microsoft_graph_client_1.FileUpload(file, file.name, file.size);
                        if (progress == undefined) {
                            progress = function (range, extraCallbackParam) {
                                console.log(range, extraCallbackParam);
                            };
                        }
                        uploadEventHandlers = {
                            extraCallbackParam: file,
                            progress: progress
                        };
                        options = {
                            rangeSize: 1024 * 1024,
                            uploadEventHandlers: uploadEventHandlers
                        };
                        task = new microsoft_graph_client_1.LargeFileUploadTask(this.client, fileObject, session, options);
                        return [4 /*yield*/, task.upload()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return OneDrive;
}());
exports.OneDrive = OneDrive;
exports["default"] = { OneDrive: OneDrive };
__exportStar(require("./model"), exports);
