import { Model, http } from 'lib';

export default class TreatmentAction extends Model {
    id: string = '';
    code: string = '';
    patientDescription: string = '';

    constructor(api?: any) {
        super();
        this.import(api);
    }

    static list(): Promise<TreatmentAction[]> {
        return (http.get('/action').promise() as Promise<any>)
            .then((items: any[]) => items.map(d => new TreatmentAction(d)));
    }

    static findById(id: string): Promise<TreatmentAction> {
        return (http.get(`/action/${id}`).promise() as Promise<any>)
            .then((data: any) => new TreatmentAction(data));
    }

    save(): Promise<any> {
        return http.put(`/action/${this.id}`, { patientDescription: this.patientDescription }).promise();
    }
}
