import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, Store, Validator, $t } from 'lib';
import User from '@/models/user';
import UsersForm from '@/pages/users/form/form.vue';

@Component({
    components: { UsersForm }
})
class UsersCreatePage extends Vue {

    user: User = new User();
    validator: Validator = new Validator();
    saving: boolean = false;

    save() {
        if (this.saving) return;
        if (this.validator.validate(this.user)) {
            this.saving = true;
            this.user.save()
                .then(() => {
                    Store.set('message', $t('users.create.notifications.success'));
                    this.to('/users');
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
            App.notification($t('users.create.notifications.error')).setType('error').setTime(5000).show();
        }
    }

}
export default toNative(UsersCreatePage);
