import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, Store, Validator, $t } from 'lib';
import Distributor from '@/models/distributor';
import DistributorsForm from '@/pages/distributors/form/form.vue';

@Component({
    components: { DistributorsForm }
})
class DistributorsCreatePage extends Vue {

    distributor: Distributor = new Distributor();
    validator: Validator = new Validator();
    saving: boolean = false;

    save() {
        if (this.saving) return;
        if (this.validator.validate(this.distributor)) {
            this.saving = true;
            this.distributor.save()
                .then(() => {
                    Store.set('message', $t('distributor.create.notifications.success'));
                    this.to('/distributors');
                })
                .catch(() => {
                    App.notification($t('distributor.create.notifications.error')).setType('error').setTime(5000).show();
                })
                .finally(() => { this.saving = false; });
        }
    }

}
export default toNative(DistributorsCreatePage);
