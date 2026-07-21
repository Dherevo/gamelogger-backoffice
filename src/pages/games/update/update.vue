<template>
    <div id="games-update-page">

        <Loader v-if="!loaded" />

        <template v-else>
        <!-- Header + base fields -->
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/games')">
                        <SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}
                    </Btn>
                    <h1 class="h2 m-bottom-0">{{ $t('game.update.title') }}</h1>
                </div>
                <Btn ripple class="primary" type="submit" :loading="saving">
                    <SvgIcon name="prime/file-edit"/> {{ $t('game.update.save') }}
                </Btn>
            </div>
            <GamesForm :game :validator/>
        </form>

        <!-- Translations -->
        <div class="card m-top-20">
            <div class="flex-center m-bottom-15" style="justify-content: space-between;">
                <h2 class="h6 m-bottom-0">{{ $t('game.translations.title') }}</h2>
                <Btn ripple class="primary small" :loading="savingTranslations" @click="saveTranslations()">
                    <SvgIcon name="prime/check"/> {{ $t('game.translations.save') }}
                </Btn>
            </div>
            <FormInput v-for="locale in locales" :key="locale"
                       v-model="game.translations[locale]"
                       :label="$t('game.translations.name') + ' (' + locale.toUpperCase() + ')'"/>
        </div>

        <!-- Images -->
        <div class="card m-top-20">
            <h2 class="h6 m-bottom-15">{{ $t('game.images.title') }}</h2>
            <div class="images-row">
                <div class="image-block">
                    <span class="image-label">{{ $t('game.labels.icon') }}</span>
                    <FormInput type="image"
                               :src="game.icon || undefined"
                               v-model="iconFile"
                               @change="onIconChange($event)"/>
                </div>
                <div class="image-block">
                    <span class="image-label">{{ $t('game.labels.logo') }}</span>
                    <FormInput type="image"
                               :src="game.logo || undefined"
                               v-model="logoFile"
                               @change="onLogoChange($event)"/>
                </div>
            </div>
        </div>

        <!-- Platforms -->
        <div class="card m-top-20">
            <h2 class="h6 m-bottom-15">{{ $t('game.platforms.title') }}</h2>

            <div v-if="game.platforms.length === 0" class="empty-platforms m-bottom-15">
                {{ $t('game.platforms.empty') }}
            </div>

            <div v-for="pg in game.platforms" :key="pg.id" class="platform-row">
                <div class="platform-name">{{ pg.name }}</div>
                <FormInput class="platform-key"
                           v-model="pg.key"
                           :placeholder="$t('game.platforms.keyPlaceholder')"/>
                <Btn ripple class="primary small" @click="savePlatformKey(pg)">
                    <SvgIcon name="prime/check"/> {{ $t('generic.save') }}
                </Btn>
                <Btn ripple class="danger small" @click="removePlatform(pg)">
                    <SvgIcon name="prime/trash"/>
                </Btn>
            </div>

            <!-- Add platform -->
            <div class="platform-add m-top-15" v-if="availablePlatforms.length > 0">
                <FormInput type="select"
                           class="platform-select"
                           v-model="newPlatformId"
                           :options="availablePlatforms"
                           :placeholder="$t('game.platforms.selectPlatform')"/>
                <FormInput class="platform-key"
                           v-model="newPlatformKey"
                           :placeholder="$t('game.platforms.keyPlaceholder')"/>
                <Btn ripple class="primary small" :loading="addingPlatform" @click="addPlatform()">
                    <SvgIcon name="prime/plus"/> {{ $t('game.platforms.add') }}
                </Btn>
            </div>
        </div>
        </template>

    </div>
</template>

<script lang="ts" src="./update.ts"></script>
<style lang="scss" src="./update.scss"></style>
