<template>
    <div id="profile-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <h1 class="h2 m-bottom-0">{{ $t('profile.title') }}</h1>
                <Btn ripple class="primary" type="submit" :loading="saving">
                    <SvgIcon name="prime/file-edit"/> {{ $t('profile.save') }}
                </Btn>
            </div>
            <div class="form card">
                <FormInput  v-model="user.name"
                            :label="$t('generic.name')"
                            :validator="validator.add('name', () => user.name).notEmpty().causesError($t('users.errors.name'))"/>
                <FormInput  v-model="user.nickname"
                            :label="$t('users.labels.nickname')"
                            :validator="validator.add('nickname', () => user.nickname).notEmpty().causesError($t('users.errors.nickname'))"/>
                <FormInput  v-model="user.email"
                            type="email"
                            :label="$t('generic.email')"
                            :validator="validator.add('email', () => user.email).isEmail().causesError($t('forms.errors.email'))"/>
                <FormInput  v-model="user.password"
                            type="password"
                            :label="$t('generic.password')"
                            :placeholder="$t('users.placeholders.password')"
                            :help="$t('profile.passwordHint')"/>
            </div>
        </form>
    </div>
</template>

<script lang="ts" src="./profile.ts"></script>
<style lang="scss" src="./profile.scss"></style>
