import { Component, Vue, toNative } from "vue-facing-decorator";
import { http, FormInput } from "lib";

@Component({ components: { FormInput } })
class ResetPasswordPage extends Vue {

    email = '';
    password = '';
    passwordConfirm = '';
    loading = false;
    errorMsg = '';
    done = false;

    get token(): string | null {
        return (this.$route.params.token as string) || (this.$route.query.token as string) || null;
    }

    requestReset() {
        if (!this.email.trim()) return;

        this.loading = true;
        this.errorMsg = '';

        http.post('/auth/password/reset')
            .data({ email: this.email.trim() })
            .promise()
            .then(() => {
                this.loading = false;
                this.done = true;
            })
            .catch(() => {
                this.loading = false;
                this.errorMsg = this.$t('reset_password.email.error');
            });
    }

    setPassword() {
        this.errorMsg = '';

        if (!this.password) {
            this.errorMsg = this.$t('reset_password.password.empty');
            return;
        }
        if (this.password !== this.passwordConfirm) {
            this.errorMsg = this.$t('reset_password.password.mismatch');
            return;
        }

        this.loading = true;

        http.post('/auth/password/set')
            .data({ password: this.password, token: this.token })
            .promise()
            .then(() => {
                this.loading = false;
                this.done = true;
            })
            .catch(() => {
                this.loading = false;
                this.errorMsg = this.$t('reset_password.password.error');
            });
    }

    goToLogin() {
        this.$router.push('/login');
    }

}
export default toNative(ResetPasswordPage);
