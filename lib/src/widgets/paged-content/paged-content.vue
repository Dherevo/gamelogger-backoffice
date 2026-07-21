<template>
    <div class="paged-content">

        <loader v-if="!table || !table.items" />

        <p class="empty" v-else-if="table && table.items.length == 0 && table.page == 1">{{ emptyMessage ?? $t('generic.no_results') }}</p>

        <template v-else>

            <Row space>
                <Col v-bind="grid ?? {
                    lg: 1,
                    md: 1,
                    sm: 1,
                    xs: 1,
                    col: 1
                }" v-for="item of table.items" :key="item.id">
                    <slot name="item" :item="item" />
                </Col>
            </Row>

            <Paginator v-if="table._paginator && 
                ((table.items && table._paginator.totalResults > table._paginator.pageSize)
                || table._paginator.structure.has('RowsPerPageDropdown'))" 
            v-model:first="paginatorFirst"
            :rows="table._paginator.pageSize" :totalRecords="table._paginator.totalResults"
            :template="table._paginator ? table._paginator.structure.toString() : undefined"
            :rowsPerPageOptions="table._paginator ? table._paginator.structure.perPageOptions : undefined"
            @page="onPageChange($event)" 
            :currentPageReportTemplate="table._paginator ? table._paginator.structure.textTemplate : undefined"/>
        </template>

    </div>
</template>

<style lang="scss" src="./paged-content.scss"></style>
<script lang="ts" src="./paged-content.ts"></script>