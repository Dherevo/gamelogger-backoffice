<template>
    <div id="login-page">
        <div class="left"></div>
        <div class="right">
            <div class="form-container">
                <template v-if="success">
                    <p>{{ $t('reset_password.success') }}</p>
                    <Btn fill ripple class="primary" style="margin-top: 16px;" @click="to('/login')">
                        {{ $t('reset_password.successButton') }}
                    </Btn>
                </template>
                <template v-else-if="error">
                    <p>{{ $t('reset_password.error') }}</p>
                    <div style="margin-top: 16px;">
                        <Link href="/login">{{ $t('reset_password.back') }}</Link>
                    </div>
                </template>
                <template v-else>
                    <form @submit.prevent="submit">
                        <FormInput
                            v-model="newPassword"
                            type="password"
                            :label="$t('generic.password')"
                            :placeholder="$t('generic.password')"
                            :validator="validator.add('newPassword', () => newPassword).notEmpty().causesError($t('reset_password.errors.newPassword'))"
                            style="margin-bottom: 24px;"
                        />
                        <FormInput
                            v-model="confirmPassword"
                            type="password"
                            :label="$t('generic.repassword')"
                            :placeholder="$t('generic.repassword')"
                            :validator="confirmPasswordValidator"
                            style="margin-bottom: 24px;"
                        />
                        <Btn fill ripple class="primary" type="submit" :loading="loading">
                            {{ $t('reset_password.submit') }}
                        </Btn>
                    </form>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./reset-password.ts"></script>
<style lang="scss" src="./reset-password.scss"></style>
