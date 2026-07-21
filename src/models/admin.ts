import { http, IOption, Model, Time, $t } from 'lib';

export default class Admin extends Model {

    id: string = '';
    username: string = '';
    password: string = '';
    confirmPassword: string = '';
    name: string = '';
    surnames: string = '';
    email: string = '';
    telephone: string = '';
    role: number = 0;
    language: number = 0;
    registered?: Time;

    get fullName(): string {
        return `${this.name} ${this.surnames}`;
    }

    static get languageOptions(): IOption[] {
        return [
            { value: 0, content: $t('lang.es') },
            { value: 1, content: $t('lang.en') },
            { value: 2, content: $t('lang.fr') },
        ];
    }

    static get roleOptions(): IOption[] {
        return [
            { value: 0, content: $t('admin.roles.superadmin') },
            { value: 1, content: $t('admin.roles.adminCentro') },
        ];
    }

    constructor(api?: any) {
        super();
        this.import(api, {
            registered: (v: any) => {
                const date = v || api?.createdAt;
                return date ? new Time(date) : undefined;
            },
        });
    }

    static list(params: any = {}): Promise<{ perPage: number, totalItems: number, items: Admin[] }> {
        return (http.get('/user')
            .data(params)
            .promise() as Promise<any>)
            .then((res: any) => ({
                perPage: res.perPage,
                totalItems: res.totalItems,
                items: (res.items || []).map((a: any) => new Admin(a)),
            }));
    }

    static findById(id: string): Promise<Admin> {
        return (http.get(`/user/${id}`).promise() as Promise<any>)
            .then((data: any) => new Admin(data));
    }

    save() {
        const payload: any = {
            email: this.email,
            role: this.role,
            name: this.name,
            surnames: this.surnames,
            language: this.language,
        };
        if (this.username) payload.username = this.username;
        if (this.telephone) payload.telephone = this.telephone;

        if (!this.id) {
            if (this.password) payload.password = this.password;
            return http.post('/user', payload).promise();
        }
        return http.put(`/user/${this.id}`, payload).promise();
    }

    enable() { return http.post(`/user/${this.id}/enable`).promise(); }
    disable() { return http.post(`/user/${this.id}/disable`).promise(); }
    delete() { return http.delete(`/user/${this.id}`).promise(); }
    createPassword() { return http.post(`/user/${this.id}/create-password`).promise(); }

}
