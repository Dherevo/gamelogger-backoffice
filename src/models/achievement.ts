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

    setTranslation(locale: GameLocale): Promise<any> {
        return http.put(`/admin/achievements/${this.id}/translations/${locale}`, {
            title: this.translations[locale],
        }).promise();
    }
}
