<template>
    <Loader v-if="loading" />
    <router-view v-else />
</template>

<script lang="ts" src="./default.ts"></script>
<style lang="scss" src="./default.scss"></style>