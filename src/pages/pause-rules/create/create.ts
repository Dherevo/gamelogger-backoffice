import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, IOption, Store, Validator, $t } from 'lib';
import PauseRule from '@/models/pauseRule';
import Symptom from '@/models/symptom';
import PauseRuleForm from '../form/form.vue';

@Component({ components: { PauseRuleForm } })
class PauseRuleCreatePage extends Vue {
    pauseRule: PauseRule = new PauseRule();
    validator: Validator = new Validator();
    symptomOptions: IOption[] = [];
    existingNames: string[] = [];
    loading: boolean = true;
    saving: boolean = false;

    created() {
        Promise.all([
            Symptom.list({ activeOnly: true }),
            PauseRule.list(),
        ]).then(([symptoms, rules]) => {
            this.symptomOptions = symptoms
                .filter(s => s.type === 'boolean')
                .map(s => ({ value: s.name, content: s.name }));
            this.existingNames = rules.map(r => r.name);
        }).finally(() => { this.loading = false; });
    }

    get hasSymptoms(): boolean {
        return this.symptomOptions.length > 0;
    }

    save() {
        if (this.saving) return;
        if (!this.validator.validate()) return;

        const proceed = () => {
            this.saving = true;
            this.pauseRule.save()
                .then(() => {
                    Store.set('message', $t('pauseRule.create.notifications.success'));
                    this.to('/pause-rules');
                })
                .catch(error => {
                    if (error?.status === 400 && error.data) {
                        App.notification(String(error.data)).setType('error').setTime(6000).show();
                    } else {
                        App.notification($t('pauseRule.create.notifications.error')).setType('error').setTime(5000).show();
                    }
                })
                .finally(() => { this.saving = false; });
        };

        const isDuplicate = this.existingNames.some(n => n.toLowerCase() === this.pauseRule.name.toLowerCase());
        if (isDuplicate) {
            App.confirm(`<div class="flex-row gap10"><i class="pi pi-exclamation-triangle"></i><div>${$t('pauseRule.create.duplicateText')}</div></div>`, {
                title: $t('pauseRule.create.duplicateTitle'),
                cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
                confirmButton: { content: $t('pauseRule.create.duplicateButton'), class: 'primary backoffice' },
            }).then((ok: boolean) => { if (ok) proceed(); });
        } else {
            proceed();
        }
    }
}
export default toNative(PauseRuleCreatePage);
