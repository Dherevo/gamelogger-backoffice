import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, Validator } from 'lib';
import Platform from '@/models/platform';

@Component({
    components: { FormInput }
})
class PlatformsFormComponent extends Vue {

    @Prop
    platform: Platform = new Platform();
    @Prop
    validator: Validator = new Validator();

}
export default toNative(PlatformsFormComponent);
