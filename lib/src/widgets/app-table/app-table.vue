<template>
    <div class="app-table" :class="{
        clickable: table && table._onClickRowListener
    }">

        <slot name="header" v-if="hasSlot('header')"/>
        <AppTableHeader v-else :table="table">
            <template #header-actions v-if="hasSlot('header-actions')">
                <slot name="header-actions" />
            </template>
        </AppTableHeader>

        <AppTableFilters :table="table" 
        v-if="hasSlot('filters') || (table?.tableFilters && table?.tableFilters.length > 0)">
            <template #filters>
                <slot name="filters" />
            </template>
        </AppTableFilters>

        <AppTableBulkActions :table="table"/>

        <MirrorScroll
            :scroller="$refs.tableRef"
            ref="mirrorScroll"/>

        <Loader v-if="!table || !table.items"/>

        <div v-else class="app-table-container">

            <AppTableColumnsVisibility :table="table"
                :open="visibilityOpen"
                @open="visibilityOpen = true" />

            <DataTable :value="table.items" 
            tableStyle="min-width: 50rem" 
            ref="tableRef" 
            scrollable
            :stripedRows="table._striped" 
            :onRowReorder="onRowReorder" 
            :showGridlines="table._gridlines"
            @sort="table._handleSort($event)" 
            removableSort 
            :sortField="table.sort ? table.sort.by : undefined" 
            :sortOrder="table.sort ? (table.sort.order == 'ASC' ? 1 : -1) : 0" 
            :loading="loading"
            v-model:selection="table.selectedItems" 
            :style="{height: lockedHeight}"
            :stateStorage="table.stateType && table.stateType != 'url' ? (table.stateType == 'session' ? 'session' : 'custom'): undefined"
            :stateKey="(table.stateKey && table.stateType != 'url') ? table.stateKey : undefined"
            :resizableColumns="table._resizeColumns ? true : false" :columnResizeMode="table._resizeColumns"
            :frozenValue="table._lockedItems.length > 0 ? table._lockedItems : undefined"
            v-model:expandedRows="table._expandedRows" 
            :metaKeySelection="false"
            @rowSelect="table && table._selectedListener ? table._selectedListener($event, true) : undefined" 
            @rowUnselect="table && table._selectedListener ? table._selectedListener($event, false) : undefined"
            @rowSelectAll="table && table._selectedListener ? table._selectedListener(undefined, true) : undefined"
            @rowUnselectAll="table && table._selectedListener ? table._selectedListener(undefined, false) : undefined"
            @rowClick="_clickedRow($event.index)"
            @rowDblclick="_clickedRow($event.index, true)"
            :rowStyle="rowStyle"
            :rowClass="data => [{
                'p-datatable-row-selected': table && table.selectedItems.includes(data)
            }, (table ? table._rowClass(data) : {})]"
            :class="table._ref && table._ref.loading ? 'loading' : ''">

                <!-- TABLE EMPTY MESSAGE (table.items == [])-->
                <template #empty v-if="table.emptyMessage">{{table.emptyMessage}}</template>

                <!-- LOADER (necessary? There is loader above)-->
                <template #loading><Loader/></template>

                <!-- CHECKBOX COLUMN-->
                <Column 
                v-if="table._selectable"
                :selectionMode="table._selectable" 
                headerStyle="width: 3rem" />

                <!-- DRAG ICON TO REORDER COLUMNS -->
                <Column 
                v-if="table._draggable"
                :rowReorder="true" 
                :class="'dragIconColumn'"  
                :frozen="true" 
                :exportable="false" 
                header=""></Column>

                <!-- CHEVRON ARROW TO EXPAND ROWS -->
                <Column expander v-if="table._expansion" style="width: 3rem" />

                <!-- EACH COLUMN CONTENT -->
                <template v-for="(col, index) in table.columns" 
                :key="col.name">
                    <Column 
                    v-if="col.visible !== false"
                    :field="col.name"
                    :class="columnClass(col)"
                    :style="columnStyle(col)"
                    :sortable="col.sortable"
                    :frozen="col.fixed"
                    :alignFrozen="index >= table.columns.length - 1 ? 'right' : 'left'">

                        <template #header>
                            <AppTableColumnHeader :table="table" :col="col" />
                        </template>

                        <template #body="{ data, index }">
                            <AppTableColumnBody :table="table"
                                :col="col"
                                :item="data"
                                :index="index"
                                :editItem="editItem"
                                :editCol="editCol"
                                v-model:editValue="editValue"
                                @startEdit="startEdit(data, col)"
                                @stopEdit="_endEdit($event)">

                                <template v-slot:[`col-${col.name}`]="{ item, index }"
                                    v-if="hasSlot(`col-${col.name}`)">
                                    <slot :name="`col-${col.name}`" :item="item" :index="index" />
                                </template>

                                <template v-slot:[`edit-${col.name}`]="{ item, value, setValue }"
                                    v-if="hasSlot(`edit-${col.name}`)">
                                    <slot :name="`edit-${col.name}`" :item="item" :value="value" :setValue="setValue" />
                                </template>

                            </AppTableColumnBody>
                        </template>
                    </Column>
                </template>

                <Column v-if="table.itemOptions"
                class="item-options-column"
                :frozen="true"
                alignFrozen="right"
                :headerStyle="{
                    'max-width': '60px',
                    width: '60px'
                }"
                :style="{
                    width: table._itemOptionsMode == 'alwaysPopup' || 
                     (
                        table.itemOptions({
                            column: {},
                            data: table.items[0]
                        }).length > 1 &&
                        (table._itemOptionsMode == 'singleIconMultiplePopup' || table._itemOptionsMode == 'singleButtonMultiplePopup')
                    ) ? '60px' : ''
                }">
                    <template #header v-if="table._useVisibility">
                    </template>

                    <template #body="{ data, index, column }">
                        <AppTableRowOptions :table="table" 
                            :col="column" 
                            :item="data" 
                            :index="index"
                            @clicked="itemOptionsClicked()" />
                    </template>
                </Column>

                <template #expansion="slotProps" v-if="table._expansion">
                    <div v-if="table._expansion.html" v-safe-html="table._expansion.component(slotProps.data)" />
                    <component v-else :is="table._expansion.component" 
                    v-bind="table._expansion.props ? table._expansion.props(slotProps.data) : {}" />
                </template>

            </DataTable>

            <AppTableFooter :table="table"/>

        </div>

    </div>
</template>

<script lang="ts" src="./app-table.ts"></script>
<style lang="scss" src="./app-table.scss"></style>