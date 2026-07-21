<template>
    <div id="product-categories-update-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/product-categories')"><SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}</Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('productCategory.update.title') }}</h1>
                </div>
                <Btn ripple class="primary" type="submit"><SvgIcon name="prime/file-edit"/> {{ $t('productCategory.update.save') }}</Btn>
            </div>
            <ProductCategoryForm form="update" :productCategory :validator/>
        </form>
    </div>
</template>
<script lang="ts" src="./update.ts"></script>
<style lang="scss" src="./update.scss"></style>
