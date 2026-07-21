<template>
    <div class="decision-matrix-editor">
        <div class="flex-center m-bottom-20" style="justify-content: space-between; align-items: center;">
            <h1 class="h6 m-bottom-0">{{ $t('decisionMatrix.title') }}</h1>
            <Btn ripple class="primary" :loading="saving" @click="saveAll">
                <SvgIcon name="prime/check"/> {{ $t('decisionMatrix.saveAll') }}
            </Btn>
        </div>

        <Loader v-if="loading"/>
        <div v-else>

            <!-- Fallback rule -->
            <div class="card m-bottom-15">
                <h3 class="h6 m-bottom-5">{{ $t('decisionMatrix.fallback') }}</h3>
                <p class="text-muted m-bottom-15" style="font-size: var(--text-sm); margin-top: 0;">{{ $t('decisionMatrix.fallbackDesc') }}</p>
                <div class="fallback-row">
                    <FormInput
                        v-model="fallback.actionId"
                        type="select"
                        :options="actionOptions"
                        :label="$t('decisionMatrix.action')"
                    />
                    <FormInput
                        v-for="cat in categories"
                        :key="cat.id"
                        :model-value="fallback.productId(cat.id)"
                        @update:model-value="(v) => fallback.setProductId(cat.id, v)"
                        type="select"
                        :options="productOptions(cat.id)"
                        :label="cat.name"
                    />
                    <FormInput
                        v-model="fallback.includesAmpoules"
                        type="toggle"
                        :label="$t('decisionMatrix.includesAmpoules')"
                    />
                </div>
            </div>

            <!-- Filters -->
            <div class="card m-bottom-15">
                <h3 class="h6 m-bottom-10">{{ $t('decisionMatrix.filters') }}</h3>
                <div class="filters-row">
                    <FormInput
                        v-model="filterDesh"
                        type="select"
                        :options="levelOptions"
                        :label="$t('decisionMatrix.symptomDesh')"
                    />
                    <FormInput
                        v-model="filterRojez"
                        type="select"
                        :options="levelOptions"
                        :label="$t('decisionMatrix.symptomRojez')"
                    />
                    <FormInput
                        v-model="filterPicor"
                        type="select"
                        :options="levelOptions"
                        :label="$t('decisionMatrix.symptomPicor')"
                    />
                </div>
                <p class="text-muted" style="font-size: var(--text-sm); margin: 10px 0 0;">
                    {{ filteredEntries.length }} / {{ entries.length }} {{ $t('decisionMatrix.entriesShown') }}
                </p>
            </div>

            <!-- Matrix table -->
            <div class="card matrix-table-card">
                <div class="matrix-table-scroll">
                    <table class="matrix-table">
                        <thead>
                            <tr>
                                <th class="th-level">{{ $t('decisionMatrix.symptomDesh') }}</th>
                                <th class="th-level">{{ $t('decisionMatrix.symptomRojez') }}</th>
                                <th class="th-level">{{ $t('decisionMatrix.symptomPicor') }}</th>
                                <th class="th-action">{{ $t('decisionMatrix.action') }}</th>
                                <th v-for="cat in categories" :key="cat.id" class="th-product">{{ cat.name }}</th>
                                <th class="th-ampoules">{{ $t('decisionMatrix.includesAmpoules') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="entry in filteredEntries" :key="entryKey(entry)">
                                <td><span class="level-badge">{{ entry.deshidratacion }}</span></td>
                                <td><span class="level-badge">{{ entry.rojez }}</span></td>
                                <td><span class="level-badge">{{ entry.picor }}</span></td>
                                <td>
                                    <FormInput
                                        v-model="entry.actionId"
                                        type="select"
                                        :options="actionOptions"
                                    />
                                </td>
                                <td v-for="cat in categories" :key="cat.id">
                                    <FormInput
                                        :model-value="entry.productId(cat.id)"
                                        @update:model-value="(v) => entry.setProductId(cat.id, v)"
                                        type="select"
                                        :options="productOptions(cat.id)"
                                    />
                                </td>
                                <td class="td-ampoules">
                                    <FormInput
                                        v-model="entry.includesAmpoules"
                                        type="toggle"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</template>
<script lang="ts" src="./decision-matrix-editor.ts"></script>
<style lang="scss" src="./decision-matrix-editor.scss"></style>
