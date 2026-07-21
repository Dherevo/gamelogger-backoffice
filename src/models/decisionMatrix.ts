import { http } from 'lib';

export const MATRIX_SYMPTOM_NAMES = {
    deshidratacion: 'Deshidratación',
    rojez: 'Rojez',
    picor: 'Picor/Escozor',
};

export const DEFAULT_ACTION_ID = '00000000-0000-0000-0000-000000000001'; // MANTENER

interface IProductAssignment {
    categoryId: string;
    categoryName?: string;
    productId: string | null;
    productName?: string;
}

function findSymptomValue(combination: Record<string, number> | null, name: string): number {
    if (!combination) return 0;
    const key = Object.keys(combination).find(k => k.toLowerCase() === name.toLowerCase());
    return key !== undefined ? combination[key] : 0;
}

export class DecisionMatrixEntry {
    id: string = '';
    phaseId?: string;
    symptomCombination: Record<string, number> | null = {};
    actionId: string = DEFAULT_ACTION_ID;
    actionCode: string = '';
    actionDescription: string = '';
    productAssignments: IProductAssignment[] = [];
    includesAmpoules: boolean = false;
    isFallback: boolean = false;

    constructor(api?: any) {
        if (!api) return;
        this.id = api.id ?? '';
        this.phaseId = api.phaseId;
        this.symptomCombination = api.symptomCombination !== undefined ? api.symptomCombination : {};
        this.actionId = api.actionId ?? DEFAULT_ACTION_ID;
        this.actionCode = api.actionCode ?? '';
        this.actionDescription = api.actionDescription ?? '';
        this.productAssignments = (api.productAssignments || []).map((p: any) => ({ ...p }));
        this.includesAmpoules = api.includesAmpoules ?? false;
        this.isFallback = api.isFallback ?? false;
    }

    private get basePath(): string {
        return this.phaseId ? `/treatment-phase/${this.phaseId}/matrix` : '/decision-matrix';
    }

    private setSymptomValue(name: string, value: number) {
        if (!this.symptomCombination) this.symptomCombination = {};
        const existingKey = Object.keys(this.symptomCombination).find(k => k.toLowerCase() === name.toLowerCase());
        if (existingKey) this.symptomCombination[existingKey] = value;
        else this.symptomCombination[name] = value;
    }

    get deshidratacion(): number { return findSymptomValue(this.symptomCombination, MATRIX_SYMPTOM_NAMES.deshidratacion); }
    set deshidratacion(v: number) { this.setSymptomValue(MATRIX_SYMPTOM_NAMES.deshidratacion, v); }
    get rojez(): number { return findSymptomValue(this.symptomCombination, MATRIX_SYMPTOM_NAMES.rojez); }
    set rojez(v: number) { this.setSymptomValue(MATRIX_SYMPTOM_NAMES.rojez, v); }
    get picor(): number { return findSymptomValue(this.symptomCombination, MATRIX_SYMPTOM_NAMES.picor); }
    set picor(v: number) { this.setSymptomValue(MATRIX_SYMPTOM_NAMES.picor, v); }

    productId(categoryId: string): string {
        return this.productAssignments.find(p => p.categoryId === categoryId)?.productId || '';
    }

    setProductId(categoryId: string, productId: string) {
        const existing = this.productAssignments.find(p => p.categoryId === categoryId);
        if (existing) existing.productId = productId || null;
        else this.productAssignments.push({ categoryId, productId: productId || null });
    }

    private toPayload() {
        return {
            actionId: this.actionId,
            symptomCombination: this.symptomCombination,
            productAssignments: this.productAssignments.map(p => ({ categoryId: p.categoryId, productId: p.productId || null })),
            includesAmpoules: this.includesAmpoules,
        };
    }

    private applyResponse(data: any) {
        this.id = data.id ?? this.id;
        this.actionCode = data.actionCode ?? this.actionCode;
        this.actionDescription = data.actionDescription ?? this.actionDescription;
        if (data.productAssignments) this.productAssignments = data.productAssignments;
        return this;
    }

    save(): Promise<any> {
        if (this.isFallback) {
            return (http.put(`${this.basePath}/fallback`, {
                actionId: this.actionId,
                productAssignments: this.toPayload().productAssignments,
                includesAmpoules: this.includesAmpoules,
            }).promise() as Promise<any>).then((data: any) => this.applyResponse(data));
        }
        const req = !this.id
            ? http.post(this.basePath, this.toPayload())
            : http.put(`${this.basePath}/${this.id}`, this.toPayload());
        return (req.promise() as Promise<any>).then((data: any) => this.applyResponse(data));
    }

    delete(): Promise<any> {
        if (this.isFallback) return http.delete(`${this.basePath}/fallback`).promise();
        return http.delete(`${this.basePath}/${this.id}`).promise();
    }
}

export default class DecisionMatrix {

    static list(phaseId?: string): Promise<DecisionMatrixEntry[]> {
        const path = phaseId ? `/treatment-phase/${phaseId}/matrix` : '/decision-matrix';
        return (http.get(path).promise() as Promise<any>)
            .then((items: any[]) => items.map((d: any) => new DecisionMatrixEntry({ ...d, phaseId })));
    }

    static getFallback(phaseId?: string): Promise<DecisionMatrixEntry> {
        const path = phaseId ? `/treatment-phase/${phaseId}/matrix/fallback` : '/decision-matrix/fallback';
        return (http.get(path).promise() as Promise<any>)
            .then((data: any) => new DecisionMatrixEntry({ ...data, isFallback: true, phaseId }))
            .catch(() => new DecisionMatrixEntry({ isFallback: true, symptomCombination: null, phaseId }));
    }

    static generateGrid(entries: DecisionMatrixEntry[], phaseId?: string): DecisionMatrixEntry[] {
        const grid: DecisionMatrixEntry[] = [];
        for (let d = 0; d <= 3; d++) {
            for (let r = 0; r <= 3; r++) {
                for (let p = 0; p <= 3; p++) {
                    const found = entries.find(e => e.deshidratacion === d && e.rojez === r && e.picor === p);
                    if (found) { grid.push(found); continue; }
                    const entry = new DecisionMatrixEntry({ phaseId });
                    entry.deshidratacion = d;
                    entry.rojez = r;
                    entry.picor = p;
                    grid.push(entry);
                }
            }
        }
        return grid;
    }
}
