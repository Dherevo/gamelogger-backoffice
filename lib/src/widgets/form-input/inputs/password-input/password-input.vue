<template>
    <template v-if="!isReadonly()">
        <Password ref="input"
        :modelValue="modelValue" 
        :inputId="inputName"
        :disabled="isDisabled()"
        :feedback="instructions ? true : false"
        :toggleMask="true"
        autocomplete="off"
        :placeholder="placeholder"
        @keydown.enter="passEmit('pressEnter')"
        @keydown.tab="passEmit('pressTab')"
        @keydown.esc="passEmit('pressEscape')"
        @keyup="passEmit('keyup', $event)"
        @blur="passEmit('blur', $event)"
        @focus="passEmit('focus', $event)"
        @input="updateValue($event.target.value)"
        v-bind="inputProps">
            <template #footer v-if="instructions">
                <br>
                <div v-safe-html="instructions" />    
            </template>
            <template #unmaskicon="{ toggleCallback }">
                <SvgIcon :name="icons[0]" class="p-password-toggle-mask-icon"
                @click="toggleCallback()"/>
            </template>
            <template #maskicon="{ toggleCallback }">
                <SvgIcon :name="icons[1]" class="p-password-toggle-mask-icon"
                @click="toggleCallback()"/>
            </template>
        </Password>
        <div class="length-counter" 
            v-if="max"
            :class="{
                overpassed: getLength() > max
        }">{{ getLength() + ' / ' + max }}</div>
    </template>
    <div class="flex-row gap-5" v-else>
        <div class="flex-grow">
            {{ showPassword ? modelValue : modelValue.replace(/./g, '*') }}
        </div>
        <svg-icon :name="showPassword ? 'prime/eye-slash' : 'prime/eye'" @click="showPassword = !showPassword"/>
    </div>
</template>

<script lang="ts" src="./password-input.ts"></script>
<style lang="scss">
.form-input.type-password {

    .p-password-toggle-mask-icon {
        cursor: pointer;
    }
}
</style>