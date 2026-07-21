import { App, Store, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Symptom from '@/models/symptom';
import Message from 'primevue/message';

@Component({ components: { Message } })
class SymptomsIndexPage extends Vue {
    symptoms: Symptom[] = [];
    loading: boolean = true;
    saving: boolean = false;
    message: string = Store.getSync('message');
    draggedIndex: number | null = null;
    dragOverIndex: number | null = null;

    created() {
        Store.clear('message');
        Symptom.list().then(items => {
            this.symptoms = [...items].sort((a, b) => a.displayOrder - b.displayOrder);
        }).finally(() => { this.loading = false; });
    }

    onDragStart(index: number) {
        this.draggedIndex = index;
    }

    onDragOver(index: number) {
        this.dragOverIndex = index;
    }

    onDrop(index: number) {
        if (this.draggedIndex === null || this.draggedIndex === index) {
            this.draggedIndex = null;
            this.dragOverIndex = null;
            return;
        }
        const items = [...this.symptoms];
        const [moved] = items.splice(this.draggedIndex, 1);
        items.splice(index, 0, moved);
        items.forEach((s, i) => { s.displayOrder = i + 1; });
        this.symptoms = items;
        this.draggedIndex = null;
        this.dragOverIndex = null;
    }

    onDragEnd() {
        this.draggedIndex = null;
        this.dragOverIndex = null;
    }

    toggleStatus(symptom: Symptom) {
        const action = symptom.active ? 'disable' : 'enable';
        const method = symptom.active ? symptom.disable() : symptom.enable();
        method
            .then(() => {
                symptom.active = !symptom.active;
                App.notification($t(`symptom.notifications.${action}.success`)).setType('success').setTime(3000).show();
            })
            .catch(() => App.notification($t(`symptom.notifications.${action}.error`)).setType('error').setTime(5000).show());
    }

    goEdit(symptom: Symptom) {
        Store.set('symptom', symptom);
        this.to(`/symptoms/update/${symptom.id}`);
    }

    saveOrder() {
        this.saving = true;
        Symptom.saveOrder(this.symptoms)
            .then(() => App.notification($t('symptom.index.orderSaved')).setType('success').setTime(3000).show())
            .catch(() => App.notification($t('symptom.index.orderError')).setType('error').setTime(5000).show())
            .finally(() => { this.saving = false; });
    }
}
export default toNative(SymptomsIndexPage);
