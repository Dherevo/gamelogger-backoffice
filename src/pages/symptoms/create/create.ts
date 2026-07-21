import { App, Store, Validator, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Symptom from '@/models/symptom';
import SymptomForm from '../form/form.vue';

@Component({ components: { SymptomForm } })
class SymptomCreatePage extends Vue {
    symptom: Symptom = new Symptom();
    validator: Validator = new Validator();

    save() {
        if (!this.validator.validate()) return;
        this.symptom.save()
            .then(() => {
                Store.set('message', $t('symptom.create.notifications.success'));
                this.to('/symptoms');
            })
            .catch(() => App.notification($t('symptom.create.notifications.error')).setType('error').setTime(5000).show());
    }
}
export default toNative(SymptomCreatePage);
