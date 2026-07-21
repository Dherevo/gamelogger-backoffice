import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, IOption, Store, Validator, $t } from 'lib';
import PauseRule from '@/models/pauseRule';
import Symptom from '@/models/symptom';
import PauseRuleForm from '../form/form.vue';

@Component({ components: { PauseRuleForm } })
class PauseRuleUpdatePage extends Vue {
    pauseRule: PauseRule = new PauseRule();
    validator: Validator = new Validator();
    symptomOptions: IOption[] = [];
    orphan: boolean = false;
    loading: boolean = true;
    saving: boolean = false;

    created() {
        const id = (this as any).$route?.params?.id as string;
        if (!id) { this.to('/pause-rules'); return; }

        const stored = Store.getSync('pauseRule');
        Store.clear('pauseRule');
        const loadRule: Promise<PauseRule> = (stored && stored.id === id)
            ? Promise.resolve(new PauseRule(stored))
            : PauseRule.findById(id);

        Promise.all([loadRule, Symptom.list({ activeOnly: true })])
            .then(([rule, symptoms]) => {
                this.pauseRule = rule;
                const booleanSymptoms = symptoms.filter(s => s.type === 'boolean');
                this.symptomOptions = booleanSymptoms.map(s => ({ value: s.name, content: s.name }));
                this.orphan = !booleanSymptoms.some(s => s.name.toLowerCase() === rule.name.toLowerCase());
            })
            .catch(() => this.to('/pause-rules'))
            .finally(() => { this.loading = false; });
    }

    save() {
        if (this.saving) return;
        if (!this.validator.validate()) return;
        this.saving = true;
        this.pauseRule.save()
            .then(() => {
                Store.set('message', $t('pauseRule.update.notifications.success'));
                this.to('/pause-rules');
            })
            .catch(error => {
                if (error?.status === 400 && error.data) {
                    App.notification(String(error.data)).setType('error').setTime(6000).show();
                } else {
                    App.notification($t('pauseRule.update.notifications.error')).setType('error').setTime(5000).show();
                }
            })
            .finally(() => { this.saving = false; });
    }
}
export default toNative(PauseRuleUpdatePage);
