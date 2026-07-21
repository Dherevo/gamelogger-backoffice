<template>
    <div id="admins-index-page">
        <Message severity="success" class="m-bottom-20" v-if="message">{{ message }}</Message>
        <AppTable :table="table">
            <template #header>
                <div class="header flex-center gap-20" style="justify-content: space-between;">
                    <h1 class="h6 m-bottom-0">{{ $t('admin.index.title') }}</h1>
                    <div class="flex-center gap-10">
                        <FormInput  v-model="table.filters.search"
                                    type="search"
                                    :placeholder="$t('generic.search')"
                                    @stop="table.refresh()"/>
                        <Btn ripple link="/admins/create" class="primary">
                            <SvgIcon name="prime/plus"/> {{ $t('admin.index.create') }}
                        </Btn>
                    </div>
                </div>
            </template>
        </AppTable>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
