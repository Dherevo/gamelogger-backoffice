import { Model, http } from 'lib';

export default class TreatmentPhase extends Model {
    id: string = '';
    name: string = '';
    startWeek: number = 1;
    endWeek: number = 4;
    description: string = '';
    useOwnMatrix: boolean = false;
    tasks: string[] = [];

    constructor(api?: any) {
        super();
        this.import(api);
    }

    static list(): Promise<TreatmentPhase[]> {
        return (http.get('/treatment-phase').promise() as Promise<any>)
            .then((items: any[]) => items.map((d: any) => new TreatmentPhase(d)));
    }

    static findById(id: string): Promise<TreatmentPhase> {
        return (http.get(`/treatment-phase/${id}`).promise() as Promise<any>)
            .then((data: any) => new TreatmentPhase(data));
    }

    save(): Promise<any> {
        const payload = {
            name: this.name,
            startWeek: this.startWeek,
            endWeek: this.endWeek,
            description: this.description,
            useOwnMatrix: this.useOwnMatrix,
            tasks: this.tasks,
        };
        return !this.id
            ? http.post('/treatment-phase', payload).promise()
            : http.put(`/treatment-phase/${this.id}`, payload).promise();
    }

    delete(): Promise<any> { return http.delete(`/treatment-phase/${this.id}`).promise(); }
}
