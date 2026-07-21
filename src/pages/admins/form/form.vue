<template>
    <div class="admins-form">
        <div class="form">
            <h2 class="h3">{{ $t('admin.form.accessData') }}</h2>
            <FormInput  v-model="admin.username"
                        :label="$t('generic.username')"
                        :placeholder="$t('admin.placeholders.username')"
                        :validator="validator.add('username', () => admin.username).notEmpty().causesError($t('admin.errors.username'))"/>
            <FormInput  v-model="admin.email"
                        type="email"
                        :label="$t('generic.email')"
                        :placeholder="$t('admin.placeholders.email')"
                        :validator="validator.add('email', () => admin.email).isEmail().causesError($t('forms.errors.email'))"/>
            <FormInput  v-model="admin.role"
                        type="select"
                        :label="$t('admin.labels.role')"
                        :placeholder="$t('admin.placeholders.role')"
                        :options="roleOptions"
                        :validator="validator.add('role', () => admin.role !== undefined && admin.role !== null).causesError($t('admin.errors.role'))"/>
            <FormInput  v-model="admin.language"
                        type="select"
                        :label="$t('admin.labels.language')"
                        :placeholder="$t('admin.placeholders.language')"
                        :options="languageOptions"
                        :validator="validator.add('language', () => admin.language).notEmpty().causesError($t('admin.errors.language'))"/>

            <template v-if="form === 'create'">
                <FormInput  v-model="admin.password"
                            type="password"
                            :label="$t('generic.password')"
                            :placeholder="$t('admin.placeholders.password')"
                            :validator="validator.add('password', () => admin.password).notEmpty().causesError($t('admin.errors.password'))"/>
                <FormInput  v-model="admin.confirmPassword"
                            type="password"
                            :label="$t('generic.repassword')"
                            :placeholder="$t('admin.placeholders.confirmPassword')"
                            :validator="confirmPasswordValidator"/>
            </template>

            <h2 class="h3">{{ $t('admin.form.personalInfo') }}</h2>
            <FormInput  v-model="admin.name"
                        :label="$t('generic.name')"
                        :placeholder="$t('admin.placeholders.name')"
                        :validator="validator.add('name', () => admin.name).notEmpty().causesError($t('admin.errors.name'))"/>
            <FormInput  v-model="admin.surnames"
                        :label="$t('generic.lastname')"
                        :placeholder="$t('admin.placeholders.surnames')"
                        :validator="validator.add('surnames', () => admin.surnames).notEmpty().causesError($t('admin.errors.surnames'))"/>
            <FormInput  v-model="admin.telephone"
                        :label="$t('generic.phone')"
                        :placeholder="$t('admin.placeholders.telephone')"/>
        </div>
    </div>
</template>

<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
