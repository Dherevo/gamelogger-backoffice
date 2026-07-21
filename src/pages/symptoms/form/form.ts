import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, IOption, Validator, $t } from 'lib';

@Component({ components: { FormInput } })
class SymptomForm extends Vue {
    @Prop() symptom!: any;
    @Prop() validator!: Validator;
    @Prop() form!: string;

    get typeOptions(): IOption[] {
        return [
            { value: 'scale', content: $t('symptom.types.scale') },
            { value: 'boolean', content: $t('symptom.types.boolean') },
        ];
    }
}
export default toNative(SymptomForm);
