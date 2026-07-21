import { App, Store, Validator, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import SkinType from '@/models/skinType';
import SkinTypeForm from '../form/form.vue';

@Component({ components: { SkinTypeForm } })
class SkinTypeUpdatePage extends Vue {
    skinType: SkinType = new SkinType();
    validator: Validator = new Validator();

    created() {
        const id = (this as any).$route?.params?.id as string;
        if (!id) { this.to('/skin-types'); return; }
        const stored = Store.getSync('skinType');
        Store.clear('skinType');
        if (stored && stored.id === id) {
            this.skinType = new SkinType(stored);
        } else {
            SkinType.findById(id).then(s => { this.skinType = s; }).catch(() => this.to('/skin-types'));
        }
    }

    save() {
        if (!this.validator.validate()) return;
        this.skinType.save()
            .then(() => {
                Store.set('message', $t('skinType.update.notifications.success'));
                this.to('/skin-types');
            })
            .catch(() => App.notification($t('skinType.update.notifications.error')).setType('error').setTime(5000).show());
    }
}
export default toNative(SkinTypeUpdatePage);
