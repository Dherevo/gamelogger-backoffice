<template>
    <div class="popup" :class="{
        open: expanded,
        dropdown: dropdownStyle
    }" ref="popup">
        <div class="popup-trigger" @click="togglePopup" ref="trigger">
            <slot name="button" />
            <SvgIcon
            :name="icon ? icon : 'tabler/dots-vertical'" 
            v-if="!hasSlot('button')"
            style="width:20px;height:20px"/>
        </div>

        <Popover @shop="expanded = true" 
        @hide="expanded = false" 
        :appendTo="dropdownStyle ? 'self' : 'body'"
        ref="popover" 
        class="popup-popover"
        :dismissable="autoClose">
            <div class="popup-content">
                <slot name="content" />
            </div>
        </Popover>
    </div>
</template>

<script lang="ts" src="./popup.ts"></script>
<style lang="scss" src="./popup.scss"></style>