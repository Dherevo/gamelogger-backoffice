<template>
    <div id="symptoms-update-page">
        <form @submit.prevent="save()">
            <div class="flex-bottom m-bottom-20" style="justify-content: space-between;">
                <div>
                    <Btn ripple class="link" @click="to('/symptoms')"><SvgIcon name="prime/arrow-left"/> {{ $t('generic.back') }}</Btn>
                    <h1 class="h2 m-bottom-0">{{ symptom.name }}</h1>
                </div>
                <Btn ripple class="primary" type="submit" :loading="saving"><SvgIcon name="prime/file-edit"/> {{ $t('symptom.update.save') }}</Btn>
            </div>

            <!-- Symptom info -->
            <div class="card m-bottom-20">
                <h3 class="h6 m-bottom-15">{{ $t('symptom.update.info') }}</h3>
                <FormInput :label="$t('generic.name')" v-model="symptom.name" :validator :required/>
                <FormInput :label="$t('symptom.labels.order')" v-model="symptom.displayOrder" type="number"/>
                <FormInput :label="$t('symptom.labels.active')" v-model="symptom.active" type="toggle"/>
                <FormInput :label="$t('symptom.labels.required')" v-model="symptom.required" type="toggle"/>
            </div>

            <!-- Grades -->
            <div class="card">
                <h3 class="h6 m-bottom-15">{{ $t('symptom.update.grades') }}</h3>
                <div v-for="grade in symptom.grades" :key="grade.id" class="grade-row m-bottom-15">
                    <div class="flex-row gap-10 align-center m-bottom-10">
                        <strong>{{ $t('symptom.labels.grade') }} {{ grade.value }} — {{ grade.label }}</strong>
                        <Btn ripple class="primary small" style="margin-left:auto" @click.prevent="saveGrade(grade)">
                            <SvgIcon name="prime/check"/> {{ $t('generic.save') }}
                        </Btn>
                    </div>
                    <FormInput :label="$t('symptom.labels.gradeLabel')" v-model="grade.label"/>
                    <FormInput :label="$t('symptom.labels.gradeDescription')" v-model="grade.description" type="textarea"/>
                    <FormInput :label="$t('symptom.labels.gradeCharacteristics')" v-model="grade.characteristics" type="textarea"/>

                    <!-- Image upload -->
                    <div class="grade-image-section">
                        <span class="grade-image-label">{{ $t('symptom.labels.gradeImage') }}</span>
                        <FormInput
                            type="image"
                            :src="grade.imageUrl || undefined"
                            v-model="gradeFiles[grade.id]"
                            @change="setGradeImage(grade, $event)"
                        />
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
<script lang="ts" src="./update.ts"></script>
<style lang="scss" src="./update.scss"></style>
