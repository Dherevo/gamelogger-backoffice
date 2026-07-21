<template>
    <div id="login-page">
        <div class="form-container">
          <img src="/images/logo.svg" class="logo" alt="Mesoestetic" style="margin: 0 auto" />
          <img src="/images/cosmelan.png" class="logo" alt="Cosmelan" />
            <form @submit.prevent="doLogin">
                <FormInput
                    v-model="loginData.email"
                    type="email"
                    :label="$t('generic.email')"
                    :placeholder="$t('user.placeholders.email')"
                    :validator="validator.add('email', () => loginData.email).isEmail().causesError($t('forms.errors.email'))"
                    style="margin-bottom: 24px;"
                />
                <FormInput
                    v-model="loginData.password"
                    type="password"
                    :label="$t('generic.password')"
                    :placeholder="$t('user.placeholders.password')"
                    :validator="validator.add('password', () => loginData.password).notEmpty().causesError($t('user.errors.password'))"
                    style="margin-bottom: 24px;"
                />
                <Btn fill ripple class="primary" type="submit" :loading="loading">
                    {{ $t('login.submit') }}
                </Btn>
            </form>
            <div style="margin-top: 16px; text-align: center;">
                <Link href="/recover">{{ $t('login.forgot_password') }}</Link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./login.ts"></script>
<style lang="scss" src="./login.scss"></style>
