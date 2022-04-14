import { PublicClientApplication } from "@azure/msal-browser";
import { Client } from "@microsoft/microsoft-graph-client";
import { OneDrive } from "./onedrive";
import { User } from "./user";
declare const msla: PublicClientApplication;
declare const client: Client;
declare const onedrive: OneDrive;
declare const user: User;
declare const _default: {
    client: Client;
    msla: PublicClientApplication;
    onedrive: OneDrive;
    user: User;
};
export default _default;
export { client, msla, onedrive, user };
export * from "./onedrive";
export * from "./user";
