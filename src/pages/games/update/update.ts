import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, FormInput, IOption, Loader, Validator, $t } from 'lib';
import Game, { GAME_LOCALES, GameLocale } from '@/models/game';
import Platform from '@/models/platform';
import PlatformGame from '@/models/platformGame';
import Achievement from '@/models/achievement';
import GamesForm from '@/pages/games/form/form.vue';

@Component({
    components: { GamesForm, FormInput, Loader }
})
class GamesUpdatePage extends Vue {

    game: Game = new Game();
    validator: Validator = new Validator();
    saving: boolean = false;
    savingTranslations: boolean = false;
    loaded: boolean = false;

    locales: GameLocale[] = GAME_LOCALES;

    iconFile: File | null = null;
    logoFile: File | null = null;

    allPlatforms: Platform[] = [];
    newPlatformId: number | null = null;
    newPlatformKey: string = '';
    addingPlatform: boolean = false;

    achievements: Achievement[] = [];
    achievementsLoaded: boolean = false;
    expandedAchievements: Record<number, boolean> = {};
    savingAchievements: Record<number, boolean> = {};

    created() {
        const id = (this as any).$route?.params?.id as string;
        if (!id) { this.to('/games'); return; }

        // The icon/logo FormInput widgets only read their initial `:src` once,
        // in their own created() hook — they don't react to it changing later.
        // So the game (and its icon/logo URLs) must be fully loaded BEFORE this
        // page's template mounts them, or the existing image preview never shows.
        Game.findById(id)
            .then(g => { this.game = g; this.loaded = true; })
            .catch(() => this.to('/games'));

        Platform.list()
            .then(items => { this.allPlatforms = items; })
            .catch(() => { this.allPlatforms = []; });

        Achievement.listForGame(id)
            .then(items => { this.achievements = items; })
            .catch(() => { this.achievements = []; })
            .finally(() => { this.achievementsLoaded = true; });
    }

    get availablePlatforms(): IOption[] {
        const attached = new Set(this.game.platforms.map(p => p.id));
        return this.allPlatforms
            .filter(p => !attached.has(p.id))
            .map(p => ({ value: p.id, content: p.name }));
    }

    // --- Base fields ---
    save() {
        if (this.saving) return;
        if (this.validator.validate(this.game)) {
            this.saving = true;
            this.game.save()
                .then(() => App.notification($t('game.update.notifications.success')).setType('success').setTime(3000).show())
                .catch(() => App.notification($t('game.update.notifications.error')).setType('error').setTime(5000).show())
                .finally(() => { this.saving = false; });
        }
    }

    // --- Translations ---
    saveTranslations() {
        if (this.savingTranslations) return;
        this.savingTranslations = true;
        Promise.all(this.locales.map(locale => this.game.setTranslation(locale)))
            .then(() => App.notification($t('game.translations.notifications.success')).setType('success').setTime(3000).show())
            .catch(() => App.notification($t('game.translations.notifications.error')).setType('error').setTime(5000).show())
            .finally(() => { this.savingTranslations = false; });
    }

    // --- Icon / Logo ---
    onIconChange(file: File | null) {
        if (!file) {
            this.game.deleteIcon()
                .then((res: any) => { this.game.icon = res?.icon || ''; })
                .catch(() => App.notification($t('game.images.notifications.error')).setType('error').setTime(5000).show());
            return;
        }
        this.game.uploadIcon(file)
            .then((res: any) => {
                this.game.icon = res?.icon || '';
                App.notification($t('game.images.notifications.success')).setType('success').setTime(3000).show();
            })
            .catch(() => App.notification($t('game.images.notifications.error')).setType('error').setTime(5000).show());
    }

    onLogoChange(file: File | null) {
        if (!file) {
            this.game.deleteLogo()
                .then((res: any) => { this.game.logo = res?.logo || ''; })
                .catch(() => App.notification($t('game.images.notifications.error')).setType('error').setTime(5000).show());
            return;
        }
        this.game.uploadLogo(file)
            .then((res: any) => {
                this.game.logo = res?.logo || '';
                App.notification($t('game.images.notifications.success')).setType('success').setTime(3000).show();
            })
            .catch(() => App.notification($t('game.images.notifications.error')).setType('error').setTime(5000).show());
    }

    // --- Platforms ---
    reloadPlatforms() {
        return Game.findById(this.game.id)
            .then(fresh => { this.game.platforms = fresh.platforms; });
    }

    addPlatform() {
        if (this.addingPlatform) return;
        if (!this.newPlatformId || !this.newPlatformKey.trim()) return;
        this.addingPlatform = true;
        PlatformGame.attach(this.game.id, this.newPlatformId, this.newPlatformKey.trim())
            .then(() => {
                this.newPlatformId = null;
                this.newPlatformKey = '';
                return this.reloadPlatforms();
            })
            .catch(error => {
                const msg = error?.data?.error === 'platform_game.key_taken'
                    ? $t('game.platforms.errors.keyTaken')
                    : $t('game.platforms.errors.add');
                App.notification(msg).setType('error').setTime(5000).show();
            })
            .finally(() => { this.addingPlatform = false; });
    }

    savePlatformKey(pg: PlatformGame) {
        pg.updateKey(this.game.id)
            .then(() => App.notification($t('game.platforms.notifications.keySaved')).setType('success').setTime(3000).show())
            .catch(error => {
                const msg = error?.data?.error === 'platform_game.key_taken'
                    ? $t('game.platforms.errors.keyTaken')
                    : $t('game.platforms.errors.update');
                App.notification(msg).setType('error').setTime(5000).show();
            });
    }

    removePlatform(pg: PlatformGame) {
        App.confirm(`<div class="flex-row gap10">
            <i class="pi pi-exclamation-triangle"></i>
            <div>${$t('game.platforms.modals.remove.text', { name: pg.name })}</div>
        </div>`, {
            title: $t('game.platforms.modals.remove.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('game.platforms.modals.remove.button'), class: 'danger', icon: 'prime/trash' },
        }).then((ok: boolean) => {
            if (!ok) return;
            pg.detach(this.game.id)
                .then(() => this.reloadPlatforms())
                .catch(error => {
                    const msg = error?.data?.error === 'platform_game.has_library_entries'
                        ? $t('game.platforms.errors.hasLibraryEntries')
                        : $t('game.platforms.errors.remove');
                    App.notification(msg).setType('error').setTime(5000).show();
                });
        });
    }

    // --- Achievements ---
    toggleAchievement(a: Achievement) {
        this.expandedAchievements[a.id] = !this.expandedAchievements[a.id];
    }

    saveAchievement(a: Achievement) {
        if (this.savingAchievements[a.id]) return;
        this.savingAchievements[a.id] = true;

        const requests: Promise<any>[] = [a.save()];
        if (this.expandedAchievements[a.id]) {
            requests.push(...this.locales.map(locale => a.setTranslation(locale)));
        }

        Promise.all(requests)
            .then(() => App.notification($t('game.achievements.notifications.success')).setType('success').setTime(3000).show())
            .catch(() => App.notification($t('game.achievements.notifications.error')).setType('error').setTime(5000).show())
            .finally(() => { this.savingAchievements[a.id] = false; });
    }

}
export default toNative(GamesUpdatePage);
