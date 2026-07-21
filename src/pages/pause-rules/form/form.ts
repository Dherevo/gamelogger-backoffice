import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, IOption, Validator } from 'lib';

@Component({ components: { FormInput } })
class PauseRuleForm extends Vue {
    @Prop() pauseRule!: any;
    @Prop() validator!: Validator;
    @Prop() form!: string;
    @Prop() symptomOptions!: IOption[];
    @Prop({ default: false }) orphan!: boolean;
}
export default toNative(PauseRuleForm);
