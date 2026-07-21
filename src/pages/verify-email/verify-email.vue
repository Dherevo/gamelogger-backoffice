<template>
    <div id="login-page">
        <div class="left"></div>
        <div class="right">
            <div class="form-container">
                <Loader v-if="loading"/>
                <template v-else>
                    <p v-if="success">{{ $t('verify_email.success') }}</p>
                    <p v-else>{{ $t('verify_email.error') }}</p>
                    <div style="margin-top: 16px;">
                        <Link href="/login">{{ $t('verify_email.backToLogin') }}</Link>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./verify-email.ts"></script>
<style lang="scss" src="./verify-email.scss"></style>
