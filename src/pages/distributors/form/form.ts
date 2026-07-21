import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, Validator } from 'lib';
import Distributor from '@/models/distributor';

@Component({
    components: { FormInput }
})
class DistributorsFormComponent extends Vue {

    @Prop
    form: 'create' | 'update' = 'create';
    @Prop
    distributor: Distributor = new Distributor();
    @Prop
    validator: Validator = new Validator();

}
export default toNative(DistributorsFormComponent);
