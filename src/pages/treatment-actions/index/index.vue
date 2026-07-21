<template>
    <div id="treatment-actions-index-page">
        <div class="flex-bottom m-bottom-20">
            <h1 class="h6 m-bottom-0">{{ $t('treatmentAction.index.title') }}</h1>
        </div>
        <Loader v-if="loading"/>
        <div v-else>
            <div v-if="actions.length === 0" class="card">{{ $t('table.empty') }}</div>
            <div v-for="action in actions" :key="action.id" class="card treatment-action-card m-bottom-15">
                <div class="flex-row gap-20 align-center m-bottom-15">
                    <strong>{{ action.code }}</strong>
                </div>
                <FormInput :label="$t('treatmentAction.labels.patientDescription')" v-model="action.patientDescription" type="textarea"/>
                <div class="flex-row" style="justify-content: flex-end; margin-top: 10px;">
                    <Btn ripple class="primary small" @click="save(action)">
                        <SvgIcon name="prime/check"/> {{ $t('generic.save') }}
                    </Btn>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
