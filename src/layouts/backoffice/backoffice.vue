<template>
    <div id="backoffice-layout">

        <Stack id="backoffice-menu" :class="{ collapsed }">

            <!-- MENU HEADER -->
            <div id="backoffice-menu-header">
                
                <Inline space="20">
                    <div v-grow class="logo">
                        <img src="/images/logo.svg">
                    </div>

                    <Btn style="border-radius: 50%;" class="toggle-menu" @click="toggleMenu()">
                        <SvgIcon name="awesome-solid/angles-left" />
                    </Btn>
                </Inline>

            </div>

            <!-- MENU CONTENT -->
            <div id="backoffice-menu-content" class="scrollbar">

                <TieredMenu v-if="menuItems" :model="menuItems">
                    <template #item="{ item }" >
                        <MenuItem :item="item" :collapsed="collapsed"/>
                    </template>
                </TieredMenu>
                
            </div>

            <!-- MENU FOOTER -->
            <div id="backoffice-menu-footer">

                <!-- USER -->
                <Inline space="5" class="user-footer" style="cursor: pointer;" @click="to('/profile')">
                    <Avatar :name="currentUser.name" src=""/>
                    <div class="user-info">
                        <div>{{ currentUser.name }}</div>
                        <div class="text-sm">{{ currentUser.email }}</div>
                    </div>
                </Inline>
                
            </div>

        </Stack>

        <!-- CONTENT -->
        <Stack id="backoffice-content" v-grow>

            <!-- CONTENT HEADER -->
            <Inline id="backoffice-content-header">

                <!-- Breadcrumbs -->
                <div v-grow>
                    <Breadcrumb :model="breadcrumbs">
                        <template #item="{ item }">
                            <Link v-if="item.label != ''" :href="item.url">{{ item.label }}</Link>
                        </template>
                        <template #separator>
                            /
                        </template>
                    </Breadcrumb>
                </div>

                <!-- TOP BAR RIGHT-->
                <div id="logout" class="flex-row gap-5" @click="logout()">
                    <span style="font-size: .8rem">{{ $t('generic.logout') }}</span>
                    <SvgIcon name="tabler/logout"/>
                </div>
            </Inline>

            <!-- PAGE CONTENT -->
            <div id="backoffice-page-content" class="scrollbar">
                <Loader v-if="loading" />
                <router-view v-else />
            </div>
        </Stack>
    </div>
</template>

<script lang="ts" src="./backoffice.ts"></script>
<style lang="scss" src="./backoffice.scss"></style>