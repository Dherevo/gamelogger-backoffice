import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, Validator } from 'lib';

@Component({ components: { FormInput } })
class TreatmentPhaseForm extends Vue {
    @Prop() treatmentPhase!: any;
    @Prop() validator!: Validator;
    @Prop() form!: string;

    addTask() {
        this.treatmentPhase.tasks.push('');
    }

    removeTask(index: number) {
        this.treatmentPhase.tasks.splice(index, 1);
    }
}
export default toNative(TreatmentPhaseForm);
