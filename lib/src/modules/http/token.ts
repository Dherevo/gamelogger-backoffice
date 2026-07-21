import { Storage } from "../storage";
import HttpError from "./error";
import { jwtDecode } from 'jwt-decode';

export default class ApiToken {

    private token: string = '';
    private refreshToken: string = '';
    private expiration: number = -1;

    public refreshing: boolean = false;

    public get(): string { return this.token; }
    public getRefreshToken(): string { return this.refreshToken; }

    public remove() {
        this.token = '';
        this.refreshToken = '';
        Storage.remove('token');
        Storage.remove('refreshToken');
    }

    public set(token: string, refreshToken?: string) {
        this.token = token;
        if (refreshToken) {
            this.refreshToken = refreshToken;
        }
        this.parseToken();
    }

    private parseToken() {
        this.expiration = -1;
        if (!this.token) return;
        try {
            let tk = this.token;
            if (tk.startsWith('Bearer ')) {
                tk = tk.substring(7);
            }

            if (!tk.startsWith('ey')) {
                return;
            }
            const payload = jwtDecode(tk);
            if (!payload || !payload.exp) return;

            this.expiration = payload.exp;
        } catch (e) {
            this.expiration = -1;   
        }
    }

    public shouldRefresh() : boolean {
        if (!this.token) return false;
        if (this.expiration == -1) return false;
        return Date.now() > this.expiration * 1000;
    }

    public loadFromStorage() {
        const tk = Storage.get('token');
        const rtk = Storage.get('refreshToken');
        if (tk) {
            this.set(tk, rtk);
        }
    }

    public save(token: string, refreshToken?: string) {
        this.set(token, refreshToken);
        Storage.set('token', token);
        Storage.set('refreshToken', refreshToken);
    }

    public CheckIfExpired: (error: HttpError) => Promise<boolean>
    = () => Promise.resolve(false)

    public Refresh: () => Promise<boolean>
        = () => Promise.resolve(false)

}