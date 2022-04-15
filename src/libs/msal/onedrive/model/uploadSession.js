"use strict";
exports.__esModule = true;
exports.defaultUploadLargeFileSessionPayLoad = void 0;
var defaultUploadLargeFileSessionPayLoad = {
    item: {
        "@microsoft.graph.conflictBehavior": "rename",
        description: undefined,
        fileSystemInfo: { "@odata.type": "microsoft.graph.fileSystemInfo" },
        name: "new Item"
    }
};
exports.defaultUploadLargeFileSessionPayLoad = defaultUploadLargeFileSessionPayLoad;
exports["default"] = { defaultUploadLargeFileSessionPayLoad: defaultUploadLargeFileSessionPayLoad };
