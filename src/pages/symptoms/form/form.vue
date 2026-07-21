<template>
    <div id="symptom-form">
        <div class="card">
            <FormInput :label="$t('generic.name')" v-model="symptom.name" :validator :required/>
            <FormInput :label="$t('generic.description')" v-model="symptom.description" type="textarea"/>
            <FormInput :label="$t('symptom.labels.type')" v-model="symptom.type" type="select" :options="typeOptions"/>
            <FormInput :label="$t('symptom.labels.order')" v-model="symptom.displayOrder" type="number"/>
            <FormInput :label="$t('symptom.labels.required')" v-model="symptom.required" type="toggle"/>
            <FormInput v-if="form === 'update'" :label="$t('symptom.labels.active')" v-model="symptom.active" type="toggle"/>
        </div>
    </div>
</template>
<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
