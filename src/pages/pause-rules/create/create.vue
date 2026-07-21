<template>
    <div id="pause-rules-create-page">
        <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
            <div>
                <Btn ripple class="link" @click="to('/pause-rules')"><SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}</Btn>
                <h1 class="h2 m-bottom-0">{{ $t('pauseRule.create.title') }}</h1>
            </div>
            <Btn v-if="hasSymptoms" ripple class="primary" @click="save()">
                <SvgIcon name="prime/file-edit"/> {{ $t('pauseRule.create.save') }}
            </Btn>
        </div>
        <div v-if="!loading && !hasSymptoms" class="card">{{ $t('pauseRule.create.emptyState') }}</div>
        <form v-else @submit.prevent="save()">
            <PauseRuleForm form="create" :pauseRule="pauseRule" :validator="validator" :symptomOptions="symptomOptions"/>
        </form>
    </div>
</template>
<script lang="ts" src="./create.ts"></script>
<style lang="scss" src="./create.scss"></style>
