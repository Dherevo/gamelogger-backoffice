<template>
    <div class="games-form">
        <div class="form card">
            <FormInput  v-model="game.name"
                        :label="$t('game.labels.name')"
                        :placeholder="$t('game.placeholders.name')"
                        :validator="validator.add('name', () => game.name).notEmpty().causesError($t('game.errors.name'))"/>
            <FormInput  v-model="game.year"
                        :label="$t('game.labels.year')"
                        :placeholder="$t('game.placeholders.year')"/>
            <FormInput  v-model="game.publisher"
                        :label="$t('game.labels.publisher')"
                        :placeholder="$t('game.placeholders.publisher')"/>
            <FormInput  v-model="game.developer"
                        :label="$t('game.labels.developer')"
                        :placeholder="$t('game.placeholders.developer')"/>
            <FormInput  v-model="game.hide"
                        type="toggle"
                        :label="$t('game.labels.hidden')"/>
        </div>
    </div>
</template>

<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
