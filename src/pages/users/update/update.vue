<template>
    <div id="users-update-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/users')">
                        <SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}
                    </Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('users.update.title') }}</h1>
                </div>
                <Btn ripple class="primary" type="submit" :loading="saving">
                    <SvgIcon name="prime/file-edit"/> {{ $t('users.update.save') }}
                </Btn>
            </div>
            <UsersForm form="update" :user :validator/>
        </form>
    </div>
</template>

<script lang="ts" src="./update.ts"></script>
<style lang="scss" src="./update.scss"></style>
