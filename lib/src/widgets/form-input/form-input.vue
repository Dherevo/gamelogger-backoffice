<template>
    <div class="form-input" :class="getClass()" ref="formInputContainer">

        <template v-if="label && !['media','image','video'].includes(type)">
            <label v-if="['text', 
            'password',
            'email', 
            'number', 
            'search', 
            'checkbox', 
            'radio',
            'toggle',
            'textarea',
            'color'].includes(type)" 
            :for="inputName" 
            v-safe-html="getLabelContent()" />
            <span v-else class="label" v-safe-html="getLabelContent()" />
        </template>

        <template v-if="!hasSlot()">

            <TextInput v-if="['text', 'email', 'number'].includes(type)"
                ref="inputRef"
                :inputProps="inputProps"
                @update:modelValue="setValue($event)"
                :modelValue="modelValue"
                :placeholder="placeholder"
                :type="type"
                :readonly="readonly"
                :disabled="disabled"
                :name="inputName"
                :min="min"
                :max="max"
                :autoformat="autoformat"
                :showButtons="showButtons"
                :prefix="prefix"
                :suffix="suffix"
                :decimals="decimals"
                :currency="currency"
                :mask="mask"
                :suggestions="suggestions"
                @pressEnter="passEmit('pressEnter')"
                @pressTab="passEmit('pressTab')"
                @pressEscape="passEmit('pressEscape')"
                @keyup="passEmit('keyup', $event)"
                @blur="passEmit('blur', $event)"
                @focus="passEmit('focus', $event)"
                @close="passEmit('close', $event)"
                @stop="passEmit('stop', $event)"
                @suggestion-selected="passEmit('suggestion-selected', $event)">
                <template #option="{ option }" v-if="hasSlot('option')">
                    <slot name="option" :option="option" />
                </template>
            </TextInput>

            <PhoneInput v-else-if="type == 'phone'"
                ref="inputRef"
                :name="inputName"
                @update:modelValue="setValue($event)"
                :modelValue="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :phoneOptions="phoneOptions"
                @update:prefix="passEmit('update:prefix', $event)"
                @update:country="passEmit('update:country', $event)"
                @keyup="passEmit('keyup', $event)"
                @blur="passEmit('blur', $event)"
                @focus="passEmit('focus', $event)"/>

            <SearchInput v-else-if="type == 'search'" 
                ref="inputRef"
                :inputProps="inputProps"
                :name="inputName"
                :modelValue="modelValue"
                :disabled="disabled"
                :placeholder="placeholder"
                :readonly="readonly"
                @update:modelValue="setValue($event)"
                @pressEnter="passEmit('pressEnter')"
                @pressTab="passEmit('pressTab')"
                @pressEscape="passEmit('pressEscape')"
                @keyup="passEmit('keyup', $event)"
                @blur="passEmit('blur', $event)"
                @focus="passEmit('focus', $event)"
                @close="passEmit('close', $event)"
                @stop="passEmit('stop', $event)"
                @suggestion-selected="passEmit('suggestion-selected', $event)" />

            <TextareaInput v-else-if="type == 'textarea'"
                ref="inputRef"
                :inputProps="inputProps"
                :name="inputName"
                :modelValue="modelValue"
                @update:modelValue="setValue($event)"
                :disabled="disabled"
                :placeholder="placeholder"
                :readonly="readonly"
                :max="max"
                @pressEnter="passEmit('pressEnter')"
                @pressTab="passEmit('pressTab')"
                @pressEscape="passEmit('pressEscape')"
                @keyup="passEmit('keyup', $event)"
                @blur="passEmit('blur', $event)"
                @focus="passEmit('focus', $event)"
                @stop="passEmit('stop', $event)"/>

            <PasswordInput v-else-if="type == 'password'"
                ref="inputRef"
                :inputProps="inputProps"
                :name="inputName"
                :modelValue="modelValue"
                :disabled="disabled"
                :placeholder="placeholder"
                :readonly="readonly"
                :max="max"
                :icons="icons"
                @update:modelValue="setValue($event)"
                @pressEnter="passEmit('pressEnter')"
                @pressTab="passEmit('pressTab')"
                @pressEscape="passEmit('pressEscape')"
                @keyup="passEmit('keyup', $event)"
                @blur="passEmit('blur', $event)"
                @focus="passEmit('focus', $event)"
                @stop="passEmit('stop', $event)"/>

            <CheckboxInput v-else-if="type == 'checkbox'"
                ref="inputRef"
                :inputProps="inputProps"
                :modelValue="modelValue"
                :disabled="disabled"
                :readonly="readonly"
                @update:modelValue="setValue($event)"/>

            <RadioInput v-else-if="type == 'radio'"
                ref="inputRef"
                :inputProps="inputProps"
                :modelValue="modelValue"
                :disabled="disabled"
                :readonly="readonly"
                :group="group"
                :value="value"
                @update:modelValue="setValue($event)"/>

            <SwitchInput v-else-if="type == 'toggle'"
                ref="inputRef"
                :inputProps="inputProps"
                :name="inputName"
                :modelValue="modelValue"
                :disabled="disabled"
                :readonly="readonly"
                :useConfirm="hasEvent('confirm')"
                @confirm="passEmit('confirm', $event)"
                @update:modelValue="setValue($event)"/>

            <ColorInput v-else-if="type == 'color'"
                ref="inputRef"
                :inputProps="inputProps"
                :name="inputName"
                :modelValue="modelValue"
                :disabled="disabled"
                :readonly="readonly"
                :inline="inline"
                @update:modelValue="setValue($event)"/>

            <SelectInput v-else-if="type == 'select'"
                ref="inputRef"
                :inputProps="inputProps"
                :modelValue="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :options="options"
                :comparer="comparer"
                :multiple="multiple"
                :nullable="required === false"
                @update:modelValue="setValue($event)"
                @suggestion-selected="passEmit('suggestion-selected', $event)"
                :filter="hasEvent('filter')"
                @filter="passEmit('filter', $event)">

                <template #header v-if="hasSlot('header')">
                    <slot name="header"/>
                </template>

                <template #value="{ value }" v-if="hasSlot('value')">
                    <slot name="value" :value="value"/>
                </template>

                <template #option="{ option }" v-if="hasSlot('option')">
                    <slot name="option" :option="option"/>
                </template>

                <template #footer v-if="hasSlot('footer')">
                    <slot name="footer"/>
                </template>

            </SelectInput>

            <DateInput v-else-if="['date', 'datetime', 'time'].includes(type)"
                ref="inputRef"
                :modelValue="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :inputProps="inputProps"
                :min="min"
                :max="max"
                :inline="inline"
                :range="range"
                :months="months"
                :time="time"
                @update:modelValue="setValue($event)"
                @blur="passEmit('blur', $event)"
                @focus="passEmit('focus', $event)">

                <template #header v-if="hasSlot('header')">
                    <slot name="header"/>
                </template>

                <template #footer v-if="hasSlot('footer')">
                    <slot name="footer"/>
                </template>

            </DateInput>

            <EditorInput v-if="type == 'editor'"
                ref="inputRef"
                @update:modelValue="setValue($event)"
                @stop="passEmit('stop', $event)"
                @keyup="passEmit('keyup', $event)"
                @blur="passEmit('blur', $event)"
                @focus="passEmit('focus', $event)"
                v-bind="filterProps()"/>

            <FileInput v-if="['media', 'image', 'video'].includes(type)"
                ref="inputRef"
                @update:modelValue="setValue($event)"
                @stop="passEmit('stop', $event)"
                v-bind="filterProps()"/>

        </template>
        
        <label v-if="floatLabel" :for="inputName" style="pointer-events: none">{{floatLabel}}</label>

        <slot />

        <small class="form-input-help" :class="{floating: floatLabel}" v-if="help" v-html="help" />
        <small class="red" v-if="error || localError">{{error || localError}}</small>
        
    </div>
</template>

<script lang="ts" src="./form-input.ts"></script>
<style lang="scss" src="./form-input.scss"></style>