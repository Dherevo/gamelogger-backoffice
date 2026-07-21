import { Model, http, IOption, Time, $t } from 'lib';

export default class Patient extends Model {

    id: string = '';
    name: string = '';
    surnames: string = '';
    email: string = '';
    telephone: string = '';
    language: number = 0;
    password: string = '';
    confirmPassword: string = '';
    status: boolean = false;
    verified: boolean = false;
    registered?: Time;
    birthDate: string = '';
    country: string = '';
    gender: string = '';
    distributionCenterId: string = '';
    distributionCenterName: string = '';
    patientCode: string = '';
    treatmentStatus: number = 0;
    treatmentStartDate: string = '';

    constructor(api?: any) {
        super();
        this.import(api, {
            registered: (v: any) => {
                const date = v || api?.createdAt;
                return date ? new Time(date) : undefined;
            },
        });
    }

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

    static get genderOptions(): IOption[] {
        return [
            { value: 'M', content: $t('patients.genders.male') },
            { value: 'F', content: $t('patients.genders.female') },
        ];
    }

    static get treatmentStatusOptions(): IOption[] {
        return [
            { value: 0, content: $t('patients.treatmentStatuses.active') },
            { value: 1, content: $t('patients.treatmentStatuses.completed') },
            { value: 2, content: $t('patients.treatmentStatuses.abandoned') },
        ];
    }

    static list(params: any = {}): Promise<{ perPage: number, totalItems: number, items: Patient[] }> {
        return (http.get('/patient')
            .data(params)
            .promise() as Promise<any>)
            .then((res: any) => ({
                perPage: res.perPage,
                totalItems: res.totalItems,
                items: (res.items || []).map((p: any) => new Patient(p)),
            }));
    }

    static findById(id: string): Promise<Patient> {
        return (http.get(`/patient/${id}`).promise() as Promise<any>)
            .then((data: any) => new Patient(data));
    }

    save() {
        const payload: any = {
            email: this.email,
            name: this.name,
            surnames: this.surnames,
            language: this.language,
        };
        if (this.telephone) payload.telephone = this.telephone;
        if (this.birthDate) payload.birthDate = this.birthDate;
        if (this.country) payload.country = this.country;
        if (this.gender) payload.gender = this.gender;
        if (this.distributionCenterId) payload.distributionCenterId = this.distributionCenterId;
        if (this.treatmentStartDate) payload.treatmentStartDate = this.treatmentStartDate;

        if (!this.id) {
            payload.patientCode = this.patientCode;
            return http.post('/patient', payload).promise();
        }
        payload.treatmentStatus = this.treatmentStatus;
        return http.put(`/patient/${this.id}`, payload).promise();
    }

    enable() { return http.post(`/patient/${this.id}/enable`).promise(); }
    disable() { return http.post(`/patient/${this.id}/disable`).promise(); }
    delete() { return http.delete(`/patient/${this.id}`).promise(); }
    createPassword() { return http.post(`/patient/${this.id}/create-password`).promise(); }

}
