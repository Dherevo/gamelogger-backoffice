<template>
    <div id="admins-create-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/admins')">
                        <SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}
                    </Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('admin.create.title') }}</h1>
                </div>
                <Btn ripple class="primary" type="submit">
                    <SvgIcon name="prime/file-edit"/> {{ $t('admin.create.save') }}
                </Btn>
            </div>
            <AdminsForm form="create" :admin :validator/>
        </form>
    </div>
</template>

<script lang="ts" src="./create.ts"></script>
<style lang="scss" src="./create.scss"></style>
