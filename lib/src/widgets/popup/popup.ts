import { PropType, defineComponent } from 'vue';
import Popover from 'primevue/popover';

export default defineComponent({

    components: {
        Popover
    },

    props: {
        icon: {
            type: String as PropType<string>
        },
        autoClose: {
            type: Boolean,
            default: true
        },
        dropdownStyle: {
            type: Boolean,
            default: false
        }
    },

    emits: ['open', 'close'],

    data() {
        const data : {
            expanded: boolean,
            mustclose: boolean,
            zIndexChanges: any
        } = {
            expanded: false,
            mustclose: true,
            zIndexChanges: []
        }

        return data;
    },

    methods: {

        togglePopup($e?: Event) {
            if (this.expanded) {
                this.close();
            }
            else {
                this.open($e);
            }
        },

        open($e?: Event) {
            const ref = this.ref('popover');
            if (!ref) return;
            ref.show($e);
            this.expanded = true;
            this.mustclose = false;
            this.$emit('open');

            setTimeout(() => {
                this.mustclose = true;
            }, 20)
        },

        close() {
            this.ref('popover').hide();
            this.expanded = false;
            this.$emit('close');
        }
    }

});