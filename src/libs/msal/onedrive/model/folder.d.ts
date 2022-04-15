import { ConflictBehavior } from "./conflictBehavior";
/**
 * OneDrive Folder Create Model
 */
declare type Folder = {
    name: string;
    folder: any;
    "@microsoft.graph.conflictBehavior": ConflictBehavior;
};
/**
 * Folder with default value
 */
declare const defaultFolder: Folder;
export { Folder, defaultFolder };
declare const _default: {
    defaultFolder: Folder;
};
export default _default;
