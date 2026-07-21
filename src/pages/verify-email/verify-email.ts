import { Component, Vue, toNative } from 'vue-facing-decorator';
import auth from '@/modules/auth';

@Component({})
class VerifyEmailPage extends Vue {

    loading: boolean = true;
    success: boolean = false;

    created() {
        const token = (this as any).$route?.query?.token || (this as any).$route?.params?.token || '';
        if (!token) {
            this.loading = false;
            return;
        }
        auth.verifyEmail(token)
            .then(() => { this.success = true; })
            .catch(() => { this.success = false; })
            .finally(() => { this.loading = false; });
    }

}
export default toNative(VerifyEmailPage);
