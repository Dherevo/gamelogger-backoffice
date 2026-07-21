import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, Validator } from 'lib';

@Component({ components: { FormInput } })
class ProductCategoryForm extends Vue {
    @Prop() productCategory!: any;
    @Prop() validator!: Validator;
    @Prop() form!: string;
}
export default toNative(ProductCategoryForm);
