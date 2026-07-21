<template>
    <template v-if="!isReadonly()">
        <Select v-if="!multiple" 
            :placeholder="placeholder"
            appendTo="self"
            :modelValue="selectOption" 
            @change="updateValue($event.value)"
            append-to="body"
            :disabled="disabled"
            :loading="loading"
            :options="getDropdownOptions()" 
            panelClass="form-input-select"
            :empty-message="filtering ? ' ' : undefined"
            @show="onSelectExpanded($event)"
            @hide="onSelectClosed($event)"
            v-bind="inputProps"
            ref="select">
                <template #value="{ value }">
                    <div class="flex-row gap-5">
                        <div class="flex-grow">
                            <slot v-if="hasSlot('value')" name="value" :value="value"/>
                            <div v-else-if="value && !value.component" v-safe-html="value.content ? value.content : value.value"/>
                            <component v-else-if="value && value.component" :is="value.component" v-bind="value.props ? value.props : {}" />
                            <div v-else v-safe-html="placeholder" />
                        </div>

                        <SvgIcon v-if="value && nullable" 
                        style="width: 18px; height: 18px;"
                        name="prime/times" 
                        @click.stop="setValue(undefined)" />
                    </div>
                </template>
                <template #option="{ option }">
                    <div class="dropdown-option">
                        <slot v-if="hasSlot('option')" name="option" :option="option"/>
                        <div v-else-if="!option.component" v-safe-html="option.content ? option.content : option.value"/>
                        <component v-else :is="option.component" v-bind="option.props ? option.props : {}"/>
                    </div>
                </template>
                <template #header v-if="filter || hasSlot('header')">
                    <slot name="header" v-if="hasSlot('header')"/>

                    <div v-if="filter" class="p-select-filter">
                        
                        <div class="p-select-filter-input">
                            <InputText v-model="search" 
                            class="p-inputtext-sm" 
                            :placeholder="$t('generic.search')"
                            @keyup="filterChanged($event)"
                            ref="filterInput" />
                            <SvgIcon name="prime/search"/>
                        </div>

                        <Loader v-if="filtering" />
                    </div>
                </template>
                <template #footer v-if="hasSlot('footer')">
                    <slot name="footer"/>
                </template>
            </Select>

        <MultiSelect v-else
            :modelValue="selectedOptions"
            @update:modelValue="updateValue($event)"
            optionLabel="content"
            :appendTo="appendTo"
            :disabled="disabled"
            :loading="loading"
            :placeholder="placeholder"
            :options="getDropdownOptions()" 
            @show="onSelectExpanded($event)"
            @hide="passEmit('close', $event)"
            :empty-message="filtering ? ' ' : undefined"
            panelClass="form-input-select"
            v-bind="inputProps">
                <template #value>
                    {{ multiSelectValue() }}
                </template>
                <template #option="{ option }">
                    <div class="dropdown-option">
                        <slot v-if="hasSlot('option')" name="option" :option="option"/>
                        <div v-else-if="!option.component" v-safe-html="option.content ? option.content : option.value"/>
                        <component v-else :is="option.component" v-bind="option.props ? option.props : {}"/>
                    </div>
                </template>
                <template #header v-if="filter || hasSlot('header')">
                    <slot name="header" v-if="hasSlot('header')"/>

                    <div v-if="filter" class="p-select-filter">
                        
                        <div class="p-select-filter-input">
                            <InputText v-model="search" 
                            class="p-inputtext-sm" 
                            :placeholder="$t('generic.search')"
                            @keyup="filterChanged($event)"
                            ref="filterInput" />
                            <SvgIcon name="prime/search"/>
                        </div>

                        <Loader v-if="filtering" />
                    </div>
                </template>
                <template #footer v-if="hasSlot('footer')">
                    <slot name="footer"/>
                </template>
            </MultiSelect>

    </template>
    <div v-else class="readonly-value">{{ readonlyValue() }}</div>
</template>

<script lang="ts" src="./select-input.ts"></script>
<style lang="scss" src="./select-input.scss"></style>