<template>
    <div id="skin-type-form">
        <div class="card">
            <FormInput :label="$t('generic.name')" v-model="skinType.name" :validator :required/>
            <FormInput :label="$t('generic.description')" v-model="skinType.description" type="textarea"/>
            <FormInput v-if="form === 'update'" :label="$t('skinType.labels.active')" v-model="skinType.active" type="toggle"/>
        </div>
    </div>
</template>
<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
