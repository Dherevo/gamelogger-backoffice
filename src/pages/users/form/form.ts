import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, IOption, Validator, $t } from 'lib';
import User from '@/models/user';

@Component({
    components: { FormInput }
})
class UsersFormComponent extends Vue {

    @Prop
    form: 'create' | 'update' = 'create';
    @Prop
    user: User = new User();
    @Prop
    validator: Validator = new Validator();

    get localeOptions(): IOption[] {
        return [
            { value: 'ca', content: 'Català' },
            { value: 'es', content: 'Castellano' },
            { value: 'en', content: 'English' },
        ];
    }

    get visibilityOptions(): IOption[] {
        return ['public', 'friends', 'private'].map(v => ({ value: v, content: $t(`users.visibility.${v}`) }));
    }

}
export default toNative(UsersFormComponent);
