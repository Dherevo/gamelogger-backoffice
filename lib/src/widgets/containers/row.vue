<template>
    <div class="row" :class="getClass()"><slot/></div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    props: ['space', 'stretch'],

    methods: {
        getClass() {
            const classes = {};
            if (this.stretch !== undefined) {
                classes['stretch'] = true;
            }

            if (this.space !== undefined) {
                if (typeof this.space == 'number' || (typeof this.space == 'string' && this.space.length > 0)) {
                    classes['gap' + this.space] = true;
                }
                else {
                    classes['gap-15'] = true;
                }
            }

            return classes;
        }
    }
})
</script>
