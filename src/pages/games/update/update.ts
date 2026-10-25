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
    achievementsTotal: number = 0;
    achievementsOffset: number = 0;
    achievementsPageSize: number = 20;
    expandedAchievements: Record<number, boolean> = {};
    savingAchievements: Record<number, boolean> = {};
    changingStory: Record<number, boolean> = {};
    syncingAchievements: boolean = false;

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

        this.loadAchievements();
    }

    get achievementsPage(): number {
        return Math.floor(this.achievementsOffset / this.achievementsPageSize) + 1;
    }

    get achievementsTotalPages(): number {
        return Math.max(1, Math.ceil(this.achievementsTotal / this.achievementsPageSize));
    }

    loadAchievements() {
        this.achievementsLoaded = false;
        Achievement.listForGame(this.game.id || (this as any).$route?.params?.id, {
            offset: this.achievementsOffset,
            pageSize: this.achievementsPageSize,
        })
            .then(res => {
                this.achievements = res.items;
                this.achievementsTotal = res.total;
                this.achievementsOffset = res.offset;
                this.achievementsPageSize = res.pageSize;
            })
            .catch(() => { this.achievements = []; this.achievementsTotal = 0; })
            .finally(() => { this.achievementsLoaded = true; });
    }

    prevAchievementsPage() {
        if (this.achievementsOffset <= 0) return;
        this.achievementsOffset = Math.max(0, this.achievementsOffset - this.achievementsPageSize);
        this.loadAchievements();
    }

    nextAchievementsPage() {
        if (this.achievementsOffset + this.achievementsPageSize >= this.achievementsTotal) return;
        this.achievementsOffset += this.achievementsPageSize;
        this.loadAchievements();
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
    /** Import the game's achievement list from Steam (it is missing for games nobody has played). */
    syncAchievementsFromSteam() {
        if (this.syncingAchievements) return;
        this.syncingAchievements = true;
        Achievement.syncFromSteam(this.game.id)
            .then(res => {
                App.notification($t('game.achievements.sync.notifications.success', { added: res.added, total: res.total }))
                    .setType('success').setTime(4000).show();
                this.achievementsOffset = 0;
                this.loadAchievements();
            })
            .catch(error => {
                const msg = error?.data?.error === 'game.no_steam'
                    ? $t('game.achievements.sync.errors.noSteam')
                    : $t('game.achievements.sync.errors.generic');
                App.notification(msg).setType('error').setTime(5000).show();
            })
            .finally(() => { this.syncingAchievements = false; });
    }

    /** Platforms of this game that already have a "story completed" achievement chosen. */
    get storyPlatforms(): PlatformGame[] {
        return this.game.platforms.filter(p => p.story_achievement);
    }

    toggleStory(a: Achievement) {
        if (this.changingStory[a.id]) return;
        const marking = !a.is_story_completion;
        if (!marking) { this.applyStory(a, false); return; }

        // Marking has effects on players (those who already have it get the game as completed), so confirm.
        App.confirm(`<div class="flex-row gap10">
            <i class="pi pi-info-circle"></i>
            <div>${$t('game.achievements.story.modals.mark.text', { title: a.title || a.name })}</div>
        </div>`, {
            title: $t('game.achievements.story.modals.mark.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('game.achievements.story.modals.mark.button'), class: 'primary', icon: 'prime/check' },
        }).then((ok: boolean) => { if (ok) this.applyStory(a, true); });
    }

    /** Unmark the story achievement from the summary line (it may be on another page of the list). */
    unmarkStory(pg: PlatformGame) {
        if (!pg.story_achievement) return;
        this.applyStory(new Achievement({ id: pg.story_achievement.id }), false);
    }

    private applyStory(a: Achievement, marking: boolean) {
        this.changingStory[a.id] = true;
        a.setStoryCompletion(marking)
            .then((res: any) => {
                const message = marking
                    ? $t('game.achievements.story.notifications.marked', { count: res?.users_marked ?? 0 })
                    : $t('game.achievements.story.notifications.unmarked');
                App.notification(message).setType('success').setTime(4000).show();
                // Marking one unmarks the previous one, which may be on another page: reload both.
                this.loadAchievements();
                return this.reloadPlatforms();
            })
            .catch(() => App.notification($t('game.achievements.story.notifications.error')).setType('error').setTime(5000).show())
            .finally(() => { this.changingStory[a.id] = false; });
    }

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
