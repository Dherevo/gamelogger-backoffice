<template>
    <div id="treatment-phases-create-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/treatment-phases')"><SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}</Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('treatmentPhase.create.title') }}</h1>
                </div>
                <Btn ripple class="primary" type="submit"><SvgIcon name="prime/file-edit"/> {{ $t('treatmentPhase.create.save') }}</Btn>
            </div>
            <TreatmentPhaseForm form="create" :treatmentPhase :validator/>
        </form>
    </div>
</template>
<script lang="ts" src="./create.ts"></script>
<style lang="scss" src="./create.scss"></style>
