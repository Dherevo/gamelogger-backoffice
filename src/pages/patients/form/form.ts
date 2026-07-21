import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, IOption, Validator } from 'lib';
import Patient from '@/models/patient';

@Component({
    components: { FormInput }
})
class PatientsFormComponent extends Vue {

    @Prop
    form: 'create' | 'update' = 'create';
    @Prop
    patient: Patient = new Patient();
    @Prop
    validator: Validator = new Validator();

    languageOptions: IOption[] = Patient.languageOptions;
    genderOptions: IOption[] = Patient.genderOptions;
    treatmentStatusOptions: IOption[] = Patient.treatmentStatusOptions;

}
export default toNative(PatientsFormComponent);
