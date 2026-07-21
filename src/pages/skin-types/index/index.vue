<template>
    <div id="skin-types-index-page">
        <Message severity="success" class="m-bottom-20" v-if="message">{{ message }}</Message>
        <AppTable :table="table">
            <template #header>
                <div class="header flex-center gap-20" style="justify-content: space-between;">
                    <h1 class="h6 m-bottom-0">{{ $t('skinType.index.title') }}</h1>
                    <Btn ripple link="/skin-types/create" class="primary">
                        <SvgIcon name="prime/plus"/> {{ $t('skinType.index.create') }}
                    </Btn>
                </div>
            </template>
            <template #col-active="{ item }">
                <Btn fill ripple :class="item.active ? 'alt outline' : 'primary'" @click="toggleStatus(item)">
                    {{ item.active ? $t('skinType.actions.active') : $t('skinType.actions.inactive') }}
                </Btn>
            </template>
        </AppTable>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
