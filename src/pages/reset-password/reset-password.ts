import { Component, Vue, toNative } from 'vue-facing-decorator';
import { FormInput, Validator, $t } from 'lib';
import auth from '@/modules/auth';

@Component({
    components: { FormInput }
})
class ResetPasswordPage extends Vue {

    token: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    validator: Validator = new Validator();
    loading: boolean = false;
    success: boolean = false;
    error: boolean = false;

    created() {
        this.token = (this as any).$route?.query?.token || '';
        if (!this.token) this.to('/login');
    }

    get confirmPasswordValidator() {
        return this.validator.add('confirmPassword', () => this.confirmPassword)
            .rule(() => this.newPassword === this.confirmPassword, 'passwordMismatch')
            .causesError($t('reset_password.errors.mismatch'));
    }

    submit() {
        if (this.loading) return;
        if (this.validator.validate({ newPassword: this.newPassword, confirmPassword: this.confirmPassword })) {
            this.loading = true;
            auth.resetPassword(this.token, this.newPassword)
                .then(() => { this.success = true; })
                .catch(() => { this.error = true; })
                .finally(() => { this.loading = false; });
        }
    }

}
export default toNative(ResetPasswordPage);
