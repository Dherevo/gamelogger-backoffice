<template>
    <div id="treatment-phase-form">
        <div class="card m-bottom-15">
            <FormInput :label="$t('generic.name')" v-model="treatmentPhase.name" :validator :required/>
            <FormInput :label="$t('generic.description')" v-model="treatmentPhase.description" type="textarea"/>
            <div class="flex-row gap-15">
                <FormInput :label="$t('treatmentPhase.labels.startWeek')" v-model="treatmentPhase.startWeek" type="number" :min="1" :max="26" :validator required/>
                <FormInput :label="$t('treatmentPhase.labels.endWeek')" v-model="treatmentPhase.endWeek" type="number" :min="1" :max="26" :validator required/>
            </div>
            <FormInput :label="$t('treatmentPhase.labels.useOwnMatrix')" v-model="treatmentPhase.useOwnMatrix" type="toggle"/>
        </div>
        <div class="card">
            <h3 class="h6 m-bottom-15">{{ $t('treatmentPhase.labels.tasks') }}</h3>
            <div v-for="(task, index) in treatmentPhase.tasks" :key="index" class="task-row flex-row gap-10 m-bottom-10">
                <FormInput v-model="treatmentPhase.tasks[index]" style="flex:1"/>
                <Btn ripple class="danger small" @click.prevent="removeTask(index)">
                    <SvgIcon name="prime/trash"/>
                </Btn>
            </div>
            <Btn ripple class="primary outline small" @click.prevent="addTask">
                <SvgIcon name="prime/plus"/> {{ $t('treatmentPhase.labels.addTask') }}
            </Btn>
        </div>
    </div>
</template>
<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
