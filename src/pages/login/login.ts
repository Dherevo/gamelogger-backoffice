import { Component, Vue, toNative } from 'vue-facing-decorator';
import { FormInput, Validator, $t } from 'lib';
import auth from '@/modules/auth';

@Component({
    components: { FormInput }
})
class LoginPage extends Vue {

    loginData = { email: '', password: '' };
    validator: Validator = new Validator();
    loading: boolean = false;

    created() {
        auth.isLoggedIn()
            .then(() => this.to('/patients'))
            .catch(() => {});
    }

    doLogin() {
        if (this.loading) return;
        if (this.validator.validate(this.loginData)) {
            this.loading = true;
            auth.login(this.loginData.email, this.loginData.password)
                .then(() => {
                    this.to('/patients');
                })
                .catch(() => {
                    const msg = $t('login.error');
                    const emailV = this.validator.get('email');
                    emailV.error = true;
                    emailV.setInputError(msg);
                    const passV = this.validator.get('password');
                    passV.error = true;
                    passV.setInputError(msg);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }

}
export default toNative(LoginPage);
