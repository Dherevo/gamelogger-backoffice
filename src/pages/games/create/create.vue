<template>
    <div id="games-create-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/games')">
                        <SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}
                    </Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('game.create.title') }}</h1>
                </div>
                <Btn ripple class="primary" type="submit" :loading="saving">
                    <SvgIcon name="prime/file-edit"/> {{ $t('game.create.save') }}
                </Btn>
            </div>
            <GamesForm :game :validator/>
            <div class="card m-top-20">
                <h2 class="h6 m-bottom-15">{{ $t('game.images.title') }}</h2>
                <div class="images-row">
                    <div class="image-block">
                        <span class="image-label">{{ $t('game.labels.icon') }}</span>
                        <FormInput type="image" v-model="iconFile"/>
                    </div>
                    <div class="image-block">
                        <span class="image-label">{{ $t('game.labels.logo') }}</span>
                        <FormInput type="image" v-model="logoFile"/>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts" src="./create.ts"></script>
<style lang="scss" src="./create.scss"></style>
