import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, FormInput, IOption, Store, Validator, $t } from 'lib';
import Patient from '@/models/patient';
import Distributor from '@/models/distributor';
import PatientsForm from '@/pages/patients/form/form.vue';

@Component({
    components: { PatientsForm, FormInput }
})
class PatientsCreatePage extends Vue {

    patient: Patient = new Patient();
    validator: Validator = new Validator();
    assignData: boolean = false;
    saving: boolean = false;
    distributorOptions: IOption[] = [];

    created() {
        Distributor.list({ pageSize: 100 }).then(res => {
            this.distributorOptions = res.items.map((d: any) => ({ value: d.id, content: d.name }));
        }).catch(() => {});
    }

    save() {
        if (this.saving) return;
        if (!this.validator.validate()) return;

        if (!this.assignData) {
            const center = this.distributorOptions.find(o => o.value === this.patient.distributionCenterId);
            this.patient.name = 'Paciente';
            this.patient.surnames = center?.content || '';
        }

        this.saving = true;
        this.patient.save()
            .then((response: any) => {
                const code = response?.patientCode || '';
                const goToList = () => {
                    Store.set('message', $t('patients.create.notifications.success'));
                    this.to('/patients');
                };
                if (code) {
                    App.confirm(
                        `<div style="text-align:center">
                            <p>${$t('patients.create.patientCode.text')}</p>
                            <strong style="font-size:1.6rem;letter-spacing:4px">${code}</strong>
                        </div>`,
                        {
                            title: $t('patients.create.patientCode.title'),
                            confirmButton: { content: $t('generic.ok'), class: 'primary' },
                            cancelButton: { content: $t('generic.ok'), class: 'primary' },
                        }
                    ).finally(goToList);
                } else {
                    goToList();
                }
            })
            .catch(error => {
                if (error?.status === 400 && error.data?.includes('email')) {
                    const emailValidator = this.validator.get('email');
                    emailValidator.error = true;
                    emailValidator.errorMessage = $t('patients.errors.alreadyInUse.email');
                    emailValidator.setInputError();
                } else {
                    App.notification($t('patients.create.notifications.error')).setType('error').setTime(5000).show();
                }
            })
            .finally(() => { this.saving = false; });
    }

}
export default toNative(PatientsCreatePage);
