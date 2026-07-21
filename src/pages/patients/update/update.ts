import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, Store, Validator, $t } from 'lib';
import Patient from '@/models/patient';
import PatientsForm from '@/pages/patients/form/form.vue';

@Component({
    components: { PatientsForm }
})
class PatientsUpdatePage extends Vue {

    patient: Patient = new Patient();
    validator: Validator = new Validator();
    saving: boolean = false;

    created() {
        const id = (this as any).$route?.params?.id as string;
        if (!id) { this.to('/patients'); return; }
        const stored = Store.getSync('patient');
        Store.clear('patient');
        if (stored && stored.id === id) {
            this.patient = stored;
        } else {
            Patient.findById(id)
                .then(p => { this.patient = p; })
                .catch(() => this.to('/patients'));
        }
    }

    save() {
        if (this.saving) return;
        if (this.validator.validate(this.patient)) {
            this.saving = true;
            this.patient.save()
                .then(() => {
                    Store.set('message', $t('patients.update.notifications.success'));
                    this.to('/patients');
                })
                .catch(error => {
                    if (error?.status === 400) {
                        if (error.data?.includes('email')) {
                            const emailValidator = this.validator.get('email');
                            emailValidator.error = true;
                            emailValidator.errorMessage = $t('patients.errors.alreadyInUse.email');
                            emailValidator.setInputError();
                        }
                    } else {
                        App.notification($t('patients.update.notifications.error')).setType('error').setTime(5000).show();
                    }
                })
                .finally(() => {
                    this.saving = false;
                });
        }
    }

    resetPassword() {
        App.confirm(`<div class="flex-row gap10">
            <i class="pi pi-exclamation-triangle"></i>
            <div>${$t('patients.modals.password.text')}</div>
        </div>`, {
            title: $t('patients.modals.password.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('patients.modals.password.button'), class: 'primary backoffice' },
        }).then((ok: boolean) => {
            if (ok) {
                this.patient.createPassword()
                    .then(() => {
                        App.notification($t('patients.update.notifications.password.success')).setType('success').setTime(5000).show();
                    })
                    .catch(() => {
                        App.notification($t('patients.update.notifications.password.error')).setType('error').setTime(5000).show();
                    });
            }
        });
    }

}
export default toNative(PatientsUpdatePage);
