import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, Validator, FormInput, $t } from 'lib';
import User from '@/models/user';
import userStore from '@/modules/userStore';
import auth from '@/modules/auth';

@Component({
    components: { FormInput }
})
class ProfilePage extends Vue {

    user: User = new User();
    validator: Validator = new Validator();
    saving: boolean = false;

    created() {
        if (userStore.data) {
            this.user = new User(userStore.data);
            this.user.password = '';
        }
    }

    save() {
        if (this.saving) return;
        if (this.validator.validate(this.user)) {
            this.saving = true;
            this.user.save()
                .then(() => auth.fetchUserData())
                .then(() => {
                    this.user.password = '';
                    App.notification($t('profile.notifications.success')).setType('success').setTime(4000).show();
                })
                .catch(error => this.handleError(error))
                .finally(() => { this.saving = false; });
        }
    }

    handleError(error: any) {
        const code = error?.data?.error;
        if (error?.status === 400 && (code === 'user.already' || code === 'user.deleted')) {
            const v = this.validator.get('email');
            v.error = true;
            v.errorMessage = $t('users.errors.emailInUse');
            v.setInputError();
        } else if (error?.status === 400 && code === 'user.nickname_taken') {
            const v = this.validator.get('nickname');
            v.error = true;
            v.errorMessage = $t('users.errors.nicknameInUse');
            v.setInputError();
        } else {
            App.notification($t('profile.notifications.error')).setType('error').setTime(5000).show();
        }
    }

}
export default toNative(ProfilePage);
