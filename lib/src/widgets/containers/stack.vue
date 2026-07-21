<template>
    <div class="stack-container" :style="{
        gap: space === undefined ? '0px' :
            typeof space === 'number' ? `${space}px` : '15px',
        'align-items': center !== undefined ? 'center' :
            right !== undefined ? 'flex-end' : 'flex-start',
        'height': fill !== undefined ? '100%' : '',
        'flex': fill !== undefined ? '1' : ''
    }">
        <slot />
    </div>
</template>

<style lang="scss">
.stack-container {
    display: flex;
    flex-direction: column;

    > div {
        width: 100%;
    }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    
    props: {
        space: {},
        center: {},
        right: {},
        fill: {}
    }

});
</script>