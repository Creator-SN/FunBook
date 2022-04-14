import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import { Client } from "@microsoft/microsoft-graph-client";
declare class User {
    private client;
    private msla;
    constructor(client: Client, mlsa: PublicClientApplication);
    login(): Promise<import("@azure/msal-browser").AuthenticationResult>;
    getProfile(): Promise<any>;
    getAvatarMetadata(): Promise<any>;
    getAvatar(): Promise<any>;
    getAccounts(): Promise<AccountInfo[]>;
    getActiveAccount(): Promise<AccountInfo>;
    setActiveAccount(account: AccountInfo): Promise<void>;
    logout(): Promise<void>;
}
declare const _default: {
    User: typeof User;
};
export default _default;
export { User };
