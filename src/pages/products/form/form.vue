<template>
    <div id="product-form">
        <div class="card">
            <FormInput :label="$t('product.labels.category')" v-model="product.categoryId" type="select" :options="categoryOptions" :validator :required/>
            <FormInput :label="$t('generic.name')" v-model="product.name" :validator :required/>
            <FormInput :label="$t('generic.description')" v-model="product.description" type="textarea"/>
            <FormInput v-if="form === 'update'" :label="$t('product.labels.active')" v-model="product.active" type="toggle"/>
        </div>
    </div>
</template>
<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
