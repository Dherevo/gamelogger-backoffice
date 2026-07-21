import { ComponentOptions, getCurrentInstance, toHandlerKey } from 'vue';
import { hyphenate, camelize } from '@vue/shared';
import translate from '../modules/translator';
import Utils, { UtilsType } from '../modules/utils';
import StorageClass, { Storage } from '../modules/storage';
import Config from '../modules/config';
import StoreClass, { Store } from '../modules/store';
import PackageState from '../modules/PackageState';
import Validator from '../modules/validator';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $app: any,
        $config: any,
        $store: StoreClass,
        $storage: StorageClass,
        $utils: UtilsType,
        $console: any,
        $window: any,
        $alert: any,
        $typeof: (value: any) => string,
        $t: (key: string, params?: any) => any,
        hasEvent: (name: string) => boolean,
        hasSlot: (name?: string) => boolean,
        to: (page: string) => void,
        back: () => void,
        ref: (name: string) => any,
        loadButton: (name: string, loading?: boolean) => void,
        closeModal: () => void,
        closeDrawer: () => void,
        onInit: (action: () => void) => void,
        onRouteChanged: (listener: (route: string) => void) => void,
    }
}

export default (App: any) => {

    const cmp : ComponentOptions = {

        data() {
            return {
                _onRouteChangeListeners: []
            }
        },
    
        mounted() {
            (window as any)['router'] = this.$router;
            const meta = import.meta as any;

            if (meta.hot) {
                // Accept hot updates for this component
                meta.hot.accept();
                
                // Optional: React to updates, for example, by re-executing the created() method
                meta.hot.on("update", () => {
                  this.created();
                });
            }
        },
    
        computed: {
            $app() {
                return App;
            },
            appVersion() {
                return PackageState.get('version');
            },
            $config() {
                return Config.values();
            },
            $store() : StoreClass {
                return Store;
            },
            $utils() : UtilsType {
                return Utils;
            },
            $storage() : StorageClass {
                return Storage;
            },
            $lang() : any {
                return translate;
            },
            $alert() : any {
                return window.alert
            },
            $window() : any {
                return window
            },
            $console() : any {
                return window.console
            }
        },

        watch: {
            $route() {
                for (const listener of this._onRouteChangeListeners) {
                    listener(this.$route.path);
                }
                this.$forceUpdate();
            }
        },
    
        methods: {

            onInit(action: () => void) {
                action();
                this.onRouteChanged(action);
            },

            onRouteChanged(listener: (route: string) => void) {
                this._onRouteChangeListeners.push(listener);
            },

            $typeof(value: any) : string {
                const t = typeof value;
                if (t == 'object' && value.constructor) {
                    return value.constructor.name;
                }
                return t;
            },
    
            $t(key: string, params?: any) : string {
                return translate.get(key, params);
            },

            hasSlot(name: string = 'default') : boolean {
                return !!this.$slots[name];
            },

            hasEvent(name: string) : boolean {
                const instance = getCurrentInstance();
                const props = instance?.vnode.props;
                const isModelListener = name.startsWith('update:')
                if (!props) return false

                let handler =
                    props[toHandlerKey(name)] ||
                    // also try camelCase event handler (#2249)
                    props[toHandlerKey(camelize(name))];

                if (!handler && isModelListener) {
                    handler = props[toHandlerKey(hyphenate(name))]
                }

                return Boolean(handler);
            },
    
            to(page: string) {
                const current = location.pathname;
                let newPath = page;
                if (newPath.includes('?')) {
                    newPath = newPath.split('?')[0];
                }

                if (current == newPath) {
                    location.href = page;
                }
                else {
                    this.$router.push(page);
                }
            },
    
            back(attempt = 0) {
                this.$router.back();
                const currentPath = location.pathname;

                const a = typeof attempt == 'number' ? attempt : 0;
                if (a >= 10) return;

                setTimeout(() => {
                    const newPath = location.pathname;

                    if (currentPath == newPath) {
                        this.back(a + 1);
                    }
                }, 10)
            },
    
            ref(name: string) : any {
                return this.$refs[name] as any;
            },

            loadButton(name: string, loading: boolean = true) {
                const btn = this.$refs[name] as any;
                if (!btn) return;
                try {
                    if (loading) btn.startLoading();
                    else btn.stopLoading();
                } catch(e) {
                    console.error(e);
                }
            },
    
            closeModal() {
                return App.modal.close();
            },
    
            closeDrawer() {
                return App.drawer.close();
            },

            validatorFor(value: any) : Validator {
                return Validator.for(value);
            },

            param(name: string) : string {
                return (this as any).$route.params[name] ?? '';
            }
        }
    }
    return cmp;
}