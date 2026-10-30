import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import { FormInput, Validator } from 'lib';
import SuggestInput from '@/components/suggest-input/suggest-input.vue';
import Game from '@/models/game';

@Component({
    components: { FormInput, SuggestInput }
})
class GamesFormComponent extends Vue {

    @Prop
    game: Game = new Game();
    @Prop
    validator: Validator = new Validator();

    suggestDevelopers = (q: string) => Game.suggestCredits('developer', q);
    suggestPublishers = (q: string) => Game.suggestCredits('publisher', q);
    suggestGenres = (q: string) => Game.suggestGenres(q);

}
export default toNative(GamesFormComponent);
