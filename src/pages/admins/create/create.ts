import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, Store, Validator, $t } from 'lib';
import Admin from '@/models/admin';
import AdminsForm from '@/pages/admins/form/form.vue';

@Component({
    components: { AdminsForm }
})
class AdminsCreatePage extends Vue {

    admin: Admin = new Admin();
    validator: Validator = new Validator();
    saving: boolean = false;

    save() {
        if (this.saving) return;
        if (this.validator.validate(this.admin)) {
            this.saving = true;
            this.admin.save()
                .then(() => {
                    Store.set('message', $t('admin.create.notifications.success'));
                    this.to('/admins');
                })
                .catch(error => {
                    if (error?.status === 400) {
                        if (error.data?.includes('username')) {
                            const v = this.validator.get('username');
                            v.error = true;
                            v.errorMessage = $t('admin.errors.alreadyInUse.username');
                            v.setInputError();
                        } else if (error.data?.includes('email')) {
                            const v = this.validator.get('email');
                            v.error = true;
                            v.errorMessage = $t('admin.errors.alreadyInUse.email');
                            v.setInputError();
                        }
                    } else {
                        App.notification($t('admin.create.notifications.error')).setType('error').setTime(5000).show();
                    }
                })
                .finally(() => { this.saving = false; });
        }
    }

}
export default toNative(AdminsCreatePage);
