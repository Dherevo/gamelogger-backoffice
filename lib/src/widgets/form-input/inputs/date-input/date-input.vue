<template>
    <div v-if="!isReadonly()">

        <DatePicker
        v-if="inline"
        :inline="true"
        :modelValue="dateValue" 
        @date-select="updateValue($event)" 
        :disabled="isDisabled()"
        panelClass="form-input-calendar"
        :minDate="minDate"
        :maxDate="maxDate"
        :selectionMode="range ? 'range' : 'simple'"
        :numberOfMonths="months"
        v-bind="inputProps">
            <template #header v-if="hasSlot('header')">
                <slot name="header"/>
            </template>

            <template #footer v-if="hasSlot('footer')">
                <slot name="footer"/>
            </template>
        </DatePicker>

        <div v-else 
            class="form-input-calendar-input"
            :class="{
                'invalid': invalidDate
            }">

            <div class="calendar-input-container">
                <div class="calendar-button" @click="togglePopover">
                    <SvgIcon name="prime/calendar"/>
                </div>
                <InputMask v-if="!date1Invalid"
                    ref="calendarInput"
                    v-model="dateText"
                    @update:modelValue="checkCalendarTextFormat()"
                    :mask="calendarMask"
                    :placeholder="calendarMask.replaceAll('9', '_')"
                    @click="togglePopover"/>

                <template v-if="range">
                    <span>-</span>
                    <InputMask 
                    ref="calendarInput2"
                    v-model="dateText2"
                    :mask="calendarMask"
                    @update:modelValue="checkCalendarTextFormat(2)"
                    :placeholder="calendarMask.replaceAll('9', '_')"
                    @click="togglePopover"/>
                </template>
            </div>

            <Popover ref="popover" class="form-input-date-popover">
                <DatePicker
                :inline="true"
                :modelValue="dateValue" 
                @date-select="calendarDateSelected" 
                :disabled="isDisabled()"
                panelClass="form-input-calendar"
                :minDate="minDate"
                :maxDate="maxDate"
                :dateFormat="momentToPrimeFormat()"
                :selectionMode="range ? 'range' : 'simple'"
                :numberOfMonths="months"
                v-bind="inputProps">
                    <template #header v-if="hasSlot('header')">
                        <slot name="header"/>
                    </template>

                    <template #footer v-if="hasSlot('footer')">
                        <slot name="footer"/>
                    </template>
                    
                    <template #date="{ date }">
                        <span class="day-number" :class="{ active: isActiveDay(date)}">{{ date.day }}</span>
                        <span role="presentation" a
                        ria-hidden="true" 
                        data-p-ink="true" 
                        data-p-ink-active="false" 
                        class="p-ink" 
                        pd56="" 
                        data-pc-name="ripple" 
                        data-pc-section="root" />
                    </template>
                </DatePicker>
            </Popover>

            <div class="flex-row time-inputs" v-if="time && !range">
                <div class="calendar-button" @click="toggleTimePopover">
                    <SvgIcon name="prime/clock" style="color: gray; flex: 0 0 20px; margin-left: 10px;"/>
                </div>

                <InputMask 
                    @click="toggleTimePopover"
                    ref="hourInput"
                    v-model="hourText"
                    @blur="onTimeInputsBlur"
                    @keyup="checkTimeAutoFocus('hour', $event)"
                    mask="99" 
                    placeholder="00" />

                <span>:</span>
                <InputMask 
                    @click="toggleTimePopover"
                    ref="minuteInput"
                    v-model="minuteText"
                    @blur="onTimeInputsBlur"
                    @keyup="checkTimeAutoFocus('minute', $event)"
                    mask="99" 
                    placeholder="00" />
            </div>

            <Popover ref="timePopover" class="form-input-date-popover">
                <DatePicker id="datepicker-timeonly" v-model="timeDate" timeOnly fluid inline
                    @update:model-value="updateTimeTextsFromPicker" />
            </Popover>
        </div>

    </div>

    <div v-else class="readonly-value" v-safe-html="readonlyText()"/>
</template>

<script lang="ts" src="./date-input.ts"></script>
<style lang="scss" src="./date-input.scss"></style>