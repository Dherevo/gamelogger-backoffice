<template>
    <div class="inline-container" :style="{
        gap: space === undefined ? '0px' :
            ['number', 'string'].includes(typeof space) && space != '' ? `${space}px` : '10px',
        'flex-wrap': wrap !== undefined ? 'wrap' : 'nowrap',
        'align-items': top !== undefined ? 'flex-start' : 
            bottom !== undefined ? 'flex-end' : 'center',
        'width': fill !== undefined ? '100%' : 'fit-contents',
        'flex': fill !== undefined ? '1' : '',
        'justify-content': center !== undefined ? 'center' : 
            right !== undefined ? 'flex-end' : ''
    }">
        <slot />
    </div>
</template>

<style lang="scss">
.inline-container {
    display: flex;
    align-items: center;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    
    props: {
        space: {},
        top: {},
        bottom: {},
        wrap: {},
        fill: {},
        center: {},
        right: {}
    }

});
</script>