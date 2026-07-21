<template>
    <template v-if="item">

        <template v-if="!item.items">

            <Link v-if="!collapsed" class="p-tieredmenu-item-link" tabindex="-1" data-pc-section="itemlink"
                data-pd-ripple="true" style="overflow: hidden; position: relative;" :href="item.to"
                @click="item.onClick ? item.onClick() : false" :class="getClass()">
                <SvgIcon :name="item.icon" />
                <span class="p-tieredmenu-item-label" data-pc-section="itemlabel">
                    {{ item.label }}
                </span>
            </Link>

            <Tooltip v-else :text="item.label" position="right">
                <Link class="p-tieredmenu-item-link" tabindex="-1" data-pc-section="itemlink"
                data-pd-ripple="true" style="overflow: hidden; position: relative;" :href="item.to"
                @click="item.onClick ? item.onClick() : false" :class="getClass()">
                    <SvgIcon :name="item.icon" />
                </Link>
            </Tooltip>

        </template>

        <div v-else class="p-tieredmenu-section">
            <label class="p-tieredmenu-section-label" v-if="!collapsed">
                {{ item.label }}
            </label>

            <div class="p-tieredmenu-section-items">
                <MenuItem v-for="(i, k) in item.items" :key="k" :item="i" :collapsed="collapsed" />
            </div>
        </div>
    </template>
</template>

<style lang="scss">
/** Remove default Prime styles */
#backoffice-menu {

    .p-tieredmenu.p-component {
        border: none;
        min-width: 0;

        ul.p-tieredmenu-submenu {
            display: none !important;
        }

        .p-tieredmenu-item-active>.p-tieredmenu-item-content {
            background-color: transparent;
        }

        ul.p-tieredmenu-root-list {
            padding: 0;

            .p-tieredmenu-item:not(.p-disabled) > .p-tieredmenu-item-content {
                background-color: transparent !important;

                &:hover {
                    background-color: transparent;
                }
            }
        }
    }
}

/** CUSTOM MENU ITEM STYLES */
#backoffice-menu {

    .p-tieredmenu.p-component {

        ul.p-tieredmenu-root-list {

            .p-tieredmenu-item-content {

                .p-tieredmenu-section {
                    margin-bottom: 20px;

                    label {
                        display: block;
                        font-size: var(--text-sm);
                        margin-bottom: 10px;
                    }
                }

                a.p-tieredmenu-item-link {
                    border: none;
                    font-size: .9rem;
                    border-radius: var(--border-radius-sm);
                    color: inherit;

                    span {
                        color: inherit;
                    }

                    &:hover {
                        background: rgba(0,0,0,.05);
                    }

                    &.active {
                        background: var(--highlight);

                        span {
                            color: inherit;
                        }
                    }
                }
            }
        }
    }

}
</style>

<script lang="ts">
import { Component, Vue, Prop, toNative } from "vue-facing-decorator";
import type { IMenuItem } from "./menu-items";
import { Tooltip } from "lib";

@Component({
    name: 'MenuItem',
    components: { Tooltip }
})
class MenuItem extends Vue {
    @Prop
    item?: IMenuItem;

    @Prop
    collapsed: boolean = false;

    getClass() {
        const obj: any = {};
        if (!this.item) return obj;

        if (this.item.class) {
            obj[this.item.class] = true;
        }
        if (this.item.to) {
            obj['active'] = location.pathname == this.item.to;
        }

        return obj;
    }
}
export default toNative(MenuItem);
</script>