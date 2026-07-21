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

        return !this.id
            ? http.post('/users/create', payload).promise()
            : http.put(`/users/${this.id}/edit`, payload).promise();
    }

    delete(): Promise<any> {
        return http.delete(`/users/${this.id}/delete`).promise();
    }
}
