import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, Store, Validator, $t } from 'lib';
import Distributor from '@/models/distributor';
import DistributorsForm from '@/pages/distributors/form/form.vue';

@Component({
    components: { DistributorsForm }
})
class DistributorsUpdatePage extends Vue {

    distributor: Distributor = new Distributor();
    validator: Validator = new Validator();
    saving: boolean = false;

    created() {
        const id = (this as any).$route?.params?.id as string;
        if (!id) { this.to('/distributors'); return; }
        const stored = Store.getSync('distributor');
        Store.clear('distributor');
        if (stored && stored.id === id) {
            this.distributor = stored;
        } else {
            Distributor.findById(id)
                .then(d => { this.distributor = d; })
                .catch(() => this.to('/distributors'));
        }
    }

    save() {
        if (this.saving) return;
        if (this.validator.validate(this.distributor)) {
            this.saving = true;
            this.distributor.save()
                .then(() => {
                    Store.set('message', $t('distributor.update.notifications.success'));
                    this.to('/distributors');
                })
                .catch(() => {
                    App.notification($t('distributor.update.notifications.error')).setType('error').setTime(5000).show();
                })
                .finally(() => { this.saving = false; });
        }
    }

}
export default toNative(DistributorsUpdatePage);
