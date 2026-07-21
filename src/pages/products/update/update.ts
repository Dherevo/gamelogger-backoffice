import { App, Store, Validator, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Product from '@/models/product';
import ProductForm from '../form/form.vue';

@Component({ components: { ProductForm } })
class ProductUpdatePage extends Vue {
    product: Product = new Product();
    validator: Validator = new Validator();

    created() {
        const id = (this as any).$route?.params?.id as string;
        if (!id) { this.to('/products'); return; }
        const stored = Store.getSync('product');
        Store.clear('product');
        if (stored && stored.id === id) {
            this.product = new Product(stored);
        } else {
            Product.findById(id).then(p => { this.product = p; }).catch(() => this.to('/products'));
        }
    }

    save() {
        if (!this.validator.validate()) return;
        this.product.save()
            .then(() => {
                Store.set('message', $t('product.update.notifications.success'));
                this.to('/products');
            })
            .catch(() => App.notification($t('product.update.notifications.error')).setType('error').setTime(5000).show());
    }
}
export default toNative(ProductUpdatePage);
