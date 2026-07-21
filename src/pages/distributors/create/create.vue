<template>
    <div id="distributors-create-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/distributors')">
                        <SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}
                    </Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('distributor.create.title') }}</h1>
                </div>
                <Btn ripple class="primary" type="submit">
                    <SvgIcon name="prime/file-edit"/> {{ $t('distributor.create.save') }}
                </Btn>
            </div>
            <DistributorsForm form="create" :distributor :validator/>
        </form>
    </div>
</template>

<script lang="ts" src="./create.ts"></script>
<style lang="scss" src="./create.scss"></style>
