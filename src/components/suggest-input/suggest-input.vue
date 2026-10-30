<template>
    <div class="suggest-input">
        <label v-if="label" class="suggest-label">{{ label }}</label>
        <div class="suggest-box" :class="{ focused: open }">
            <span v-for="(chip, i) in chips" :key="chip" class="suggest-chip">
                {{ chip }}
                <button type="button" tabindex="-1" @mousedown.prevent="remove(i)">&times;</button>
            </span>
            <input v-model="text"
                   type="text"
                   autocomplete="off"
                   :placeholder="chips.length ? '' : placeholder"
                   @input="onInput()"
                   @focus="onFocus()"
                   @blur="onBlur()"
                   @keydown.enter.prevent="onEnter()"
                   @keydown.esc="open = false"
                   @keydown.backspace="onBackspace()"/>
        </div>
        <ul v-if="open && (visibleSuggestions.length || canCreate)" class="suggest-list">
            <li v-for="s in visibleSuggestions" :key="s" @mousedown.prevent="pick(s)">{{ s }}</li>
            <li v-if="canCreate" class="suggest-create" @mousedown.prevent="pick(typed)">
                {{ $t('game.suggest.create', { name: typed }) }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts" src="./suggest-input.ts"></script>
<style lang="scss" src="./suggest-input.scss"></style>
