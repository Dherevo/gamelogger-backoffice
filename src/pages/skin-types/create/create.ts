import { App, Store, Validator, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import SkinType from '@/models/skinType';
import SkinTypeForm from '../form/form.vue';

@Component({ components: { SkinTypeForm } })
class SkinTypeCreatePage extends Vue {
    skinType: SkinType = new SkinType();
    validator: Validator = new Validator();

    save() {
        if (!this.validator.validate()) return;
        this.skinType.save()
            .then(() => {
                Store.set('message', $t('skinType.create.notifications.success'));
                this.to('/skin-types');
            })
            .catch(() => App.notification($t('skinType.create.notifications.error')).setType('error').setTime(5000).show());
    }
}
export default toNative(SkinTypeCreatePage);
