<template>
    <div id="patients-update-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/patients')">
                        <SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}
                    </Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('patients.update.title') }}</h1>
                </div>
                <div class="flex-row gap-0">
                    <Btn ripple class="primary" style="border-bottom-right-radius: 0; border-top-right-radius: 0;" type="submit">
                        <SvgIcon name="prime/file-edit"/> {{ $t('patients.update.save') }}
                    </Btn>
                    <Btn ripple class="primary" style="border-bottom-left-radius: 0; border-top-left-radius: 0;" @click="resetPassword()" type="button">
                        <SvgIcon name="prime/lock"/> {{ $t('patients.update.password') }}
                    </Btn>
                </div>
            </div>
            <PatientsForm form="update" :patient :validator/>
        </form>
    </div>
</template>

<script lang="ts" src="./update.ts"></script>
<style lang="scss" src="./update.scss"></style>
