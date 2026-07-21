<template>
    <div class="patients-form">
        <div class="form">

            <h2 class="h3">{{ $t('patients.form.accessData') }}</h2>
            <FormInput  v-model="patient.email"
                        type="email"
                        :label="$t('generic.email')"
                        :placeholder="$t('patients.placeholders.email')"
                        :validator="validator.add('email', () => patient.email).isEmail().causesError($t('forms.errors.email'))"/>
            <FormInput  v-model="patient.language"
                        type="select"
                        :label="$t('patients.labels.language')"
                        :placeholder="$t('patients.placeholders.language')"
                        :options="languageOptions"/>

            <h2 class="h3">{{ $t('patients.form.clinicalInfo') }}</h2>
            <FormInput  v-model="patient.distributionCenterName"
                        :label="$t('patients.labels.distributionCenter')"
                        :placeholder="$t('patients.placeholders.distributionCenter')"/>

            <template v-if="form === 'update'">
                <FormInput  v-if="patient.patientCode"
                            v-model="patient.patientCode"
                            :label="$t('patients.labels.patientCode')"
                            disabled/>
                <FormInput  v-model="patient.treatmentStatus"
                            type="select"
                            :label="$t('patients.labels.treatmentStatus')"
                            :placeholder="$t('patients.placeholders.treatmentStatus')"
                            :options="treatmentStatusOptions"/>
                <FormInput  v-model="patient.treatmentStartDate"
                            type="date"
                            :label="$t('patients.labels.treatmentStartDate')"
                            :placeholder="$t('patients.placeholders.treatmentStartDate')"/>
            </template>

            <h2 class="h3">{{ $t('patients.form.personalInfo') }}</h2>
            <FormInput  v-model="patient.name"
                        :label="$t('generic.name')"
                        :placeholder="$t('patients.placeholders.name')"/>
            <FormInput  v-model="patient.surnames"
                        :label="$t('generic.lastname')"
                        :placeholder="$t('patients.placeholders.surnames')"/>
            <FormInput  v-model="patient.telephone"
                        :label="$t('generic.phone')"
                        :placeholder="$t('patients.placeholders.telephone')"/>
            <FormInput  v-model="patient.birthDate"
                        type="date"
                        :label="$t('patients.labels.birthDate')"
                        :placeholder="$t('patients.placeholders.birthDate')"/>
            <FormInput  v-model="patient.country"
                        :label="$t('patients.labels.country')"
                        :placeholder="$t('patients.placeholders.country')"/>
            <FormInput  v-model="patient.gender"
                        type="select"
                        :label="$t('patients.labels.gender')"
                        :placeholder="$t('patients.placeholders.gender')"
                        :options="genderOptions"/>

        </div>
    </div>
</template>

<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
