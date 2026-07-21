<template>
    <div id="products-index-page">
        <Message severity="success" class="m-bottom-20" v-if="message">{{ message }}</Message>
        <AppTable :table="table">
            <template #header>
                <div class="header flex-center gap-20" style="justify-content: space-between;">
                    <h1 class="h6 m-bottom-0">{{ $t('product.index.title') }}</h1>
                    <div class="flex-center gap-10">
                        <FormInput v-model="selectedCategoryId" type="select" :options="categoryOptions" @change="filterByCategory()" style="min-width: 180px;"/>
                        <Btn ripple link="/products/create" class="primary">
                            <SvgIcon name="prime/plus"/> {{ $t('product.index.create') }}
                        </Btn>
                    </div>
                </div>
            </template>
            <template #col-active="{ item }">
                <Btn fill ripple :class="item.active ? 'alt outline' : 'primary'" @click="toggleStatus(item)">
                    {{ item.active ? $t('product.actions.active') : $t('product.actions.inactive') }}
                </Btn>
            </template>
        </AppTable>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
