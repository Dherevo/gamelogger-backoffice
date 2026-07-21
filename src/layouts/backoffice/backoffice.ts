import { Component, Vue, toNative } from "vue-facing-decorator";
import { App, Popup, Avatar, Storage, EventListener, Store } from "lib";
import auth from "@/modules/auth";
import menuItems from "./menu-items";
import type { IMenuItem } from "./menu-items";
import TieredMenu from 'primevue/tieredmenu';
import MenuItem from './menu-item.vue';
import Breadcrumb from 'primevue/breadcrumb';

@Component({
    components: { Popup, Avatar, TieredMenu, MenuItem, Breadcrumb },
})
class Backoffice extends Vue {

    menuItems?: IMenuItem[];
    collapsed: boolean = false;
    breadcrumbs: { label: string, url: string }[] = [];
    loading: boolean = true;
    currentUser: { name: string, email: string, role: number } = { name: '', email: '', role: -1 };

    created() {
        this.collapsed = Storage.get('menu-collapsed');

        this.onInit(() => {
            this.loadBreadcrumbs();
        });

        auth.isLoggedIn()
            .then(() => auth.getUserInfo())
            .then((user: any) => {
                this.currentUser = {
                    name: user.name || user.username || '',
                    email: user.email || '',
                    role: user.role ?? -1,
                };
                Store.set('currentUser', this.currentUser);
                this.loading = false;
                this.checkRoutePermission(this.currentUser.role);
                menuItems(this).then(items => { this.menuItems = items; });
            })
            .catch(() => this.to('/login'));

        EventListener.on('breadcrumbs', 'setBreadcrumbs', (items: any[]) => {
            this.breadcrumbs = [{ label: '', url: '' }, ...items];
        });
    }

    checkRoutePermission(_role: number) {
        if (location.pathname.startsWith('/distributors')) {
            this.to('/patients');
        }
    }

    toggleMenu() {
        this.collapsed = !this.collapsed;
        Storage.set('menu-collapsed', this.collapsed);
    }

    loadBreadcrumbs() {
        this.breadcrumbs = [];
        const parts = location.pathname.split('/');
        let url = '';
        for (const part of parts) {
            if (part == 'admin') continue;
            if (part != '') url += '/' + part;
            this.breadcrumbs.push({ label: part, url });
        }
    }

    logout() {
        App.confirm('¿Estás seguro de que quieres cerrar la sesión?')
            .then((value: boolean) => {
                if (value) {
                    auth.logout().then(() => this.to('/login'));
                }
            });
    }

}
export default toNative(Backoffice);
