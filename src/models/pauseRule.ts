import { Model, http, Time } from 'lib';

export default class PauseRule extends Model {
    id: string = '';
    name: string = '';
    message: string = '';
    active: boolean = true;
    createdAt?: Time;

    private originalName: string = '';

    constructor(api?: any) {
        super();
        this.import(api, {
            active: (v: any) => (api?.isActive !== undefined ? api.isActive : v ?? true),
            createdAt: (v: any) => v ? new Time(v) : undefined,
        });
        this.originalName = api?.name ?? '';
    }

    static list(params: { activeOnly?: boolean } = {}): Promise<PauseRule[]> {
        return (http.get('/pauserule').data(params).promise() as Promise<any>)
            .then((items: any[]) => items.map((d: any) => new PauseRule(d)));
    }

    static findById(id: string): Promise<PauseRule> {
        return (http.get(`/pauserule/${id}`).promise() as Promise<any>)
            .then((data: any) => new PauseRule(data));
    }

    save(): Promise<any> {
        if (!this.id) {
            return http.post('/pauserule', {
                name: this.name,
                symptomBoolean: true,
                triggerValue: null,
                message: this.message,
            }).promise();
        }

        const payload: any = { message: this.message };
        if (this.name !== this.originalName) payload.name = this.name;
        return http.put(`/pauserule/${this.id}`, payload).promise();
    }

    private setActive(active: boolean): Promise<any> {
        return http.put(`/pauserule/${this.id}`, { isActive: active }).promise();
    }

    enable(): Promise<any> { return this.setActive(true); }
    disable(): Promise<any> { return this.setActive(false); }
    delete(): Promise<any> { return http.delete(`/pauserule/${this.id}`).promise(); }
}
