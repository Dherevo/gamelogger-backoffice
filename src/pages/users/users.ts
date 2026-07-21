import { Table, AppTable, translate, Avatar, $t, FormInput, Popup, IOption, Time, EventListener } from "lib";
import { Component, Vue, toNative } from "vue-facing-decorator";
import User from "@/models/user";
import Tag from 'primevue/tag';

@Component({
    components: { AppTable, Tag, Avatar, FormInput, Popup }
})
class UsersPage extends Vue {

    test?: Time[];

    table: Table = Table.create();
    image: any = null;

    searchSuggestions(_q: string, resolve: (suggestions: IOption[]) => void) {
        resolve([
            { value: 'Sugerencia 1' },
            { value: 'Sugerencia 2' },
            { value: 'Sugerencia 3' },
            { value: 'Sugerencia 4' },
            { value: 'Sugerencia 5' },
            { value: 'Sugerencia 6' },
            { value: 'Sugerencia 7' },
            { value: 'Sugerencia 8' },
            { value: 'Sugerencia 9' },
            { value: 'Sugerencia 10' },
        ])
    }

    created() {
        this.addDEMOTranslations();
        this.configureTable();

        EventListener.trigger('breadcrumbs', [
            { label: this.$t('users.plural'), url: '/users' }
        ])
    }

    addDEMOTranslations() {
        ////////////// DEBUG
        // Esto se pondría en el archivo de traducciones,
        // lo pongo aquí sólo para DEMO
        translate.merge({
            department: {
                sales: "Ventas",
                humanresources: "RRHH",
                marketing: "Marketing",
                management: "Administración",
                it: "IT",
                finance: "Finanzas"
            },

            status: {
                active: "Activo",
                waiting: "Pendiente",
                disabled: "Desactivado"
            }
        })
        //////////////
    }

    configureTable() {
        this.table

        .setTitle(this.$t('users.plural'))

        // Get data from API
        .fetch(resolve => {

            const filters = {
                ...this.table.filters,
                page: this.table!.page,
                department: this.table!.filters.department == 'all' ? '' : this.table!.filters.department,
            }

            // API GET /users
            User.list(filters).then(resolve);
        })

        // Que las filas se puedan seleccionar
        .setBulkActions([
            {
                content: 'Edit',
                icon: 'heroicons-solid/pencil',
                onClick: () => {
                    alert('Edit');
                }
            },
            {
                content: 'Delete',
                icon: 'heroicons-solid/trash',
                onClick: () => {
                    alert('Delete');
                }
            }
        ])

        /**  O se puede simplificar lo anterior con esto:
        .selectableAndBulkActions([
            {
                content: 'Delete',
                icon: 'heroicons-solid/trash',
                onClick: () => {
                    alert('Delete');
                }
            }
        ])*/

        .setItemOptions(_item => [
            {
                label: 'Edit',
                icon: 'heroicons-solid/pencil',
                command: () => {
                    alert('Edit');
                }
            },
            {
                label: 'Delete',
                icon: 'heroicons-solid/trash',
                command: () => {
                    alert('Delete');
                }
            }
        ])

        .setFilters([
            {
                type: 'search',
                name: 'search',
                label: 'Buscar'
            },
            {
                type: 'select',
                name: 'department',
                label: 'Departamento',
                props: {
                    placeholder: 'Departamento',
                    options: [
                        { value: 'sales', content: 'Ventas' },
                        { value: 'humanresources', content: 'RRHH' },
                        { value: 'marketing', content: 'Marketing' },
                        { value: 'management', content: 'Administración' },
                        { value: 'it', content: 'IT' },
                        { value: 'finance', content: 'Finanzas' }
                    ]
                }
            }
        ])

        // Set table columns
        .setColumns([
            {
                header: 'Name',
                name: 'name',
                sortable: true,
            },
            {
                header: 'Departamento',
                name: 'department',
                value: (item: User) => $t("department." + item.department),
                edit: (_value: string, _item: any) => {
                    // Para salir del modo edición tan pronto seleccionamos una opción
                    this.table!.endEdit();
                },
                sortable: true
            },
            {
                header: 'Estado',
                name: 'status',
                edit: (_value: string, _item: any) => {
                    // Para salir del modo edición tan pronto seleccionamos una opción
                    this.table!.endEdit();
                },
            },
            {
                header: 'Registered at',
                name: 'date',
                value: (item: User) => item.date ? item.date.format('DD MMMM YYYY') : '-'
            }
        ]);
    }

}
export default toNative(UsersPage);