<template>
    <div id="reset-password-page">
        <div class="reset-password-card">

            <h1 class="reset-password-title">{{ $t('reset_password.title') }}</h1>

            <template v-if="!token">
                <template v-if="!done">
                    <p class="reset-password-subtitle">{{ $t('reset_password.email.title') }}</p>
                    <FormInput type="email" :label="$t('generic.email')" v-model="email"
                        @pressEnter="requestReset" :pass="{ autocomplete: 'off' }" />
                    <div v-if="errorMsg" class="reset-password-error">{{ errorMsg }}</div>
                    <Btn class="reset-password-submit" fill :loading="loading" @click="requestReset">
                        {{ $t('reset_password.email.submit') }}
                    </Btn>
                </template>
                <p v-else class="reset-password-success">{{ $t('reset_password.email.success') }}</p>
            </template>

            <template v-else>
                <template v-if="!done">
                    <p class="reset-password-subtitle">{{ $t('reset_password.password.title') }}</p>
                    <FormInput type="password" :label="$t('generic.password')" v-model="password"
                        :pass="{ autocomplete: 'new-password' }" />
                    <FormInput type="password" :label="$t('generic.repassword')" v-model="passwordConfirm"
                        @pressEnter="setPassword" :pass="{ autocomplete: 'new-password' }" />
                    <div v-if="errorMsg" class="reset-password-error">{{ errorMsg }}</div>
                    <Btn class="reset-password-submit" fill :loading="loading" @click="setPassword">
                        {{ $t('reset_password.password.submit') }}
                    </Btn>
                </template>
                <template v-else>
                    <p class="reset-password-success">{{ $t('reset_password.password.success') }}</p>
                    <Btn class="reset-password-submit" fill @click="goToLogin">
                        {{ $t('reset_password.password.button') }}
                    </Btn>
                </template>
            </template>

            <Link href="/login" class="reset-password-back">{{ $t('reset_password.back') }}</Link>

        </div>
    </div>
</template>

<script lang="ts" src="./reset-password.ts"></script>
<style lang="scss" src="./reset-password.scss"></style>
