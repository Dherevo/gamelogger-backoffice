import { Model, http } from 'lib';

export class SymptomGrade extends Model {
    id: string = '';
    symptomId: string = '';
    value: number = 0;
    label: string = '';
    description: string = '';
    characteristics: string = '';
    imageUrl: string = '';

    constructor(api?: any) {
        super();
        this.import(api);
    }

    save(): Promise<any> {
        const payload = {
            value: this.value,
            label: this.label,
            description: this.description,
            characteristics: this.characteristics,
        };
        return !this.id
            ? http.post(`/symptom/${this.symptomId}/grade`, payload).promise()
            : http.put(`/symptom/${this.symptomId}/grade/${this.id}`, payload).promise();
    }

    delete(): Promise<any> {
        return http.delete(`/symptom/${this.symptomId}/grade/${this.id}`).promise();
    }

    uploadImage(file: File): Promise<any> {
        return http.post(`/symptom/${this.symptomId}/grade/${this.id}/image`)
            .data({ image: file })
            .multipart()
            .promise();
    }

    deleteImage(): Promise<any> {
        return http.delete(`/symptom/${this.symptomId}/grade/${this.id}/image`).promise();
    }
}

const TYPE_TO_API: Record<string, number> = { scale: 0, boolean: 1 };
const TYPE_FROM_API: Record<number, string> = { 0: 'scale', 1: 'boolean' };

export default class Symptom extends Model {
    id: string = '';
    name: string = '';
    description: string = '';
    type: string = 'scale';
    displayOrder: number = 0;
    required: boolean = true;
    active: boolean = true;
    grades: SymptomGrade[] = [];

    constructor(api?: any) {
        super();
        if (api) {
            const grades = api.grades || [];
            const rest = { ...api };
            delete rest.grades;
            this.import(rest);
            if (api.type !== undefined) this.type = TYPE_FROM_API[api.type] ?? 'scale';
            if (api.order !== undefined) this.displayOrder = api.order;
            if (api.isRequired !== undefined) this.required = api.isRequired;
            if (api.isActive !== undefined) this.active = api.isActive;
            this.grades = grades.map((g: any) => new SymptomGrade({ ...g, symptomId: this.id }));
        }
    }

    get typeLabel(): string {
        return this.type === 'scale' ? 'Escala' : 'Booleano';
    }

    static list(params: { activeOnly?: boolean } = {}): Promise<Symptom[]> {
        return (http.get('/symptom').data(params).promise() as Promise<any>)
            .then((items: any[]) => items.map((d: any) => new Symptom(d)));
    }

    static findById(id: string): Promise<Symptom> {
        return (http.get(`/symptom/${id}`).promise() as Promise<any>)
            .then((data: any) => new Symptom(data));
    }

    private toPayload() {
        return {
            name: this.name,
            description: this.description,
            type: TYPE_TO_API[this.type] ?? 0,
            order: this.displayOrder,
            isRequired: this.required,
            isActive: this.active,
        };
    }

    save(): Promise<any> {
        return !this.id
            ? http.post('/symptom', this.toPayload()).promise()
            : http.put(`/symptom/${this.id}`, this.toPayload()).promise();
    }

    enable(): Promise<any> { return http.put(`/symptom/${this.id}`, { isActive: true }).promise(); }
    disable(): Promise<any> { return http.put(`/symptom/${this.id}`, { isActive: false }).promise(); }
    delete(): Promise<any> { return http.delete(`/symptom/${this.id}`).promise(); }

    static saveOrder(symptoms: Symptom[]): Promise<Symptom[]> {
        const items = symptoms.map(s => ({ id: s.id, order: s.displayOrder }));
        return (http.put('/symptom/reorder', { items }).promise() as Promise<any>)
            .then((res: any[]) => res.map((d: any) => new Symptom(d)));
    }
}
