import { defineComponent } from 'vue';
import ToggleSwitch from 'primevue/toggleswitch';
import BooleanIcon from '../../../boolean-icon/boolean-icon.vue';
import baseInput from '../base-input';

export default defineComponent({

    components: {
        ToggleSwitch,
        BooleanIcon
    },

    mixins: [baseInput],

    props: {
        modelValue: {
            type: Boolean
        },
        readonly: {
            type: Boolean
        },
        disabled: {
            type: Boolean
        },
        props: {
            type: Object
        },
        classes: {
            type: Object
        },
        name: {
            type: String
        },
        useConfirm: {
            type: Boolean
        }
    },

    emits: [
        'update:modelValue', 
        'change',
        'blur',
        'focus',
        'confirm'
    ],

    data() {
        const data : { } = { }
        return data;
    },

    methods: {
        updateValue(value: any) {
            this.$emit('update:modelValue', value.target.checked);
        },
        interceptClick($e: any) {
            if (!this.useConfirm) return;

            this.$emit('confirm', {
                confirm: () => {
                    this.$emit('update:modelValue', !this.modelValue);
                }
            });
            $e.stopPropagation();
            $e.preventDefault();
        }
    }
});