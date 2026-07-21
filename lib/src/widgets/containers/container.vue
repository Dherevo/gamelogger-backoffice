<template>
    <div class="container" :class="{
        'thin': thin
    }"><slot/></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: ['thin']
})
</script>