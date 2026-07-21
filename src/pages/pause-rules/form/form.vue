<template>
    <div id="pause-rule-form">
        <div class="card">
            <div v-if="orphan" class="orphan-notice m-bottom-15">
                <SvgIcon name="prime/exclamation-triangle"/>
                {{ $t('pauseRule.form.orphanNotice', { name: pauseRule.name }) }}
            </div>
            <FormInput :label="$t('pauseRule.labels.symptom')" v-model="pauseRule.name" type="select" :options="symptomOptions" :validator required/>
            <FormInput :label="$t('pauseRule.labels.message')" v-model="pauseRule.message" type="textarea" :max="1000" :validator required/>
        </div>
    </div>
</template>
<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
