<template>
    <div class="profile-page page">
        <Loader v-if="loading"/>
        <template v-else>
            <div class="form-block">
                <h2 class="h3">{{ $t('profile.editProfile') }}</h2>
                <div class="form">
                    <FormInput  v-model="profileData.name"
                                :label="$t('generic.name')"
                                :placeholder="$t('generic.name')"
                                :validator="profileValidator.add('name', () => profileData.name).notEmpty().causesError($t('patients.errors.name'))"/>
                    <FormInput  v-model="profileData.surnames"
                                :label="$t('generic.lastname')"
                                :placeholder="$t('generic.lastname')"/>
                    <FormInput  v-model="profileData.telephone"
                                :label="$t('generic.phone')"
                                :placeholder="$t('generic.phone')"/>
                    <FormInput  v-model="profileData.language"
                                type="select"
                                :label="$t('patients.labels.language')"
                                :placeholder="$t('patients.placeholders.language')"
                                :options="languageOptions"/>
                    <Btn fill ripple class="primary backoffice" :loading="savingProfile" @click="saveProfile()">
                        {{ $t('generic.save') }}
                    </Btn>
                </div>
            </div>

            <div class="form-block">
                <h2 class="h3">{{ $t('profile.changePassword') }}</h2>
                <div class="form">
                    <FormInput  v-model="passwordData.currentPassword"
                                type="password"
                                :label="$t('profile.currentPassword')"
                                :placeholder="$t('profile.placeholders.currentPassword')"
                                :validator="passwordValidator.add('currentPassword', () => passwordData.currentPassword).notEmpty().causesError($t('profile.errors.currentPassword'))"/>
                    <FormInput  v-model="passwordData.newPassword"
                                type="password"
                                :label="$t('profile.newPassword')"
                                :placeholder="$t('profile.placeholders.newPassword')"
                                :validator="passwordValidator.add('newPassword', () => passwordData.newPassword).notEmpty().causesError($t('profile.errors.newPassword'))"/>
                    <FormInput  v-model="passwordData.confirmNewPassword"
                                type="password"
                                :label="$t('profile.confirmNewPassword')"
                                :placeholder="$t('profile.placeholders.confirmNewPassword')"
                                :validator="confirmPasswordValidator"/>
                    <Btn fill ripple class="primary backoffice" :loading="savingPassword" @click="changePassword()">
                        {{ $t('profile.changePassword') }}
                    </Btn>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" src="./profile.ts"></script>
<style lang="scss" src="./profile.scss"></style>
