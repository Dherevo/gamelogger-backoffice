import { Component, Vue, toNative } from "vue-facing-decorator";
import { LoginPageV2 as Login, Store, $t } from "lib";
import auth from "@/modules/auth";
import userStore from "@/modules/userStore";

@Component({
    components: { Login }
})
class LoginPage extends Vue {

    warning: string = Store.getSync('message') || '';

    created() {
        Store.clear('message');
    }

    doLogin($e: {
        username: string,
        password: string,
        success: () => void,
        error: (error: string) => void
    }) {

        auth.login($e.username, $e.password)
            .then(() => auth.fetchUserData())
            .then(() => {
                if (!userStore.data?.isAdmin) {
                    auth.logout();
                    $e.error($t('login.notAdmin'));
                    return;
                }
                this.to('/users');
                $e.success();
            })
            .catch(() => {
                $e.error($t('login.error'));
            });
    }

}
export default toNative(LoginPage);
