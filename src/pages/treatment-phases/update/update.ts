import { App, Store, Validator, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import TreatmentPhase from '@/models/treatmentPhase';
import TreatmentPhaseForm from '../form/form.vue';
import DecisionMatrixEditor from '@/components/decision-matrix-editor/decision-matrix-editor.vue';

@Component({ components: { TreatmentPhaseForm, DecisionMatrixEditor } })
class TreatmentPhaseUpdatePage extends Vue {
    treatmentPhase: TreatmentPhase = new TreatmentPhase();
    validator: Validator = new Validator();

    created() {
        const id = (this as any).$route?.params?.id as string;
        if (!id) { this.to('/treatment-phases'); return; }
        const stored = Store.getSync('treatmentPhase');
        Store.clear('treatmentPhase');
        if (stored && stored.id === id) {
            this.treatmentPhase = new TreatmentPhase(stored);
        } else {
            TreatmentPhase.findById(id).then(p => { this.treatmentPhase = p; }).catch(() => this.to('/treatment-phases'));
        }
    }

    save() {
        if (!this.validator.validate()) return;
        this.treatmentPhase.save()
            .then(() => {
                Store.set('message', $t('treatmentPhase.update.notifications.success'));
                this.to('/treatment-phases');
            })
            .catch(() => App.notification($t('treatmentPhase.update.notifications.error')).setType('error').setTime(5000).show());
    }
}
export default toNative(TreatmentPhaseUpdatePage);
