import Config from "./config";

export default class StorageClass {

    set (key: string, value: any) {

        const sk : string = Config.get('storageKey', '');
        const finalKey = `${sk}_${key}`;

        if (typeof value === 'string')
            window.localStorage.setItem(finalKey, value);
        else if (typeof value == 'object' || Array.isArray(value)) {
            window.localStorage.setItem(finalKey, JSON.stringify(value));
        } else {
            window.localStorage.setItem(finalKey, "" + value);
        }

    }

    get (key: string, defaultValue: any = undefined) {

        const sk : string = Config.get('storageKey', '');
        const finalKey = `${sk}_${key}`;

        const value = window.localStorage.getItem(finalKey);
        if (value === null || value === undefined) return defaultValue;

        try {
            const val = JSON.parse(value);
            return val;
        } catch (e) {
            return value;
        }

    }

    remove (key: string) {
        const sk : string = Config.get('storageKey', '');
        const finalKey = `${sk}_${key}`;
        window.localStorage.removeItem(finalKey);
    }

    clear () {
        window.localStorage.clear();
    }

}

const Storage = new StorageClass();
export {
    Storage
}