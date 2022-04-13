import { PublicClientApplication } from "@azure/msal-browser";
import { Client } from "@microsoft/microsoft-graph-client";
declare const msla: PublicClientApplication;
declare const client: Client;
declare const _default: {
    client: Client;
    msla: PublicClientApplication;
};
export default _default;
export { client, msla };
export * from "./onedrive";
