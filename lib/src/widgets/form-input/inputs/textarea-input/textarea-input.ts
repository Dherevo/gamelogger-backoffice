import { defineComponent } from 'vue';
import Textarea from 'primevue/textarea';
import baseInput from '../base-input';

export default defineComponent({

    components: { Textarea },

    mixins: [baseInput],

    props: {
        modelValue: {
            type: String
        },
        readonly: {
            type: Boolean
        },
        disabled: {
            type: Boolean
        },
        autoResize: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String
        },
        max: {
            type: Number
        },
        name: {
            type: String
        }
    },

    emits: [
        'stop',
        'change',
        'update:modelValue',
        'blur',
        'focus',
        'keyup',
        'keydown',
        'pressEnter',
        'pressEscape',
        'pressTab'
    ],

    methods: {
        passEmit(event: string, arg?: any) {
            this.$emit(event as any, arg);
        },

        focus() {
            if (!this.$refs.input) return;
            (this.$refs.input as any).focus();
        },

        blur() {
            if (!this.$refs.input) return;
            (this.$refs.input as any).blur();
        },
        
        updateValue($event: any) {
            const value = $event.target.value;
            this.$emit('update:modelValue', value);
            this.stopEvent(value);
        },

        stopEvent(value?: any) {
            this.writeCount += 1;
            const currentWriteCount = this.writeCount;

            setTimeout(() => {
                if (currentWriteCount == this.writeCount) {
                    this.$emit('stop', value);
                }
            }, this.stopTime);
        },
    }
});