import { Component, Vue, toNative } from 'vue-facing-decorator';
import DecisionMatrixEditor from '@/components/decision-matrix-editor/decision-matrix-editor.vue';

@Component({ components: { DecisionMatrixEditor } })
class DecisionMatrixPage extends Vue {
}
export default toNative(DecisionMatrixPage);
