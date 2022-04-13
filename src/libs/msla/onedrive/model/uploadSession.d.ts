import { ConflictBehavior } from "./conflictBehavior";
declare type uploadLargeFileSessionPayload = {
    item: {
        "@microsoft.graph.conflictBehavior": ConflictBehavior;
        description?: string;
        fileSystemInfo: {
            "@odata.type": "microsoft.graph.fileSystemInfo";
        };
        name: string;
    };
};
declare const defaultUploadLargeFileSessionPayLoad: uploadLargeFileSessionPayload;
export { uploadLargeFileSessionPayload, defaultUploadLargeFileSessionPayLoad };
declare const _default: {
    defaultUploadLargeFileSessionPayLoad: uploadLargeFileSessionPayload;
};
export default _default;
