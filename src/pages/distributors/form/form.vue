<template>
    <div class="distributors-form">
        <div class="form">
            <h2 class="h3">{{ $t('distributor.form.contactData') }}</h2>
            <FormInput  v-model="distributor.name"
                        :label="$t('distributor.labels.name')"
                        :placeholder="$t('distributor.placeholders.name')"
                        :validator="validator.add('name', () => distributor.name).notEmpty().causesError($t('distributor.errors.name'))"/>
            <FormInput  v-model="distributor.email"
                        type="email"
                        :label="$t('generic.email')"
                        :placeholder="$t('distributor.placeholders.email')"/>
            <FormInput  v-model="distributor.telephone"
                        :label="$t('generic.phone')"
                        :placeholder="$t('distributor.placeholders.telephone')"/>
            <h2 class="h3">{{ $t('distributor.form.addressData') }}</h2>
            <FormInput  v-model="distributor.address"
                        :label="$t('address.address')"
                        :placeholder="$t('distributor.placeholders.address')"/>
            <FormInput  v-model="distributor.country"
                        :label="$t('address.country')"
                        :placeholder="$t('distributor.placeholders.country')"/>
        </div>
    </div>
</template>

<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
