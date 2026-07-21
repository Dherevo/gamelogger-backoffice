import { http, Model } from 'lib';

export default class Platform extends Model {

    id: number = 0;
    name: string = '';

    constructor(api?: any) {
        super();
        this.import(api);
    }

    static list(): Promise<Platform[]> {
        return (http.get('/admin/platforms').promise() as Promise<any>)
            .then((items: any[]) => (items || []).map((p: any) => new Platform(p)));
    }

    save(): Promise<any> {
        const payload = { name: this.name };
        return !this.id
            ? http.post('/admin/platforms', payload).promise()
            : http.put(`/admin/platforms/${this.id}`, payload).promise();
    }

    delete(): Promise<any> {
        return http.delete(`/admin/platforms/${this.id}`).promise();
    }
}
