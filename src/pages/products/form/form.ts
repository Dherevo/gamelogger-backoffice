import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, IOption, Validator } from 'lib';
import ProductCategory from '@/models/productCategory';

@Component({ components: { FormInput } })
class ProductForm extends Vue {
    @Prop() product!: any;
    @Prop() validator!: Validator;
    @Prop() form!: string;

    categoryOptions: IOption[] = [];

    created() {
        ProductCategory.list().then(cats => {
            this.categoryOptions = cats.map(c => ({ value: c.id, content: c.name }));
        });
    }
}
export default toNative(ProductForm);
