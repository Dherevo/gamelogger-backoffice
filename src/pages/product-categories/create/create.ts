import { App, Store, Validator, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import ProductCategory from '@/models/productCategory';
import ProductCategoryForm from '../form/form.vue';

@Component({ components: { ProductCategoryForm } })
class ProductCategoryCreatePage extends Vue {
    productCategory: ProductCategory = new ProductCategory();
    validator: Validator = new Validator();

    save() {
        if (!this.validator.validate()) return;
        this.productCategory.save()
            .then(() => {
                Store.set('message', $t('productCategory.create.notifications.success'));
                this.to('/product-categories');
            })
            .catch(() => App.notification($t('productCategory.create.notifications.error')).setType('error').setTime(5000).show());
    }
}
export default toNative(ProductCategoryCreatePage);
