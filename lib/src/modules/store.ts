import PackageState from "./PackageState";

export default class StoreClass {
    
    private createStore() {
        let obj = PackageState.get('store');
        if (obj) return obj;

        obj = {
            getters: {}
        }
        PackageState.set('store', obj);
        return obj;
    }

    public getter(key: string, loader?: () => Promise<any>) {

        let store : any = this.createStore();
        if (!store) {
            store = this.createStore();
        }

        if (!store.getters[key]) {
            store.getters[key] = {
                value: undefined,
                loader,
                listeners: [],
                errorListeners: [],
                status: 'none'
            }
        }
        else {
            store.getters[key].loader = loader;

            if (store.getters[key].listeners.length > 0) {
                this.get(key);
            }
        }

    }

    public has(key: string) : boolean {
        const store : any = this.createStore();
        if (!store) return false;
        return store.getters[key] ? true : false;
    }

    public clear(key:string) {

        const store : any = this.createStore();
        if (!store) return;

        if (store.getters[key]) {
            store.getters[key].value = undefined;
            store.getters[key].status = 'none';
        }
    }

    public clearAll() {
        const store : any = this.createStore();
        if (!store) return;

        Object.keys(store.getters)
        .forEach((k: string) => {
            this.clear(k);
        });
    }

    public reload(key: string) {
        this.clear(key);
        return this.get(key);
    }

    public set(key: string, value: any) {
        const store : any = this.createStore();

        if (store.getters[key]) {
            store.getters[key].value = value;
            return;
        }

        store.getters[key] = {
            value,
            loader: undefined,
            listeners: [],
            errorListeners: [],
            status: 'none'
        };
    }

    public getSync(key: string, defaultValue: any = undefined) {

        const store : any = this.createStore();
        if (!store) return defaultValue;
        if (!store.getters) return defaultValue;

        if (!store.getters[key]) {
            return defaultValue;
        }

        return store.getters[key].value;
    }

    public get(key:string, loader?: () => Promise<any>) {
        return new Promise((resolve, reject) => {

            let store : any = this.createStore();
            if (!store) {
                store = this.createStore();
            }

            if (!store.getters[key]) {
                this.getter(key, loader);
            }
            else if (loader) {
                store.getters[key].loader = loader;
            }
    
            const g = store.getters[key];

            if (g.value === undefined) {

                if ((g.status == 'none' && !g.loader) || g.status == 'loading') {
                    g.listeners.push(resolve);
                } else if (g.loader) {

                    g.status = 'loading';

                    g.loader()
                    .then((value: any) => {

                        g.status = 'loaded';
                        g.value = value;

                        g.listeners.push(resolve);
                        for(const r of g.listeners)
                            r(g.value);
                        g.listeners = [];

                    })
                    .catch(() => {
                        g.status = 'none';
                        g.value = undefined;

                        g.errorListeners.push(reject);
                        for(const r of g.errorListeners)
                            r();
                        g.errorListeners = [];
                    });

                }

            } else {

                g.listeners.push(resolve);

                for(const r of g.listeners)
                    r(g.value);
                
                g.listeners = [];

            }

        });
    }

    reactive(key: string, defaultValue: any = '') : {
        value: any
    } {
        const ref = this;

        const current = this.getSync(key);
        this.set(key, current ?? defaultValue);

        const obj : any = {
            value: this.getSync(key)
        }

        const proxy = new Proxy(obj, {
            get(target: any, prop: string) {
                if (prop != 'value') return undefined;
                const updated = ref.getSync(key);
                if (updated != target.value) {
                    target.value = updated;
                }
                return target.value;
            },
            set(target: any, prop: string, value: any) {
                if (prop != 'value') return false;
                target.value = value;
                ref.set(key, value);
                return true;
            }
        })

        if (!obj._val) {
            this.get(key)
            .then(value => {
                proxy.value = value;
            })
        }

        return proxy;
    }

}

const Store : StoreClass = new StoreClass();
export {
    Store
}