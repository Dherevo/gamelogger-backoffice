import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, Validator } from 'lib';

@Component({ components: { FormInput } })
class SkinTypeForm extends Vue {
    @Prop() skinType!: any;
    @Prop() validator!: Validator;
    @Prop() form!: string;
}
export default toNative(SkinTypeForm);
