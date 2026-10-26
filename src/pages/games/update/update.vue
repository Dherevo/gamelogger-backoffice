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

        <!-- Languages -->
        <div class="card m-top-20">
            <div class="flex-center m-bottom-15" style="justify-content: space-between;">
                <h2 class="h6 m-bottom-0">{{ $t('game.languages.title') }}</h2>
                <Btn ripple class="primary small" :loading="savingLanguages" @click="saveLanguages()">
                    <SvgIcon name="prime/check"/> {{ $t('game.languages.save') }}
                </Btn>
            </div>

            <div v-if="game.languages.length === 0" class="empty-platforms m-bottom-15">
                {{ $t('game.languages.empty') }}
            </div>

            <div v-for="(l, i) in game.languages" :key="l.name" class="language-row">
                <div class="platform-name">{{ l.name }}</div>
                <FormInput v-model="l.text" type="toggle" :label="$t('game.languages.text')"/>
                <FormInput v-model="l.audio" type="toggle" :label="$t('game.languages.audio')"/>
                <FormInput v-model="l.is_mod" type="toggle" :label="$t('game.languages.mod')"/>
                <FormInput v-if="l.is_mod" class="platform-key" v-model="l.mod_url" :placeholder="$t('game.languages.modUrl')"/>
                <span v-else class="platform-key"></span>
                <Btn ripple class="danger small" @click="removeLanguage(i)">
                    <SvgIcon name="prime/trash"/>
                </Btn>
            </div>

            <div class="platform-add m-top-15" v-if="availableLanguages.length > 0">
                <FormInput type="select"
                           class="platform-select"
                           v-model="newLanguage"
                           :options="availableLanguages"
                           :placeholder="$t('game.languages.select')"/>
                <Btn ripple class="primary small" @click="addLanguage()">
                    <SvgIcon name="prime/plus"/> {{ $t('game.languages.add') }}
                </Btn>
            </div>
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
                <div class="platform-key-readonly" :title="$t('game.platforms.keyLocked')">
                    <a v-if="pg.url" :href="pg.url" target="_blank" rel="noopener">{{ pg.key }}</a>
                    <span v-else>{{ pg.key }}</span>
                    <SvgIcon name="prime/lock"/>
                </div>
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

        <!-- Achievements -->
        <div class="card m-top-20 achievements-card">
            <div class="flex-center m-bottom-15" style="justify-content: space-between;">
                <h2 class="h6 m-bottom-0">{{ $t('game.achievements.title') }}</h2>
                <Btn ripple class="no-fill small" :loading="syncingAchievements" @click="syncAchievementsFromSteam()">
                    <SvgIcon name="prime/refresh"/> {{ $t('game.achievements.sync.button') }}
                </Btn>
                <div v-if="achievementsTotal > 0" class="achievements-pager">
                    <Btn ripple class="no-fill small" :disabled="achievementsOffset <= 0" @click="prevAchievementsPage()">
                        <SvgIcon name="prime/chevron-left"/>
                    </Btn>
                    <span class="achievements-pager-label">
                        {{ $t('game.achievements.page', { page: achievementsPage, total: achievementsTotalPages, count: achievementsTotal }) }}
                    </span>
                    <Btn ripple class="no-fill small" :disabled="achievementsOffset + achievementsPageSize >= achievementsTotal" @click="nextAchievementsPage()">
                        <SvgIcon name="prime/chevron-right"/>
                    </Btn>
                </div>
            </div>

            <template v-if="storyPlatforms.length">
                <div v-for="pg in storyPlatforms" :key="pg.id" class="story-summary m-bottom-15">
                    <SvgIcon name="prime/bookmark-fill"/>
                    <span>{{ $t('game.achievements.story.current') }}:
                        <strong>{{ pg.story_achievement?.title || pg.story_achievement?.name }}</strong>
                        <template v-if="storyPlatforms.length > 1"> ({{ pg.name }})</template>
                    </span>
                    <Btn ripple class="no-fill small" :loading="changingStory[pg.story_achievement?.id ?? 0]" @click="unmarkStory(pg)">
                        {{ $t('game.achievements.story.remove') }}
                    </Btn>
                </div>
            </template>
            <div v-else-if="achievementsTotal > 0" class="story-hint m-bottom-15">
                {{ $t('game.achievements.story.hint') }}
            </div>

            <Loader v-if="!achievementsLoaded" />

            <template v-else>
                <div v-if="achievements.length === 0" class="empty-achievements">
                    {{ $t('game.achievements.empty') }}
                </div>

                <div v-for="a in achievements" :key="a.id" class="achievement">
                    <div class="achievement-row">
                        <div class="achievement-icon"
                             :style="{ backgroundImage: a.icon ? `url('${a.icon}')` : '' }"></div>
                        <div class="achievement-main">
                            <div class="achievement-name">{{ a.name }}</div>
                            <FormInput class="achievement-title"
                                       v-model="a.title"
                                       :placeholder="$t('game.achievements.titlePlaceholder')"/>
                            <FormInput type="textarea"
                                       class="achievement-description"
                                       v-model="a.description"
                                       :placeholder="$t('game.achievements.description')"/>
                        </div>
                        <Btn ripple :class="a.is_story_completion ? 'primary small' : 'no-fill small'"
                             :loading="changingStory[a.id]" @click="toggleStory(a)">
                            <SvgIcon :name="a.is_story_completion ? 'prime/bookmark-fill' : 'prime/bookmark'"/>
                            {{ a.is_story_completion ? $t('game.achievements.story.isStory') : $t('game.achievements.story.mark') }}
                        </Btn>
                        <Btn ripple class="no-fill small" @click="toggleAchievement(a)">
                            <SvgIcon :name="expandedAchievements[a.id] ? 'prime/chevron-up' : 'prime/chevron-down'"/>
                            {{ $t('game.achievements.translations') }}
                        </Btn>
                        <Btn ripple class="primary small" :loading="savingAchievements[a.id]" @click="saveAchievement(a)">
                            <SvgIcon name="prime/check"/> {{ $t('generic.save') }}
                        </Btn>
                    </div>

                    <div v-if="expandedAchievements[a.id]" class="achievement-expanded">
                        <FormInput v-for="locale in locales" :key="locale"
                                   v-model="a.translations[locale]"
                                   :label="$t('game.achievements.title') + ' (' + locale.toUpperCase() + ')'"/>
                    </div>
                </div>
            </template>
        </div>
        </template>

    </div>
</template>

<script lang="ts" src="./update.ts"></script>
<style lang="scss" src="./update.scss"></style>
