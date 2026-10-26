import { http, Model } from 'lib';
import PlatformGame from './platformGame';

export type GameLocale = 'ca' | 'es' | 'en';
export const GAME_LOCALES: GameLocale[] = ['ca', 'es', 'en'];

export interface GameLanguage {
    name: string;          // as Steam writes it ("Catalan", "Spanish - Spain")
    text: boolean;
    audio: boolean;
    is_mod: boolean;       // exists thanks to a fan-made mod
    mod_url: string | null;
}

/** The languages Steam lists for a game: the names must match, they are what rules and Steam's own rows go by. */
export const STEAM_LANGUAGES: string[] = [
    'Arabic', 'Basque', 'Bulgarian', 'Catalan', 'Czech', 'Danish', 'Dutch', 'English', 'Finnish', 'French',
    'Galician', 'German', 'Greek', 'Hungarian', 'Indonesian', 'Italian', 'Japanese', 'Korean', 'Norwegian',
    'Polish', 'Portuguese - Brazil', 'Portuguese - Portugal', 'Romanian', 'Russian', 'Simplified Chinese',
    'Spanish - Latin America', 'Spanish - Spain', 'Swedish', 'Thai', 'Traditional Chinese', 'Turkish',
    'Ukrainian', 'Vietnamese',
];

export interface GameListResponse {
    total: number;
    pageSize: number;
    offset: number;
    items: Game[];
}

export default class Game extends Model {

    id: number = 0;
    name: string = '';
    year: string = '';
    publisher: string = '';
    developer: string = '';
    hide: boolean = false;
    icon: string = '';
    logo: string = '';
    is_manual: boolean = false;
    has_story_achievement: boolean = false; // a "story completed" achievement has been chosen (list only)
    achievements_count: number = 0;         // synced achievements (list only)
    platform_names: string[] = [];          // platforms the game is attached to (list only)

    // Per-locale name translations (only present after findById()).
    translations: Record<GameLocale, string> = { ca: '', es: '', en: '' };
    platforms: PlatformGame[] = [];
    languages: GameLanguage[] = [];

    constructor(api?: any) {
        super();
        if (api) {
            const rest = { ...api };
            delete rest.translations;
            delete rest.platforms;
            delete rest.languages;
            this.import(rest);

            if (api.translations) {
                for (const locale of GAME_LOCALES) {
                    this.translations[locale] = api.translations[locale]?.name ?? '';
                }
            }
            this.languages = (api.languages || []).map((l: any) => ({
                name: l.name, text: !!l.text, audio: !!l.audio, is_mod: !!l.is_mod, mod_url: l.mod_url || null,
            }));
            if (api.platforms) {
                this.platforms = api.platforms.map((p: any) => new PlatformGame(p));
            }
        }
    }

    static list(params: any = {}): Promise<GameListResponse> {
        return (http.get('/admin/games').data(params).promise() as Promise<any>)
            .then((res: any) => ({
                total: res.total,
                pageSize: res.pageSize,
                offset: res.offset,
                items: (res.items || []).map((g: any) => new Game(g)),
            }));
    }

    static findById(id: number | string): Promise<Game> {
        return (http.get(`/admin/games/${id}`).promise() as Promise<any>)
            .then((data: any) => new Game(data));
    }

    save(): Promise<any> {
        const payload: any = {
            name: this.name,
            year: this.year,
            publisher: this.publisher,
            developer: this.developer,
            hide: this.hide,
        };
        return !this.id
            ? http.post('/admin/games', payload).promise()
            : http.put(`/admin/games/${this.id}`, payload).promise();
    }

    delete(): Promise<any> {
        return http.delete(`/admin/games/${this.id}`).promise();
    }

    setTranslation(locale: GameLocale): Promise<any> {
        return http.put(`/admin/games/${this.id}/translations/${locale}`, { name: this.translations[locale] }).promise();
    }

    saveLanguages(): Promise<any> {
        return http.put(`/admin/games/${this.id}/languages`, { languages: this.languages }).promise();
    }

    uploadIcon(file: File): Promise<any> {
        return http.post(`/admin/games/${this.id}/icon`).data({ icon: file }).multipart().promise();
    }

    deleteIcon(): Promise<any> {
        return http.delete(`/admin/games/${this.id}/icon`).promise();
    }

    uploadLogo(file: File): Promise<any> {
        return http.post(`/admin/games/${this.id}/logo`).data({ logo: file }).multipart().promise();
    }

    deleteLogo(): Promise<any> {
        return http.delete(`/admin/games/${this.id}/logo`).promise();
    }
}
