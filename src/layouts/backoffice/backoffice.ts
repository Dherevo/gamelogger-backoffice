import { Component, Vue, toNative } from "vue-facing-decorator";
import { App, Popup, Avatar, Storage, EventListener, Store, $t } from "lib";
import auth from "@/modules/auth";
import userStore from "@/modules/userStore";
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
    currentUser: { name: string, email: string } = { name: '', email: '' };

    created() {
        this.collapsed = Storage.get('menu-collapsed');

        this.onInit(() => {
            this.loadBreadcrumbs();
        });

        auth.isLoggedIn()
            .then(() => auth.fetchUserData())
            .then(() => {
                const data = userStore.data;

                // Only administrators may use the backoffice.
                if (!data || !data.isAdmin) {
                    auth.logout();
                    Store.set('message', $t('login.notAdmin'));
                    this.to('/login');
                    return;
                }

                this.currentUser = { name: data.name, email: data.email };
                this.loading = false;
                menuItems(this).then(items => { this.menuItems = items; });
            })
            .catch(() => this.to('/login'));

        EventListener.on('breadcrumbs', 'setBreadcrumbs', (items: any[]) => {
            this.breadcrumbs = [{ label: '', url: '' }, ...items];
        });
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
        App.confirm($t('backoffice.logoutConfirm'))
            .then((value: boolean) => {
                if (value) {
                    auth.logout().then(() => this.to('/login'));
                }
            });
    }

}
export default toNative(Backoffice);
