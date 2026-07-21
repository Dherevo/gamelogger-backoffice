import { Component, Vue, toNative } from 'vue-facing-decorator';
import { FormInput, Validator } from 'lib';
import auth from '@/modules/auth';

@Component({
    components: { FormInput }
})
class RecoverPage extends Vue {

    email: string = '';
    validator: Validator = new Validator();
    loading: boolean = false;
    success: boolean = false;

    submit() {
        if (this.loading || this.success) return;
        if (this.validator.validate({ email: this.email })) {
            this.loading = true;
            auth.recover(this.email)
                .then(() => { this.success = true; })
                .catch(() => { this.success = true; }) // Always show success (API spec)
                .finally(() => { this.loading = false; });
        }
    }

}
export default toNative(RecoverPage);
