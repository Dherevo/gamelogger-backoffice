import { IAppConfig } from "lib";

const env = (import.meta as any).env;

const config: IAppConfig = {

    api: {
        url: env._API_URL,
        documentation: ''
    },

    identity: {
        url: env._IDENTITY_URL,
        client_id: env._IDENTITY_CLIENT_ID,
    },

    storageKey: 'web',
    disableSvgIconsCache: false,

    time: {
        date: 'DD/MM/YYYY',
        time: 'HH:mm',
    }
}
export default config;
