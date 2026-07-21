import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, IOption, Validator, $t } from 'lib';
import Admin from '@/models/admin';

@Component({
    components: { FormInput }
})
class AdminsFormComponent extends Vue {

    @Prop
    form: 'create' | 'update' = 'create';
    @Prop
    admin: Admin = new Admin();
    @Prop
    validator: Validator = new Validator();

    languageOptions: IOption[] = Admin.languageOptions;
    roleOptions: IOption[] = Admin.roleOptions;

    get confirmPasswordValidator() {
        return this.validator.add('confirmPassword', () => this.admin.confirmPassword)
            .rule(() => this.admin.password === this.admin.confirmPassword, 'passwordMismatch')
            .causesError($t('admin.errors.passwordMismatch'));
    }

}
export default toNative(AdminsFormComponent);
