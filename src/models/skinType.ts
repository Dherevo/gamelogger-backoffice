import { Model, http } from 'lib';

export default class SkinType extends Model {
    id: string = '';
    name: string = '';
    description: string = '';
    active: boolean = true;

    constructor(api?: any) {
        super();
        this.import(api);
        if (api && api.isActive !== undefined) this.active = api.isActive;
    }

    static list(params: { activeOnly?: boolean } = {}): Promise<SkinType[]> {
        return (http.get('/skin-type').data(params).promise() as Promise<any>)
            .then((items: any[]) => items.map((d: any) => new SkinType(d)));
    }

    static findById(id: string): Promise<SkinType> {
        return (http.get(`/skin-type/${id}`).promise() as Promise<any>)
            .then((data: any) => new SkinType(data));
    }

    save(): Promise<any> {
        const payload = { name: this.name, description: this.description, isActive: this.active };
        return !this.id
            ? http.post('/skin-type', payload).promise()
            : http.put(`/skin-type/${this.id}`, payload).promise();
    }

    enable(): Promise<any> { return http.put(`/skin-type/${this.id}`, { isActive: true }).promise(); }
    disable(): Promise<any> { return http.put(`/skin-type/${this.id}`, { isActive: false }).promise(); }
    delete(): Promise<any> { return http.delete(`/skin-type/${this.id}`).promise(); }
}
