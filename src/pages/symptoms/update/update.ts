import { App, FormInput, Store, Validator, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Symptom, { SymptomGrade } from '@/models/symptom';

@Component({ components: { FormInput } })
class SymptomUpdatePage extends Vue {
    symptom: Symptom = new Symptom();
    validator: Validator = new Validator();
    saving: boolean = false;
    gradeFiles: Record<string, File | null> = {};

    created() {
        const id = (this as any).$route?.params?.id as string;
        if (!id) { this.to('/symptoms'); return; }
        const stored = Store.getSync('symptom');
        Store.clear('symptom');
        if (stored && stored.id === id) {
            this.symptom = new Symptom(stored);
        } else {
            Symptom.findById(id).then(s => { this.symptom = s; }).catch(() => this.to('/symptoms'));
        }
    }

    save() {
        if (!this.validator.validate()) return;
        this.saving = true;
        this.symptom.save()
            .then(() => {
                Store.set('message', $t('symptom.update.notifications.success'));
                this.to('/symptoms');
            })
            .catch(() => App.notification($t('symptom.update.notifications.error')).setType('error').setTime(5000).show())
            .finally(() => { this.saving = false; });
    }

    saveGrade(grade: SymptomGrade) {
        grade.save()
            .then(() => App.notification($t('symptom.update.notifications.gradeSaved')).setType('success').setTime(3000).show())
            .catch(() => App.notification($t('symptom.update.notifications.error')).setType('error').setTime(5000).show());
    }

    setGradeImage(grade: SymptomGrade, file: File | null) {
        if (!file) {
            grade.deleteImage()
                .then(() => { grade.imageUrl = ''; })
                .catch(() => App.notification($t('symptom.update.notifications.error')).setType('error').setTime(5000).show());
            return;
        }
        grade.uploadImage(file)
            .then((data: any) => {
                const updated = new Symptom(data);
                const updatedGrade = updated.grades.find(g => g.id === grade.id);
                if (updatedGrade) grade.imageUrl = updatedGrade.imageUrl;
            })
            .catch(() => App.notification($t('symptom.update.notifications.error')).setType('error').setTime(5000).show());
    }
}
export default toNative(SymptomUpdatePage);
