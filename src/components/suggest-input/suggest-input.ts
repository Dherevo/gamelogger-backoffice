import { Component, Vue, toNative, Prop, Model, Watch } from 'vue-facing-decorator';

/**
 * Text box with suggestions that also creates: what is typed is the value, the list only
 * helps to reuse a name that already exists. With `multiple` the value is a list of chips.
 */
@Component({
    emits: ['update:modelValue']
})
class SuggestInputComponent extends Vue {

    @Model({ name: 'modelValue' })
    value!: string | string[] | null;

    @Prop label: string = '';
    @Prop placeholder: string = '';
    @Prop multiple: boolean = false;
    @Prop fetch!: (query: string) => Promise<string[]>;

    text: string = '';
    suggestions: string[] = [];
    open: boolean = false;
    private timer: any = null;
    private requestId: number = 0;

    created() {
        if (!this.multiple) this.text = (this.value as string) || '';
    }

    get chips(): string[] {
        return this.multiple ? ((this.value as string[]) || []) : [];
    }

    get typed(): string {
        return this.text.trim();
    }

    get canCreate(): boolean {
        const t = this.typed.toLowerCase();
        return !!t
            && !this.suggestions.some(s => s.toLowerCase() === t)
            && !this.chips.some(c => c.toLowerCase() === t);
    }

    get visibleSuggestions(): string[] {
        const used = new Set(this.chips.map(c => c.toLowerCase()));
        return this.suggestions.filter(s => !used.has(s.toLowerCase()));
    }

    // The parent can replace the value (e.g. after loading the game).
    @Watch('value')
    onValueChange(v: any) {
        if (!this.multiple) this.text = v || '';
    }

    onInput() {
        if (!this.multiple) this.$emit('update:modelValue', this.text);
        this.open = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.load(), 200);
    }

    onFocus() {
        this.open = true;
        this.load();
    }

    onBlur() {
        // Let a click on an option land before the list closes.
        setTimeout(() => {
            this.open = false;
            if (this.multiple && this.typed) this.add(this.typed);
        }, 150);
    }

    load() {
        this.requestId += 1;
        const id = this.requestId;
        this.fetch(this.typed)
            .then(list => { if (id === this.requestId) this.suggestions = list || []; })
            .catch(() => { if (id === this.requestId) this.suggestions = []; });
    }

    pick(name: string) {
        if (this.multiple) {
            this.add(name);
        } else {
            this.text = name;
            this.$emit('update:modelValue', name);
            this.open = false;
        }
    }

    add(name: string) {
        const clean = name.trim();
        this.text = '';
        if (!clean || this.chips.some(c => c.toLowerCase() === clean.toLowerCase())) return;
        this.$emit('update:modelValue', [...this.chips, clean]);
    }

    remove(index: number) {
        this.$emit('update:modelValue', this.chips.filter((_, i) => i !== index));
    }

    onEnter() {
        if (this.multiple && this.typed) this.add(this.typed);
        else this.open = false;
    }

    onBackspace() {
        if (this.multiple && !this.text && this.chips.length) this.remove(this.chips.length - 1);
    }
}
export default toNative(SuggestInputComponent);
