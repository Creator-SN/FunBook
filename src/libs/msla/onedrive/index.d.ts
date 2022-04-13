import { Client, Range, UploadResult } from "@microsoft/microsoft-graph-client";
import { ConflictBehavior, Folder } from "./model";
/**
 * OneDrive API
 */
declare class OneDrive {
    private client;
    /**
     * Construct function
     * @param client Client Instance
     */
    constructor(client: Client);
    getMyDriveInfo(): Promise<any>;
    getMyDriveRootInfo(): Promise<any>;
    getMyDriveRootChildren(): Promise<any>;
    getMyDriveItemChildren(itemId: string): Promise<any>;
    getMyDriveItem(itemId: string): Promise<any>;
    postMyDriveFolder(itemId: string, folder?: Folder): Promise<any>;
    getMyDriveItemFile(item: any): Promise<any>;
    deleteMyDriveItem(itemId: string): Promise<void>;
    putMyDriveSmallFile(parentItemId: string, file: File): Promise<any>;
    putMyDriveLargeFile(parentItemId: string, file: File, conflictBehavior?: ConflictBehavior, progress?: (range?: Range, extraCallbackParam?: unknown) => void, description?: string): Promise<UploadResult>;
}
declare const _default: {
    OneDrive: typeof OneDrive;
};
export default _default;
export { OneDrive };
export * from "./model";
