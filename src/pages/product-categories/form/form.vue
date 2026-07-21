<template>
    <div id="product-category-form">
        <div class="card">
            <FormInput :label="$t('generic.name')" v-model="productCategory.name" :validator :required/>
        </div>
    </div>
</template>
<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
