import { http, Model } from 'lib';

export interface UserListResponse {
    total: number;
    pageSize: number;
    offset: number;
    items: User[];
}

export default class User extends Model {

    id: number = 0;
    name: string = '';
    nickname: string = '';
    email: string = '';
    password: string = '';
    isAdmin: boolean = false;
    locale: string | null = null;              // ca / es / en, null = not set
    profile_visibility: string = 'public';     // public / friends / private
    created_at: string = '';
    steam_id: string = '';                     // SteamID64 of the linked Steam account, '' = none
    steam_last_synced_at: string | null = null;
    games_count: number = 0;
    completed_games: number = 0;

    constructor(api?: any) {
        super();
        this.import(api);
    }

    static list(params: any = {}): Promise<UserListResponse> {
        return (http.get('/users').data(params).promise() as Promise<any>)
            .then((res: any) => ({
                total: res.total,
                pageSize: res.pageSize,
                offset: res.offset,
                items: (res.items || []).map((u: any) => new User(u)),
            }));
    }

    static findById(id: number | string): Promise<User> {
        return (http.get(`/users/${id}`).promise() as Promise<any>)
            .then((data: any) => new User(data));
    }

    save(): Promise<any> {
        const payload: any = {
            name: this.name,
            nickname: this.nickname,
            email: this.email,
            isAdmin: this.isAdmin,
        };
        // Only send the password when the admin actually typed one, so an empty
        // field on edit doesn't overwrite the existing password.
        if (this.password) payload.password = this.password;

        if (!this.id) {
            return http.post('/users/create', payload).promise();
        }

        // Only on edit. An empty Steam ID unlinks the account (the games already imported stay).
        payload.steam_id = (this.steam_id || '').trim();
        payload.locale = this.locale || null;
        payload.profile_visibility = this.profile_visibility;
        return http.put(`/users/${this.id}/edit`, payload).promise();
    }

    delete(): Promise<any> {
        return http.delete(`/users/${this.id}/delete`).promise();
    }
}
