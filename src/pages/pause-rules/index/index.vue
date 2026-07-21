<template>
    <div id="pause-rules-index-page">
        <Message severity="success" class="m-bottom-20" v-if="message">{{ message }}</Message>
        <AppTable :table="table">
            <template #header>
                <div class="header flex-center gap-20" style="justify-content: space-between;">
                    <h1 class="h6 m-bottom-0">{{ $t('pauseRule.index.title') }}</h1>
                    <Btn ripple class="primary" :disabled="!hasActiveBooleanSymptoms" @click="goToCreate()">
                        <SvgIcon name="prime/plus"/> {{ $t('pauseRule.index.create') }}
                    </Btn>
                </div>
            </template>
            <template #col-name="{ item }">
                <span>{{ item.name }}</span>
                <span v-if="isOrphan(item)" class="orphan-badge" :title="$t('pauseRule.labels.orphanHint')">
                    <SvgIcon name="prime/exclamation-triangle"/> {{ $t('pauseRule.labels.orphan') }}
                </span>
            </template>
            <template #col-message="{ item }">
                <span class="message-cell" :title="item.message">{{ item.message }}</span>
            </template>
            <template #col-active="{ item }">
                <Btn fill ripple :class="item.active ? 'alt outline' : 'primary'" @click="toggle(item)">
                    {{ item.active ? $t('pauseRule.actions.active') : $t('pauseRule.actions.inactive') }}
                </Btn>
            </template>
            <template #col-createdAt="{ item }">
                <span>{{ item.createdAt ? item.createdAt.format('DD/MM/YYYY') : '—' }}</span>
            </template>
        </AppTable>
        <div v-if="!hasActiveBooleanSymptoms" class="card m-top-15">{{ $t('pauseRule.index.emptyStateSymptoms') }}</div>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
