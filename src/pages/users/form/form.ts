import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, Validator } from 'lib';
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

}
export default toNative(UsersFormComponent);
