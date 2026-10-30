import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, FormInput, Validator, $t } from 'lib';
import Game from '@/models/game';
import GamesForm from '@/pages/games/form/form.vue';

@Component({
    components: { GamesForm, FormInput }
})
class GamesCreatePage extends Vue {

    game: Game = new Game();
    validator: Validator = new Validator();
    saving: boolean = false;
    iconFile: File | null = null;
    logoFile: File | null = null;

    save() {
        if (this.saving) return;
        if (this.validator.validate(this.game)) {
            this.saving = true;
            this.game.save()
                .then((created: any) => {
                    // Images need an existing id: upload them now, then go on to the edit screen.
                    this.game.id = created.id;
                    const uploads: Promise<any>[] = [];
                    if (this.iconFile) uploads.push(this.game.uploadIcon(this.iconFile));
                    if (this.logoFile) uploads.push(this.game.uploadLogo(this.logoFile));
                    return Promise.allSettled(uploads).then(results => {
                        if (results.some(r => r.status === 'rejected')) {
                            App.notification($t('game.images.notifications.error')).setType('error').setTime(5000).show();
                        }
                        return created;
                    });
                })
                .then((created: any) => {
                    App.notification($t('game.create.notifications.success')).setType('success').setTime(3000).show();
                    // Translations, languages and platforms need an existing id, so
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
