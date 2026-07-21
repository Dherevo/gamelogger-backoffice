<template>
    <div id="product-categories-create-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/product-categories')"><SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}</Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('productCategory.create.title') }}</h1>
                </div>
                <Btn ripple class="primary" type="submit"><SvgIcon name="prime/file-edit"/> {{ $t('productCategory.create.save') }}</Btn>
            </div>
            <ProductCategoryForm form="create" :productCategory :validator/>
        </form>
    </div>
</template>
<script lang="ts" src="./create.ts"></script>
<style lang="scss" src="./create.scss"></style>
