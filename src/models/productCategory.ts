import { Model, http } from 'lib';

export default class ProductCategory extends Model {
    id: string = '';
    name: string = '';

    constructor(api?: any) {
        super();
        this.import(api);
    }

    static list(): Promise<ProductCategory[]> {
        return (http.get('/product-category').promise() as Promise<any>)
            .then((items: any[]) => items.map((d: any) => new ProductCategory(d)));
    }

    static findById(id: string): Promise<ProductCategory> {
        return (http.get(`/product-category/${id}`).promise() as Promise<any>)
            .then((data: any) => new ProductCategory(data));
    }

    static get asOptions(): Promise<{ value: string, content: string }[]> {
        return this.list().then(cats => cats.map(c => ({ value: c.id, content: c.name })));
    }

    save(): Promise<any> {
        const payload = { name: this.name };
        return !this.id
            ? http.post('/product-category', payload).promise()
            : http.put(`/product-category/${this.id}`, payload).promise();
    }

    delete(): Promise<any> { return http.delete(`/product-category/${this.id}`).promise(); }
}
