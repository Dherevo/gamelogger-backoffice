import { App, Store, Validator, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import ProductCategory from '@/models/productCategory';
import ProductCategoryForm from '../form/form.vue';

@Component({ components: { ProductCategoryForm } })
class ProductCategoryUpdatePage extends Vue {
    productCategory: ProductCategory = new ProductCategory();
    validator: Validator = new Validator();

    created() {
        const id = (this as any).$route?.params?.id as string;
        if (!id) { this.to('/product-categories'); return; }
        const stored = Store.getSync('productCategory');
        Store.clear('productCategory');
        if (stored && stored.id === id) {
            this.productCategory = new ProductCategory(stored);
        } else {
            ProductCategory.findById(id).then(c => { this.productCategory = c; }).catch(() => this.to('/product-categories'));
        }
    }

    save() {
        if (!this.validator.validate()) return;
        this.productCategory.save()
            .then(() => {
                Store.set('message', $t('productCategory.update.notifications.success'));
                this.to('/product-categories');
            })
            .catch(() => App.notification($t('productCategory.update.notifications.error')).setType('error').setTime(5000).show());
    }
}
export default toNative(ProductCategoryUpdatePage);
