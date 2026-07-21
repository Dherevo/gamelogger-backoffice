import { App, Store, Validator, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import TreatmentPhase from '@/models/treatmentPhase';
import TreatmentPhaseForm from '../form/form.vue';

@Component({ components: { TreatmentPhaseForm } })
class TreatmentPhaseCreatePage extends Vue {
    treatmentPhase: TreatmentPhase = new TreatmentPhase();
    validator: Validator = new Validator();

    save() {
        if (!this.validator.validate()) return;
        this.treatmentPhase.save()
            .then(() => {
                Store.set('message', $t('treatmentPhase.create.notifications.success'));
                this.to('/treatment-phases');
            })
            .catch(() => App.notification($t('treatmentPhase.create.notifications.error')).setType('error').setTime(5000).show());
    }
}
export default toNative(TreatmentPhaseCreatePage);
