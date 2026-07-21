<template>
    <div class="users-form">
        <div class="form card">
            <FormInput  v-model="user.name"
                        :label="$t('generic.name')"
                        :placeholder="$t('users.placeholders.name')"
                        :validator="validator.add('name', () => user.name).notEmpty().causesError($t('users.errors.name'))"/>
            <FormInput  v-model="user.nickname"
                        :label="$t('users.labels.nickname')"
                        :placeholder="$t('users.placeholders.nickname')"
                        :validator="validator.add('nickname', () => user.nickname).notEmpty().causesError($t('users.errors.nickname'))"/>
            <FormInput  v-model="user.email"
                        type="email"
                        :label="$t('generic.email')"
                        :placeholder="$t('users.placeholders.email')"
                        :validator="validator.add('email', () => user.email).isEmail().causesError($t('forms.errors.email'))"/>

            <FormInput  v-if="form === 'create'"
                        v-model="user.password"
                        type="password"
                        :label="$t('generic.password')"
                        :placeholder="$t('users.placeholders.password')"
                        :validator="validator.add('password', () => user.password).notEmpty().causesError($t('users.errors.password'))"/>
            <FormInput  v-else
                        v-model="user.password"
                        type="password"
                        :label="$t('generic.password')"
                        :placeholder="$t('users.placeholders.password')"
                        :help="$t('users.form.passwordHint')"/>

            <FormInput  v-model="user.isAdmin"
                        type="toggle"
                        :label="$t('users.labels.admin')"/>
        </div>
    </div>
</template>

<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
