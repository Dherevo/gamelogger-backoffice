<template>
    <div id="platforms-create-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/platforms')">
                        <SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}
                    </Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('platform.create.title') }}</h1>
                </div>
                <Btn ripple class="primary" type="submit" :loading="saving">
                    <SvgIcon name="prime/file-edit"/> {{ $t('platform.create.save') }}
                </Btn>
            </div>
            <PlatformsForm :platform :validator/>
        </form>
    </div>
</template>

<script lang="ts" src="./create.ts"></script>
<style lang="scss" src="./create.scss"></style>
