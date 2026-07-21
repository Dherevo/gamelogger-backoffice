import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, Validator, $t } from 'lib';
import Game from '@/models/game';
import GamesForm from '@/pages/games/form/form.vue';

@Component({
    components: { GamesForm }
})
class GamesCreatePage extends Vue {

    game: Game = new Game();
    validator: Validator = new Validator();
    saving: boolean = false;

    save() {
        if (this.saving) return;
        if (this.validator.validate(this.game)) {
            this.saving = true;
            this.game.save()
                .then((created: any) => {
                    App.notification($t('game.create.notifications.success')).setType('success').setTime(3000).show();
                    // Translations, images and platforms need an existing id, so
                    // continue straight to the edit screen.
                    this.to(`/games/update/${created.id}`);
                })
                .catch(() => {
                    App.notification($t('game.create.notifications.error')).setType('error').setTime(5000).show();
                })
                .finally(() => { this.saving = false; });
        }
    }

}
export default toNative(GamesCreatePage);
