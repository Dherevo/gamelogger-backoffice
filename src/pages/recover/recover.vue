<template>
    <div id="login-page">
        <div class="left"></div>
        <div class="right">
            <div class="form-container">
                <template v-if="!success">
                    <p style="margin-bottom: 24px;">{{ $t('recover.subtitle') }}</p>
                    <form @submit.prevent="submit">
                        <FormInput
                            v-model="email"
                            type="email"
                            :label="$t('generic.email')"
                            :placeholder="$t('user.placeholders.email')"
                            :validator="validator.add('email', () => email).isEmail().causesError($t('forms.errors.email'))"
                            style="margin-bottom: 24px;"
                        />
                        <Btn fill ripple class="primary" type="submit" :loading="loading">
                            {{ $t('recover.submit') }}
                        </Btn>
                    </form>
                </template>
                <template v-else>
                    <p>{{ $t('recover.success') }}</p>
                </template>
                <div style="margin-top: 16px;">
                    <Link href="/login">{{ $t('recover.backToLogin') }}</Link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./recover.ts"></script>
<style lang="scss" src="./recover.scss"></style>
