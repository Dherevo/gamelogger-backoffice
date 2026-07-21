<template>
    <div id="patients-index-page">
        <Message severity="success" class="m-bottom-20" v-if="message">{{ message }}</Message>
        <AppTable :table="table">
            <template #header>
                <div class="header flex-center gap-20" style="justify-content: space-between;">
                    <h1 class="h6 m-bottom-0">{{ $t('patients.index.title') }}</h1>
                    <div class="flex-center gap-10">
                        <FormInput v-model="table.filters.search"
                                   type="search"
                                   :placeholder="$t('generic.search')"
                                   @stop="table.refresh()"/>
                        <Btn ripple class="primary" link="/patients/create">
                            <SvgIcon name="prime/plus"/> {{ $t('patients.index.create') }}
                        </Btn>
                    </div>
                </div>
            </template>
            <template #col-fullName="{ item }">
                <span v-if="item.fullName">{{ item.fullName }}</span>
                <span v-else class="text-muted" style="font-style: italic;">{{ $t('patients.labels.noName') }}</span>
            </template>
            <template #col-status="{ item }">
                <Btn fill ripple :class="item.status ? 'alt outline' : 'primary'" @click="toggleStatus(item)">
                    {{ item.status ? $t('patients.actions.status.active') : $t('patients.actions.status.disabled') }}
                </Btn>
            </template>
            <template #col-verified="{ item }">
                <Btn fill ripple class="primary" @click="verify(item)" v-if="!item.verified">
                    {{ $t('patients.actions.verify') }}
                </Btn>
                <Btn ripple rounded center class="tag success" v-if="item.verified">
                    <SvgIcon name="prime/check-circle"/> {{ $t('patients.tags.verified') }}
                </Btn>
            </template>
        </AppTable>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
