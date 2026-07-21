import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, Store, Validator, $t } from 'lib';
import Platform from '@/models/platform';
import PlatformsForm from '@/pages/platforms/form/form.vue';

@Component({
    components: { PlatformsForm }
})
class PlatformsCreatePage extends Vue {

    platform: Platform = new Platform();
    validator: Validator = new Validator();
    saving: boolean = false;

    save() {
        if (this.saving) return;
        if (this.validator.validate(this.platform)) {
            this.saving = true;
            this.platform.save()
                .then(() => {
                    Store.set('message', $t('platform.create.notifications.success'));
                    this.to('/platforms');
                })
                .catch(error => {
                    if (error?.status === 400 && error?.data?.error === 'platform.exists') {
                        const v = this.validator.get('name');
                        v.error = true;
                        v.errorMessage = $t('platform.errors.exists');
                        v.setInputError();
                    } else {
                        App.notification($t('platform.create.notifications.error')).setType('error').setTime(5000).show();
                    }
                })
                .finally(() => { this.saving = false; });
        }
    }

}
export default toNative(PlatformsCreatePage);
