<template>
    <div class="platforms-form">
        <div class="form card">
            <FormInput  v-model="platform.name"
                        :label="$t('platform.labels.name')"
                        :placeholder="$t('platform.placeholders.name')"
                        :validator="validator.add('name', () => platform.name).notEmpty().causesError($t('platform.errors.name'))"/>
        </div>
    </div>
</template>

<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
