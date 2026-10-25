import { http, Model } from 'lib';
import { GAME_LOCALES, GameLocale } from './game';

export interface AchievementListResponse {
    total: number;
    pageSize: number;
    offset: number;
    items: Achievement[];
}

/**
 * An achievement synced for a game from Steam/PSN. `name` (internal identifier)
 * and `icon` (external URL) are read-only — they come from the platform sync.
 * `title` and `description` are editable for manual corrections.
 */
export default class Achievement extends Model {

    id: number = 0;
    name: string = '';           // internal Steam/PSN identifier (read-only)
    title: string = '';
    description: string = '';
    icon: string = '';           // full URL (read-only)
    platform: string = '';

    // The achievement that means "story completed" for its game (at most one per game).
    // Changed on its own (see setStoryCompletion), not through save(): marking it has effects on players.
    is_story_completion: boolean = false;

    // Per-locale title translations. Empty string when no translation row exists.
    translations: Record<GameLocale, string> = { ca: '', es: '', en: '' };

    constructor(api?: any) {
        super();
        if (api) {
            const rest = { ...api };
            delete rest.translations;
            this.import(rest);

            if (api.translations) {
                for (const locale of GAME_LOCALES) {
                    this.translations[locale] = api.translations[locale]?.title ?? '';
                }
            }
        }
    }

    static listForGame(gameId: number | string, params: any = {}): Promise<AchievementListResponse> {
        return (http.get(`/admin/games/${gameId}/achievements`).data(params).promise() as Promise<any>)
            .then((res: any) => ({
                total: res.total,
                pageSize: res.pageSize,
                offset: res.offset,
                items: (res.items || []).map((a: any) => new Achievement(a)),
            }));
    }

    save(): Promise<any> {
        return http.put(`/admin/achievements/${this.id}`, {
            title: this.title,
            description: this.description,
        }).promise();
    }

    /**
     * Marks (or unmarks) this achievement as the one that completes the game's story. Marking it
     * unmarks the game's previous one, and players who already unlocked it are marked as having
     * completed the game. Resolves with `users_marked` (players evaluated just now).
     */
    setStoryCompletion(value: boolean): Promise<{ users_marked?: number }> {
        return http.put(`/admin/achievements/${this.id}`, { is_story_completion: value }).promise() as Promise<any>;
    }

    setTranslation(locale: GameLocale): Promise<any> {
        return http.put(`/admin/achievements/${this.id}/translations/${locale}`, {
            title: this.translations[locale],
        }).promise();
    }
}
