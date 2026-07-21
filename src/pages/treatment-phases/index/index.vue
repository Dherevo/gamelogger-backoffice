<template>
    <div id="treatment-phases-index-page">
        <Message severity="success" class="m-bottom-20" v-if="message">{{ message }}</Message>
        <AppTable :table="table">
            <template #header>
                <div class="header flex-center gap-20" style="justify-content: space-between;">
                    <h1 class="h6 m-bottom-0">{{ $t('treatmentPhase.index.title') }}</h1>
                    <Btn ripple link="/treatment-phases/create" class="primary">
                        <SvgIcon name="prime/plus"/> {{ $t('treatmentPhase.index.create') }}
                    </Btn>
                </div>
            </template>
            <template #col-useOwnMatrix="{ item }">
                <span>{{ item.useOwnMatrix ? $t('generic.yes') : $t('generic.no') }}</span>
            </template>
        </AppTable>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
