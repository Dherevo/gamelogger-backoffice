<template>
    <Box id="users-page" v-if="true">
        
        <AppTable :table="table">

            <template #header-actions>
                <Btn>
                    <SvgIcon name="heroicons-solid/plus" />
                    {{ $t('users.add') }}
                </Btn>
            </template>

            <!-- COLUMNA NOMBRE -->
            <template #col-name="{ item }">
                <div class="flex-row gap-10">
                    <Avatar :src="item.image" :name="item.name"/>
                    <img v-if="false" class="circular" style="width:30px;height:30px" :src="item.image" />
                    <div>
                        <div><b>{{ item.fullName }}</b></div>
                        <div><small>{{ item.email }}</small></div>
                    </div>
                </div>
            </template>

            <!-- COLUMNA DEPARTAMENTO -->
            <template #edit-department="{ item, value, setValue }">
                <select :value="value" @change="setValue($event.target?.value)">
                    <option v-for="(d, k) in $t('department')" :key="k" :value="k">
                        {{ d }}
                    </option>
                </select>
            </template>

            <template #search-department="{ col, search }">
                <select v-model="table.filters.department" @change="search.complete()">
                    <option value="all">{{ $t('generic.all') }}</option>
                    <option v-for="(d, k) in $t('department')" :key="k" :value="k">
                        {{ d }}
                    </option>
                </select>
            </template>

            <!-- COLUMNA ESTADO -->
            <template #col-status="{ item }">
                <Tag rounded :severity="
                    item.status == 'active' ? 'success' : 
                    (item.status == 'waiting' ? 'info' : 'danger')
                ">{{ $t('status.' + item.status) }}</Tag>
            </template>

            <template #edit-status="{ item }">
                <select v-model="item.status">
                    <option v-for="(d, k) in $t('status')" :key="k" :value="k">
                        {{ d }}
                    </option>
                </select>
            </template>

        </AppTable>
    </Box>

</template>

<script lang="ts" src="./users.ts"></script>
<style lang="scss" src="./users.scss"></style>