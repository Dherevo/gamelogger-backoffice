import { Model, http } from 'lib';

export default class Product extends Model {
    id: string = '';
    categoryId: string = '';
    categoryName: string = '';
    name: string = '';
    description: string = '';
    active: boolean = true;

    constructor(api?: any) {
        super();
        this.import(api);
        if (api && api.isActive !== undefined) this.active = api.isActive;
    }

    static list(categoryId?: string): Promise<Product[]> {
        const params: any = {};
        if (categoryId) params.categoryId = categoryId;
        return (http.get('/product').data(params).promise() as Promise<any>)
            .then((items: any[]) => items.map((d: any) => new Product(d)));
    }

    static findById(id: string): Promise<Product> {
        return (http.get(`/product/${id}`).promise() as Promise<any>)
            .then((data: any) => new Product(data));
    }

    save(): Promise<any> {
        const payload = {
            categoryId: this.categoryId,
            name: this.name,
            description: this.description,
            isActive: this.active,
        };
        return !this.id
            ? http.post('/product', payload).promise()
            : http.put(`/product/${this.id}`, payload).promise();
    }

    enable(): Promise<any> { return http.put(`/product/${this.id}`, { isActive: true }).promise(); }
    disable(): Promise<any> { return http.put(`/product/${this.id}`, { isActive: false }).promise(); }
    delete(): Promise<any> { return http.delete(`/product/${this.id}`).promise(); }
}
