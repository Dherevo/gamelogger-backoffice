import { defineComponent, PropType } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import InputMask from 'primevue/inputmask';
import AutoComplete from 'primevue/autocomplete';
import baseInput from '../base-input';
import IOption from '../../../../interfaces/IOption';

export default defineComponent({

    components: { 
        InputText,
        InputMask,
        AutoComplete,
        InputNumber
    },

    mixins: [baseInput],

    props: {
        type: {
            type: String
        },
        mask: {
            type: String
        },
        currency: {
            type: String
        },
        placeholder: {
            type: String
        },
        suggestions: {
            type: Function as PropType<((query: string, resolve: ((suggestions: IOption[]) => void)) => void)>
        },
        decimals: {
            type: Number
        },
        prefix: {
            type: String
        },
        suffix: {
            type: String
        },
        autocomplete: {
            type: String,
            default: 'off'
        },
        autoformat: {
            type: Boolean,
            default: false
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        name: {
            type: String
        },
        showButtons: {
            default: true,
            type: Boolean
        },
        min: {
            default: 0,
            type: Number
        },
        max: {
            type: Number
        }
    },

    emits: [
        'blur',
        'focus',
        'keyup',
        'keydown',
        'update:modelValue',
        'change',
        'complete',
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

    mounted() {
        if (this.autofocus) {
            this.focus();
        }
    },

    methods: {
        getInput() {
            return (this.$refs.input as any)
        },

        getLength() {
            if (!this.modelValue) return 0;
            if (typeof this.modelValue == 'string') return this.modelValue.length;
            return 0;
        },

        passEmit(event: string, arg?: any) {
            this.$emit(event as any, arg);
        },

        focus() {
            if (!this.$refs.input) return;
            const el : HTMLElement = this.getInput().$el;
            if (el.tagName.toLowerCase() == 'input') el.focus();
            else {
                const input = el.querySelector('input');
                if (input) input.focus();
            }
        },

        blur() {
            if (!this.$refs.input) return;
            this.getInput().blur();
        },

        numberBlur($event?: any) {
            this.passEmit('blur', $event);

            const before = this.modelValue;

            setTimeout(() => {
                const val = this.getInput().d_modelValue;
                
                if (val != before) {
                    this.updateValue(val);
                }
            }, 10)
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
                    this.writeCount = 0;
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
        }
    }
});