<template>
    <div id="patients-create-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/patients')">
                        <SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}
                    </Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('patients.create.title') }}</h1>
                </div>
                <Btn ripple class="primary" type="submit" :loading="saving">
                    <SvgIcon name="prime/file-edit"/> {{ $t('patients.create.save') }}
                </Btn>
            </div>

            <div class="card m-bottom-20">
                <FormInput  v-model="patient.patientCode"
                            :label="$t('patients.labels.patientCode')"
                            :placeholder="$t('patients.placeholders.patientCode')"
                            :validator="validator.add('patientCode', () => patient.patientCode).notEmpty().causesError($t('patients.errors.patientCode'))"
                            :required/>
                <FormInput  v-if="distributorOptions.length > 0"
                            v-model="patient.distributionCenterId"
                            type="select"
                            :label="$t('patients.labels.distributionCenter')"
                            :placeholder="$t('patients.placeholders.distributionCenter')"
                            :options="distributorOptions"/>
                <FormInput  v-model="assignData"
                            type="toggle"
                            :label="$t('patients.create.assignDataLabel')"/>
                <p v-if="!assignData" class="text-muted" style="font-size: var(--text-sm); margin: 5px 0 0;">
                    {{ $t('patients.create.assignDataHint') }}
                </p>
            </div>

            <PatientsForm v-if="assignData" form="create" :patient :validator/>
        </form>
    </div>
</template>

<script lang="ts" src="./create.ts"></script>
<style lang="scss" src="./create.scss"></style>
