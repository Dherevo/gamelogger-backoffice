import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, Store, Validator, $t } from 'lib';
import Platform from '@/models/platform';
import PlatformsForm from '@/pages/platforms/form/form.vue';

@Component({
    components: { PlatformsForm }
})
class PlatformsUpdatePage extends Vue {

    platform: Platform = new Platform();
    validator: Validator = new Validator();
    saving: boolean = false;

    created() {
        const id = (this as any).$route?.params?.id as string;
        if (!id) { this.to('/platforms'); return; }
        const stored = Store.getSync('platform');
        Store.clear('platform');
        if (stored && String(stored.id) === String(id)) {
            this.platform = new Platform(stored);
        } else {
            // No single-platform GET endpoint; fall back to the list.
            Platform.list()
                .then(items => {
                    const found = items.find(p => String(p.id) === String(id));
                    if (found) this.platform = found;
                    else this.to('/platforms');
                })
                .catch(() => this.to('/platforms'));
        }
    }

    save() {
        if (this.saving) return;
        if (this.validator.validate(this.platform)) {
            this.saving = true;
            this.platform.save()
                .then(() => {
                    Store.set('message', $t('platform.update.notifications.success'));
                    this.to('/platforms');
                })
                .catch(error => {
                    if (error?.status === 400 && error?.data?.error === 'platform.exists') {
                        const v = this.validator.get('name');
                        v.error = true;
                        v.errorMessage = $t('platform.errors.exists');
                        v.setInputError();
                    } else {
                        App.notification($t('platform.update.notifications.error')).setType('error').setTime(5000).show();
                    }
                })
                .finally(() => { this.saving = false; });
        }
    }

}
export default toNative(PlatformsUpdatePage);
