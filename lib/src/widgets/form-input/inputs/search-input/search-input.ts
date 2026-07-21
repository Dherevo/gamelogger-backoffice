import { defineComponent, PropType } from 'vue';
import AutoComplete from 'primevue/autocomplete';
import baseInput from '../base-input';
import IOption from '../../../../interfaces/IOption';

export default defineComponent({

    components: { 
        AutoComplete
    },

    mixins: [baseInput],

    props: {
        type: {
            type: String
        },
        placeholder: {
            type: String
        },
        suggestions: {
            type: Function as PropType<((query: string, resolve: ((suggestions: IOption[]) => void)) => void)>,
        },
        autocomplete: {
            type: String,
            default: 'off'
        },
        name: {
            type: String
        }
    },

    emits: [
        'blur',
        'focus',
        'keyup',
        'keydown',
        'update:modelValue',
        'change',
        'pressEnter',
        'pressEscape',
        'pressTab',
        'suggestion-selected',
        'stop',
        'close'
    ],

    data() {
        const data : {
            selectOption: IOption|null,
            previousSuggestions: any[],
            tmpValue: string,
        } = {
            selectOption: null,
            previousSuggestions: [],
            tmpValue: ''
        }
        return data;
    },

    methods: {
        getInput() {
            return (this.$refs.input as any)
        },

        passEmit(event: string, arg?: any) {
            this.$emit(event as any, arg);
        },

        focus() {
            if (!this.$refs.input) return;
            this.getInput().focus();
        },

        blur() {
            if (!this.$refs.input) return;
            this.getInput().blur();
        },

        setValue(value: any) {
            this.$emit('update:modelValue', value);
        },
        
        updateValue(value: any) {
            this.setValue(value);
            this.stopEvent(value);
        },

        stopEvent(value?: any) {
            this.writeCount += 1;
            const currentWriteCount = this.writeCount;

            setTimeout(() => {
                if (currentWriteCount == this.writeCount) {
                    this.$emit('stop', value);

                    if (this.suggestions) {
                        this.suggestions(value, suggestions => {
                            this.updateSuggestions(suggestions);
                        });
                    }
                }
            }, this.stopTime);
        },
        
        suggestionSelected(arg: any) {
            if (!arg) {
                this.selectOption = arg;
                this.$emit('suggestion-selected', arg);
                this.setValue(arg);
                return;
            }
            
            if (typeof arg == 'string') {
                this.selectOption = { value: arg, content: arg};
                this.$emit('suggestion-selected', this.selectOption.value);
                this.setValue(this.selectOption.content);
            }
            else {
                if (!arg.content) arg.content = arg.value;
                this.selectOption = arg;
                this.$emit('suggestion-selected', arg);
                this.setValue(arg.content);
            }
        },

        onOpenSuggestions() {
            this.passEmit('open', this.tmpValue);
            if (!this.suggestions) return;

            this.suggestions(this.tmpValue, suggestions => {
                this.updateSuggestions(suggestions);
            });
        },

        updateSuggestions(suggestions: any[]) {
            if (!this.suggestions) return;
            this.previousSuggestions = suggestions.map(item => item)
        },

        onCloseSuggestions() {
            this.passEmit('close', this.tmpValue)
            if (!this.modelValue) {
                this.tmpValue = "";
            }
        },

        submit() {
            this.passEmit('pressEnter');
        }
    }
});