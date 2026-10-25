import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, Store, Validator, $t } from 'lib';
import User from '@/models/user';
import UsersForm from '@/pages/users/form/form.vue';

@Component({
    components: { UsersForm }
})
class UsersUpdatePage extends Vue {

    user: User = new User();
    validator: Validator = new Validator();
    saving: boolean = false;

    created() {
        const id = (this as any).$route?.params?.id as string;
        if (!id) { this.to('/users'); return; }
        const stored = Store.getSync('user');
        Store.clear('user');
        if (stored && String(stored.id) === String(id)) {
            this.user = new User(stored);
        } else {
            User.findById(id)
                .then(u => { this.user = u; })
                .catch(() => this.to('/users'));
        }
    }

    save() {
        if (this.saving) return;
        if (this.validator.validate(this.user)) {
            this.saving = true;
            this.user.save()
                .then(() => {
                    Store.set('message', $t('users.update.notifications.success'));
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
        } else if (error?.status === 400 && String(code).startsWith('steam.')) {
            const v = this.validator.get('steam_id');
            v.error = true;
            v.errorMessage = $t(`users.errors.${code.replace('steam.', 'steam_')}`);
            v.setInputError();
        } else {
            App.notification($t('users.update.notifications.error')).setType('error').setTime(5000).show();
        }
    }

}
export default toNative(UsersUpdatePage);
