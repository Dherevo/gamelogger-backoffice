import { http, Model, Time } from 'lib';

export default class Distributor extends Model {

    id: string = '';
    name: string = '';
    email: string = '';
    telephone: string = '';
    address: string = '';
    country: string = '';
    status: boolean = true;
    registered?: Time;

    constructor(api?: any) {
        super();
        this.import(api, {
            registered: (v: any) => {
                const date = v || api?.createdAt;
                return date ? new Time(date) : undefined;
            },
        });
        if (api?.contactEmail !== undefined) this.email = api.contactEmail;
        if (api?.contactPhone !== undefined) this.telephone = api.contactPhone;
    }

    static list(params: any = {}): Promise<{ perPage: number, totalItems: number, items: Distributor[] }> {
        return (http.get('/distributioncenter')
            .data(params)
            .promise() as Promise<any>)
            .then((res: any) => ({
                perPage: res.perPage,
                totalItems: res.totalItems,
                items: (res.items || []).map((d: any) => new Distributor(d)),
            }));
    }

    static findById(id: string): Promise<Distributor> {
        return (http.get(`/distributioncenter/${id}`).promise() as Promise<any>)
            .then((data: any) => new Distributor(data));
    }

    save() {
        const payload: any = {
            name: this.name,
            address: this.address,
            country: this.country,
            contactEmail: this.email,
            contactPhone: this.telephone,
        };
        if (this.id) payload.status = this.status;

        if (!this.id) return http.post('/distributioncenter', payload).promise();
        return http.put(`/distributioncenter/${this.id}`, payload).promise();
    }

    delete() { return http.delete(`/distributioncenter/${this.id}`).promise(); }
    enable() { return http.post(`/distributioncenter/${this.id}/enable`).promise(); }
    disable() { return http.post(`/distributioncenter/${this.id}/disable`).promise(); }

}
