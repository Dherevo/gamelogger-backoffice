import { App, FormInput, IOption, $t } from 'lib';
import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
import DecisionMatrix, { DecisionMatrixEntry } from '@/models/decisionMatrix';
import TreatmentAction from '@/models/treatmentAction';
import ProductCategory from '@/models/productCategory';
import Product from '@/models/product';

@Component({ components: { FormInput } })
class DecisionMatrixEditor extends Vue {
    @Prop() phaseId?: string;

    entries: DecisionMatrixEntry[] = [];
    fallback: DecisionMatrixEntry = new DecisionMatrixEntry({ isFallback: true });
    actions: TreatmentAction[] = [];
    categories: ProductCategory[] = [];
    productsByCat: Record<string, Product[]> = {};
    loading: boolean = true;
    saving: boolean = false;

    filterDesh: string = 'all';
    filterRojez: string = 'all';
    filterPicor: string = 'all';

    created() {
        Promise.all([
            DecisionMatrix.list(this.phaseId),
            DecisionMatrix.getFallback(this.phaseId),
            TreatmentAction.list(),
            ProductCategory.list(),
            Product.list(),
        ]).then(([entries, fallback, actions, cats, products]) => {
            this.entries = DecisionMatrix.generateGrid(entries, this.phaseId);
            this.fallback = fallback;
            this.actions = actions;
            this.categories = cats;
            cats.forEach(cat => {
                this.productsByCat[cat.id] = products.filter(p => p.categoryId === cat.id && p.active);
            });
        }).finally(() => { this.loading = false; });
    }

    get levelOptions(): IOption[] {
        return [
            { value: 'all', content: $t('decisionMatrix.filterAll') },
            { value: '0', content: '0' },
            { value: '1', content: '1' },
            { value: '2', content: '2' },
            { value: '3', content: '3' },
        ];
    }

    get filteredEntries(): DecisionMatrixEntry[] {
        return this.entries.filter(e => {
            if (this.filterDesh !== 'all' && e.deshidratacion !== Number(this.filterDesh)) return false;
            if (this.filterRojez !== 'all' && e.rojez !== Number(this.filterRojez)) return false;
            if (this.filterPicor !== 'all' && e.picor !== Number(this.filterPicor)) return false;
            return true;
        });
    }

    get actionOptions(): IOption[] {
        return this.actions.map(a => ({ value: a.id, content: a.code }));
    }

    productOptions(catId: string): IOption[] {
        return [
            { value: '', content: $t('decisionMatrix.noProduct') },
            ...(this.productsByCat[catId] || []).map(p => ({ value: p.id, content: p.name })),
        ];
    }

    entryKey(entry: DecisionMatrixEntry): string {
        return entry.id || `${entry.deshidratacion}-${entry.rojez}-${entry.picor}`;
    }

    saveAll() {
        this.saving = true;
        Promise.all([...this.entries, this.fallback].map(e => e.save()))
            .then(() => App.notification($t('decisionMatrix.notifications.success')).setType('success').setTime(3000).show())
            .catch(() => App.notification($t('decisionMatrix.notifications.error')).setType('error').setTime(5000).show())
            .finally(() => { this.saving = false; });
    }
}
export default toNative(DecisionMatrixEditor);
