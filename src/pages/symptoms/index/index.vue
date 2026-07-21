<template>
    <div id="symptoms-index-page">
        <Message severity="success" class="m-bottom-20" v-if="message">{{ message }}</Message>

        <div class="flex-center m-bottom-20" style="justify-content: space-between; align-items: center;">
            <h1 class="h6 m-bottom-0">{{ $t('symptom.index.title') }}</h1>
            <div class="flex-row gap-10">
                <Btn ripple link="/symptoms/create" class="primary outline">
                    <SvgIcon name="prime/plus"/> {{ $t('symptom.index.create') }}
                </Btn>
                <Btn ripple class="primary" :loading="saving" @click="saveOrder">
                    <SvgIcon name="prime/check"/> {{ $t('symptom.index.saveOrder') }}
                </Btn>
            </div>
        </div>

        <Loader v-if="loading"/>
        <div v-else>
            <p class="drag-hint m-bottom-10">{{ $t('symptom.index.dragHint') }}</p>
            <div class="symptom-list">
                <div
                    v-for="(symptom, index) in symptoms"
                    :key="symptom.id"
                    class="symptom-row card"
                    :class="{
                        'is-dragging': draggedIndex === index,
                        'is-drag-over': dragOverIndex === index && dragOverIndex !== draggedIndex
                    }"
                    draggable="true"
                    @dragstart="onDragStart(index)"
                    @dragover.prevent="onDragOver(index)"
                    @drop.prevent="onDrop(index)"
                    @dragend="onDragEnd"
                >
                    <div class="drag-handle" title="Arrastrar para reordenar">
                        <SvgIcon name="prime/bars"/>
                    </div>
                    <div class="symptom-order">{{ symptom.displayOrder }}</div>
                    <div class="symptom-name">
                        <strong>{{ symptom.name }}</strong>
                        <span class="symptom-type-badge">{{ symptom.typeLabel }}</span>
                    </div>
                    <div class="symptom-grades-count">{{ symptom.grades.length }} {{ $t('symptom.labels.grades').toLowerCase() }}</div>
                    <div class="symptom-actions">
                        <Btn fill ripple :class="symptom.active ? 'alt outline' : 'primary'" @click="toggleStatus(symptom)">
                            {{ symptom.active ? $t('symptom.actions.active') : $t('symptom.actions.inactive') }}
                        </Btn>
                        <Btn ripple class="primary" @click="goEdit(symptom)">
                            <SvgIcon name="prime/pencil"/>
                        </Btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
