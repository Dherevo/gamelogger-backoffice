<template>
    <Login id="login-page"
           image="/images/login.jpg"
           logo="/images/logo.svg"
           :warning="warning"
           @submit="doLogin($event)"
           :canResetPassword="true" />
</template>

<script lang="ts" src="./login.ts"></script>
<style lang="scss" src="./login.scss"></style>
