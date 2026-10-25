<template>
    <div class="users-form">
        <div class="form card">
            <FormInput  v-model="user.name"
                        :label="$t('generic.name')"
                        :placeholder="$t('users.placeholders.name')"
                        :validator="validator.add('name', () => user.name).notEmpty().causesError($t('users.errors.name'))"/>
            <FormInput  v-model="user.nickname"
                        :label="$t('users.labels.nickname')"
                        :placeholder="$t('users.placeholders.nickname')"
                        :validator="validator.add('nickname', () => user.nickname).notEmpty().causesError($t('users.errors.nickname'))"/>
            <FormInput  v-model="user.email"
                        type="email"
                        :label="$t('generic.email')"
                        :placeholder="$t('users.placeholders.email')"
                        :validator="validator.add('email', () => user.email).isEmail().causesError($t('forms.errors.email'))"/>

            <FormInput  v-if="form === 'create'"
                        v-model="user.password"
                        type="password"
                        :label="$t('generic.password')"
                        :placeholder="$t('users.placeholders.password')"
                        :validator="validator.add('password', () => user.password).notEmpty().causesError($t('users.errors.password'))"/>
            <FormInput  v-else
                        v-model="user.password"
                        type="password"
                        :label="$t('generic.password')"
                        :placeholder="$t('users.placeholders.password')"
                        :help="$t('users.form.passwordHint')"/>

            <FormInput  v-model="user.isAdmin"
                        type="toggle"
                        :label="$t('users.labels.admin')"/>

            <template v-if="form === 'update'">
                <FormInput  v-model="user.steam_id"
                            :label="$t('users.labels.steamId')"
                            :placeholder="$t('users.placeholders.steamId')"
                            :help="$t('users.form.steamHint')"
                            :validator="validator.add('steam_id', () => user.steam_id)"/>
                <div v-if="user.steam_id" class="steam-link">
                    <a :href="`https://steamcommunity.com/profiles/${user.steam_id}`" target="_blank" rel="noopener">
                        {{ $t('users.form.openSteam') }}
                    </a>
                    <span v-if="user.steam_last_synced_at" class="steam-sync">
                        {{ $t('users.labels.lastSync') }}: {{ String(user.steam_last_synced_at).slice(0, 16).replace('T', ' ') }}
                    </span>
                </div>

                <FormInput  v-model="user.locale"
                            type="select"
                            :label="$t('users.labels.locale')"
                            :options="localeOptions"
                            :required="false"
                            :placeholder="$t('users.form.localeNone')"/>
                <FormInput  v-model="user.profile_visibility"
                            type="select"
                            :label="$t('users.labels.visibility')"
                            :options="visibilityOptions"
                            :help="$t('users.form.visibilityHint')"/>

                <div class="user-stats">
                    {{ $t('users.labels.games') }}: <strong>{{ user.games_count }}</strong>
                    · {{ $t('users.labels.completed') }}: <strong>{{ user.completed_games }}</strong>
                    <template v-if="user.created_at"> · {{ $t('users.labels.createdAt') }}: <strong>{{ String(user.created_at).slice(0, 10) }}</strong></template>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" src="./form.ts"></script>
<style lang="scss" src="./form.scss"></style>
