import { http, Model } from 'lib';

/**
 * A platform attached to a game (the platform_games pivot). `id` is the platform id.
 * All write operations are scoped to the owning game id.
 */
export default class PlatformGame extends Model {

    id: number = 0;              // platform id
    name: string = '';          // platform name
    key: string = '';           // platform-specific key (Steam appid, PSN id, ...)
    achievements_synced_at: string | null = null;
    story_achievement: { id: number; name: string; title: string } | null = null; // "story completed" achievement

    constructor(api?: any) {
        super();
        this.import(api);
    }

    static attach(gameId: number | string, platformId: number, key: string): Promise<any> {
        return http.post(`/admin/games/${gameId}/platforms`, { platform_id: platformId, key }).promise();
    }

    /** Store page for this key, when the platform has one we know how to link to (only Steam for now). */
    get url(): string | null {
        return this.name.toLowerCase() === 'steam' && this.key ? `https://store.steampowered.com/app/${this.key}/` : null;
    }

    resetSync(gameId: number | string): Promise<any> {
        return http.put(`/admin/games/${gameId}/platforms/${this.id}`, { reset_achievements_synced_at: true }).promise();
    }

    detach(gameId: number | string): Promise<any> {
        return http.delete(`/admin/games/${gameId}/platforms/${this.id}`).promise();
    }
}
