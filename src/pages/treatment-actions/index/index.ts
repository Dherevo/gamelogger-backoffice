import { App, FormInput, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import TreatmentAction from '@/models/treatmentAction';

@Component({ components: { FormInput } })
class TreatmentActionsIndexPage extends Vue {
    actions: TreatmentAction[] = [];
    loading: boolean = true;

    created() {
        TreatmentAction.list()
            .then(items => { this.actions = items; })
            .finally(() => { this.loading = false; });
    }

    save(action: TreatmentAction) {
        action.save()
            .then(() => App.notification($t('treatmentAction.notifications.save.success')).setType('success').setTime(3000).show())
            .catch(() => App.notification($t('treatmentAction.notifications.save.error')).setType('error').setTime(5000).show());
    }
}
export default toNative(TreatmentActionsIndexPage);
