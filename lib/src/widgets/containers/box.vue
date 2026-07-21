<template>
    <div class="box" :class="{
        'box-shadow': shadow !== undefined
    }">
        <slot />
    </div>
</template>

<style lang="scss">
.box {
    background-color: white;
    border: solid 1px rgb(235, 235, 235);
    border-radius: var(--border-radius-lg);
    padding: 15px;

    &.shadow {
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    
    props: {
        shadow: {}
    }

});
</script>