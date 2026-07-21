import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, Validator } from 'lib';
import Game from '@/models/game';

@Component({
    components: { FormInput }
})
class GamesFormComponent extends Vue {

    @Prop
    game: Game = new Game();
    @Prop
    validator: Validator = new Validator();

}
export default toNative(GamesFormComponent);
