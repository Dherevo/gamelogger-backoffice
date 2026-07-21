<template>
    <div id="product-categories-index-page">
        <Message severity="success" class="m-bottom-20" v-if="message">{{ message }}</Message>
        <AppTable :table="table">
            <template #header>
                <div class="header flex-center gap-20" style="justify-content: space-between;">
                    <h1 class="h6 m-bottom-0">{{ $t('productCategory.index.title') }}</h1>
                    <Btn ripple link="/product-categories/create" class="primary">
                        <SvgIcon name="prime/plus"/> {{ $t('productCategory.index.create') }}
                    </Btn>
                </div>
            </template>
        </AppTable>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
