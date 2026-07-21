import Time from "./time";
import utils from "./utils";
import 'reflect-metadata';

function Parse(className: any) {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata('model:parse', className, target, propertyKey);
    }
}

function ParseArray(className: any) {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata('model:parsearray', className, target, propertyKey);
    }
}

function NoExport() {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata('model:noexport', true, target, propertyKey);
    }
}

function ExportAs(transformOrName : string | ((v: any, item: any) => any), transform?: (v: any, item: any) => any) {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata('model:exportas', {
            name: typeof transformOrName == 'string' ? transformOrName : propertyKey,
            transform: transform ?? 
                (typeof transformOrName == 'function' ? 
                    transformOrName : 
                    (v => {
                        if (!v) return null;
                        if (typeof transformOrName != 'string'
                            || !transformOrName.includes('_')
                        ) return v;

                        const parts = transformOrName.split('_');
                        const prop : string = parts.pop() as string;
                        if (v[prop]) return v[prop];
                        return v;
                    })
                )
        }, target, propertyKey);
    }
}

function ExportIf(condition: (v: any, item: any) => boolean) {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata('model:exportif', condition, target, propertyKey);
    }
}

export { Parse, ParseArray, NoExport, ExportAs, ExportIf };

export default class Model {

    private _original: any;

    constructor(_apiResponse?: any) { }

    import(api?: any, exceptions?: { [key: string]: (v?: any) => any }) {
        if (!api) return;

        const exc = utils.copy(exceptions);
        const props: any = Object.getOwnPropertyNames(this)

        Object.keys(api)
            .forEach((k: string) => {

                if (!props.includes(k)) {
                    delete props[k];
                    return;
                }
                delete props[k];

                if (exc && exc[k]) {
                    (this as any)[k] = exc[k](api[k]);
                    delete exc[k];
                    return;
                }

                let v = api[k];
                if (v) {
                    const parse = Reflect.getMetadata('model:parse', this, k);

                    if (parse) {
                        v = new parse(v);
                    }
                    else {

                        const parseArray = Reflect.getMetadata('model:parsearray', this, k);
                        if (parseArray) {
                            v = v.map((item: any) => new parseArray(item));
                        }
                    }
                }

                if (typeof v == 'string') {
                    v = v.trim();
                }

                (this as any)[k] = v;
            })

        Object.keys(exc)
            .forEach((k: string) => {
                (this as any)[k] = exc[k](undefined);
            })

    }

    saveCurrentState() {
        this._original = this.makeCopy();
    }

    hasChanged(property?: string) {
        if (!this._original) return false;
        if (!property) return !this.isEqualTo(this._original);
        return utils.areEqual((this as any)[property], (this._original as any)[property]);
    }

    restoreOriginalState() {
        if (!this._original) return;
        
        let props = Object.getOwnPropertyNames(this);
        for (const k of props) {
            if (k[0] == '_') continue;
            (this as any)[k] = (this._original as any)[k];
        }

        props = Object.getOwnPropertyNames(this._original);
        for (const k of props) {
            if (k[0] == '_') continue;
            (this as any)[k] = (this._original as any)[k];
        }

        this._original = undefined;
    }

    makeCopy() {
        const copy = Object.create(Object.getPrototypeOf(this));
        try {
            Object.assign(copy, structuredClone(this));
        } catch (e) {
            Object.assign(copy, this);
        }

        for (const k of Object.keys(copy)) {
            const current = (this as any)[k];
            if (!current) continue;

            if (Array.isArray(current)) {
                const arr: any[] = utils.copyArray(current);
                (copy as any)[k] = arr;
            }
            if (current.makeCopy) {
                (copy as any)[k] = current.makeCopy();
            }
        }

        return copy;
    }

    private _convertExportValue(v: any) {
        if (!v) return v;
        if (Array.isArray(v)) {
            const arr: any[] = [];
            for (const item of v) {
                arr.push(this._convertExportValue(item));
            }
            return arr;
        }
        if (typeof v == 'object' && v instanceof Time) {
            return v.toString();
        }
        if (typeof v == 'object' && v.export) {
            return v.export();
        }
        if (typeof v == 'string') {
            return v.trim();
        }
        return v;
    }

    export(exceptions: { [key: string]: (v?: any) => any } = {}, nullTreatment: 'includeNulls' | 'ignoreNulls' | 'nullsAsEmptyString' = 'includeNulls') {

        const exc: any = utils.copy(exceptions);
        const obj: any = {}

        const props = Object.getOwnPropertyNames(this)
        props.forEach((k: string) => {

            const noexport = Reflect.getMetadata('model:noexport', this, k);
            if (noexport) return;

            const exportif = Reflect.getMetadata('model:exportif', this, k);
            if (exportif && !exportif((this as any)[k], this)) {
                return;
            }

            if (k.length > 1 && k[0] == '_') return;

            let val: any = (this as any)[k];

            if (exc && exc[k]) {
                val = exceptions[k]((this as any)[k]);
            }

            const exportAs = Reflect.getMetadata('model:exportas', this, k);
            if (exportAs) {
                obj[exportAs.name] = exportAs.transform((this as any)[k], this);
                return;
            }
            else {
                if (val === undefined) return;
                if (val === null) {
                    if (nullTreatment == 'ignoreNulls') return;
                    if (nullTreatment == 'nullsAsEmptyString') val = '';
                }
                val = this._convertExportValue(val);
            }

            if (typeof val == 'string') {
                val = val.trim();
            }

            obj[k] = val;

            delete exc[k];
        });

        Object.keys(exc)
            .forEach((k: string) => {
                obj[k] = exc[k]();

                if (obj[k] === undefined) {
                    delete obj[k];
                }

            });

        return obj;
    }

    isEqualTo(other: Model, debug: boolean = false) {
        const me = (this as any)
        const otherObj = (other as any)

        const keysMe = Object.keys(me).filter(k => k[0] != '_');
        const keysOther = Object.keys(other).filter(k => k[0] != '_');

        const log = (...args: any[]) => {
            if (debug) {
                console.log(...args);
            }
        }

        if (keysMe.length != keysOther.length) {
            log("Not equal: keysMe.length != keysOther.length", keysMe, keysOther);
            return false;
        }

        for (const k of keysMe) {
            if (!otherObj.hasOwnProperty(k)) {
                log("Not equal: otherObj[k] === undefined", k, otherObj);
                return false;
            }
        }
        for (const k of keysOther) {
            if (!me.hasOwnProperty(k)) {
                log("Not equal: me[k] === undefined", k, me);
                return false;
            }
        }

        for (const k of keysMe) {
            const valMe = me[k];
            const valOther = otherObj[k];

            if (!utils.areEqual(valMe, valOther)) {
                log("Not equal: utils.areEqual(valMe, valOther)", k, valMe, valOther);
                return false;
            }
        }

        return true;
    }

}