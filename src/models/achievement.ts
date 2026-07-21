import { http, Model } from 'lib';
import { GAME_LOCALES, GameLocale } from './game';

/**
 * An achievement synced for a game from Steam/PSN. `name` (internal identifier)
 * and `icon` (external URL) are read-only — they come from the platform sync.
 * `title`, `description` and `hidden` are editable for manual corrections.
 */
export default class Achievement extends Model {

    id: number = 0;
    name: string = '';           // internal Steam/PSN identifier (read-only)
    title: string = '';
    description: string = '';
    icon: string = '';           // full URL (read-only)
    hidden: boolean = false;
    platform: string = '';

    // Per-locale title translations. Empty string when no translation row exists.
    translations: Record<GameLocale, string> = { ca: '', es: '', en: '' };

    constructor(api?: any) {
        super();
        if (api) {
            const rest = { ...api };
            delete rest.translations;
            this.import(rest);
            this.hidden = !!rest.hidden;

            if (api.translations) {
                for (const locale of GAME_LOCALES) {
                    this.translations[locale] = api.translations[locale]?.title ?? '';
                }
            }
        }
    }

    static listForGame(gameId: number | string): Promise<Achievement[]> {
        return (http.get(`/admin/games/${gameId}/achievements`).promise() as Promise<any>)
            .then((res: any) => (res || []).map((a: any) => new Achievement(a)));
    }

    save(): Promise<any> {
        return http.put(`/admin/achievements/${this.id}`, {
            title: this.title,
            description: this.description,
            hidden: this.hidden,
        }).promise();
    }

    setTranslation(locale: GameLocale): Promise<any> {
        return http.put(`/admin/achievements/${this.id}/translations/${locale}`, {
            title: this.translations[locale],
        }).promise();
    }
}
