import { defineComponent } from 'vue';
import Password from 'primevue/password';
import baseInput from '../base-input';

export default defineComponent({

    components: { Password },

    mixins: [baseInput],

    props: {
        instructions: {
            type: String
        },
        name: {
            type: String
        },
        max: {
            type: Number
        },
        icons: {
            type: Array<string>,
            default: ['icons8/eye', 'icons8/eye-slash']
        },
        placeholder: {
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
        'pressTab'
    ],

    data() {
        const data : {
            showPassword: boolean
        } = {
            showPassword: false
        }
        return data;
    },

    methods: {

        getLength() {
            if (!this.modelValue) return 0;
            if (typeof this.modelValue == 'string') return this.modelValue.length;
            return 0;
        },

        focus() {
            if (!this.$refs.input) return;
            this.$refs.input.$el.querySelector('input').focus();
        },

        blur() {
            if (!this.$refs.input) return;
            (this.$refs.input as any).blur();
        },
        
        updateValue(value: any) {
            this.$emit('update:modelValue', value);
        }
    }
});