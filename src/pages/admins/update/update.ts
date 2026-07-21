import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, Store, Validator, $t } from 'lib';
import Admin from '@/models/admin';
import AdminsForm from '@/pages/admins/form/form.vue';

@Component({
    components: { AdminsForm }
})
class AdminsUpdatePage extends Vue {

    admin: Admin = new Admin();
    validator: Validator = new Validator();
    saving: boolean = false;

    created() {
        const id = (this as any).$route?.params?.id as string;
        if (!id) { this.to('/admins'); return; }
        const stored = Store.getSync('admin');
        Store.clear('admin');
        if (stored && stored.id === id) {
            this.admin = stored;
        } else {
            Admin.findById(id)
                .then(a => { this.admin = a; })
                .catch(() => this.to('/admins'));
        }
    }

    save() {
        if (this.saving) return;
        if (this.validator.validate(this.admin)) {
            this.saving = true;
            this.admin.save()
                .then(() => {
                    Store.set('message', $t('admin.update.notifications.success'));
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
                        App.notification($t('admin.update.notifications.error')).setType('error').setTime(5000).show();
                    }
                })
                .finally(() => { this.saving = false; });
        }
    }

    resetPassword() {
        App.confirm(`<div class="flex-row gap10">
            <i class="pi pi-exclamation-triangle"></i>
            <div>${$t('admin.modals.password.text')}</div>
        </div>`, {
            title: $t('admin.modals.password.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('admin.modals.password.button'), class: 'primary backoffice' },
        }).then((ok: boolean) => {
            if (ok) {
                this.admin.createPassword()
                    .then(() => App.notification($t('admin.update.notifications.password.success')).setType('success').setTime(5000).show())
                    .catch(() => App.notification($t('admin.update.notifications.password.error')).setType('error').setTime(5000).show());
            }
        });
    }

}
export default toNative(AdminsUpdatePage);
