import { App, AppTable, FormInput, PaginatorStructure, Store, Table, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Patient from '@/models/patient';
import Message from 'primevue/message';
import auth from '@/modules/auth';

@Component({
    components: { AppTable, FormInput, Message }
})
class PatientsIndexPage extends Vue {

    table: Table = Table.create();
    message: string = Store.getSync('message');
    userRole: number = -1;

    created() {
        Store.clear('message');
        const cached = Store.getSync('currentUser');
        if (cached) {
            this.userRole = cached.role;
            this.configureTable();
        } else {
            auth.getUserInfo().then((user: any) => {
                this.userRole = user.role ?? -1;
                Store.set('currentUser', { role: this.userRole, name: user.name || '', email: user.email || '' });
                this.configureTable();
            });
        }
    }

    configureTable() {
        this.table
            .gridlines()
            .fetch(resolve => {
                Patient.list({
                    search: this.table.filters.search,
                    page: this.table.page,
                    pageSize: this.table.pageSize,
                }).then(response => {
                    this.table.pagination({
                        pageSize: response.perPage,
                        totalResults: response.totalItems,
                    });
                    resolve(response.items);
                });
            })
            .setColumns([
                {
                    header: $t('generic.fullname'),
                    name: 'fullName',
                    sortable: true,
                },
                {
                    header: $t('generic.email'),
                    name: 'email',
                    sortable: true,
                },
                {
                    header: $t('patients.labels.distributionCenter'),
                    name: 'distributionCenterName',
                    value: (item: Patient) => item.distributionCenterName || '—',
                },
                {
                    header: $t('patients.labels.registered'),
                    name: 'registered',
                    value: (item: Patient) => item.registered ? item.registered.format('DD/MM/YYYY') : '',
                },
                {
                    header: $t('patients.labels.patientCode'),
                    name: 'patientCode',
                },
                {
                    header: $t('patients.labels.status'),
                    name: 'status',
                },
                {
                    header: $t('patients.labels.verified'),
                    name: 'verified',
                },
            ])
            .setItemOptions((item: Patient) => [
                {
                    label: $t('generic.edit'),
                    icon: 'prime/pencil',
                    command: () => {
                        Store.set('patient', item);
                        this.to(`/patients/update/${item.id}`);
                    },
                },
                {
                    label: $t('patients.actions.deactivate'),
                    icon: 'prime/ban',
                    command: () => {
                        this.deletePatient(item);
                    },
                },
            ], 'alwaysIcons')
            .paginator(
                PaginatorStructure.create()
                    .Text($t('backoffice.pagination', { first: '{first}', last: '{last}', totalRecords: '{totalRecords}' }))
                    .FirstPage()
                    .PrevPage()
                    .Numbers()
                    .NextPage()
                    .LastPage()
                    .PerPageSelector(),
                25
            );
    }

    toggleStatus(patient: Patient) {
        const action = patient.status ? 'disable' : 'enable';
        const method = patient.status ? patient.disable() : patient.enable();

        method
            .then(() => {
                patient.status = !patient.status;
                App.notification($t(`patients.notifications.${action}.success`))
                    .setType('success')
                    .setTime(3000)
                    .show();
            })
            .catch(() => {
                App.notification($t(`patients.notifications.${action}.error`))
                    .setType('error')
                    .setTime(5000)
                    .show();
            });
    }

    verify(patient: Patient) {
        App.confirm(`<div class="flex-row gap10">
            <i class="pi pi-exclamation-triangle"></i>
            <div>${$t('patients.modals.verify.text')}</div>
        </div>`, {
            title: $t('patients.modals.verify.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark' },
            confirmButton: { content: $t('patients.modals.verify.button'), class: 'primary' },
        }).then((ok: boolean) => {
            if (ok) {
                patient.verified = true;
            }
        });
    }

    deletePatient(patient: Patient) {
        App.confirm(`<div class="flex-row gap10">
            <i class="pi pi-exclamation-triangle"></i>
            <div>${$t('patients.modals.delete.text')}</div>
        </div>`, {
            title: $t('patients.modals.delete.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark' },
            confirmButton: { content: $t('patients.modals.delete.button'), class: 'danger', icon: 'prime/trash' },
        }).then((ok: boolean) => {
            if (ok) {
                patient.delete().then(() => {
                    this.table.refresh();
                });
            }
        });
    }

}
export default toNative(PatientsIndexPage);
