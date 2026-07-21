<template>
    <div id="treatment-phases-update-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/treatment-phases')"><SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}</Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('treatmentPhase.update.title') }}</h1>
                </div>
                <Btn ripple class="primary" type="submit"><SvgIcon name="prime/file-edit"/> {{ $t('treatmentPhase.update.save') }}</Btn>
            </div>
            <TreatmentPhaseForm form="update" :treatmentPhase :validator/>
        </form>

        <div v-if="treatmentPhase.useOwnMatrix && treatmentPhase.id" class="card" style="margin-top: 20px;">
            <h2 class="h6 m-bottom-15">{{ $t('treatmentPhase.update.ownMatrix') }}</h2>
            <DecisionMatrixEditor :phase-id="treatmentPhase.id"/>
        </div>
    </div>
</template>
<script lang="ts" src="./update.ts"></script>
<style lang="scss" src="./update.scss"></style>
