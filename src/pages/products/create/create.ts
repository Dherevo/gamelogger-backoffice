import { App, Store, Validator, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Product from '@/models/product';
import ProductForm from '../form/form.vue';

@Component({ components: { ProductForm } })
class ProductCreatePage extends Vue {
    product: Product = new Product();
    validator: Validator = new Validator();

    save() {
        if (!this.validator.validate()) return;
        this.product.save()
            .then(() => {
                Store.set('message', $t('product.create.notifications.success'));
                this.to('/products');
            })
            .catch(() => App.notification($t('product.create.notifications.error')).setType('error').setTime(5000).show());
    }
}
export default toNative(ProductCreatePage);
