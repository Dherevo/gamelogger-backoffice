<template>
    <div id="pause-rules-update-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/pause-rules')"><SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}</Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('pauseRule.update.title') }}</h1>
                </div>
                <Btn ripple class="primary" type="submit"><SvgIcon name="prime/file-edit"/> {{ $t('pauseRule.update.save') }}</Btn>
            </div>
            <PauseRuleForm form="update" :pauseRule="pauseRule" :validator="validator" :symptomOptions="symptomOptions" :orphan="orphan"/>
        </form>
    </div>
</template>
<script lang="ts" src="./update.ts"></script>
<style lang="scss" src="./update.scss"></style>
