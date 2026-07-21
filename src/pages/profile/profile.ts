import { Component, Vue, toNative } from 'vue-facing-decorator';
import { App, FormInput, IOption, Validator, $t } from 'lib';
import auth from '@/modules/auth';
import Patient from '@/models/patient';

@Component({
    components: { FormInput }
})
class ProfilePage extends Vue {

    profileData: { name: string, surnames: string, telephone: string, language: number } = {
        name: '', surnames: '', telephone: '', language: 0,
    };
    passwordData: { currentPassword: string, newPassword: string, confirmNewPassword: string } = {
        currentPassword: '', newPassword: '', confirmNewPassword: '',
    };
    profileValidator: Validator = new Validator();
    passwordValidator: Validator = new Validator();
    savingProfile: boolean = false;
    savingPassword: boolean = false;
    loading: boolean = true;

    languageOptions: IOption[] = Patient.languageOptions;

    created() {
        auth.getUserInfo().then((user: any) => {
            this.profileData = {
                name: user.name || '',
                surnames: user.surnames || '',
                telephone: user.telephone || '',
                language: user.language ?? 0,
            };
        }).finally(() => { this.loading = false; });
    }

    get confirmPasswordValidator() {
        return this.passwordValidator.add('confirmNewPassword', () => this.passwordData.confirmNewPassword)
            .rule(() => this.passwordData.newPassword === this.passwordData.confirmNewPassword, 'passwordMismatch')
            .causesError($t('profile.errors.passwordMismatch'));
    }

    saveProfile() {
        if (this.savingProfile) return;
        if (this.profileValidator.validate(this.profileData)) {
            this.savingProfile = true;
            auth.editProfile(this.profileData)
                .then(() => {
                    App.notification($t('profile.notifications.profileSuccess')).setType('success').setTime(5000).show();
                })
                .catch(() => {
                    App.notification($t('profile.notifications.profileError')).setType('error').setTime(5000).show();
                })
                .finally(() => { this.savingProfile = false; });
        }
    }

    changePassword() {
        if (this.savingPassword) return;
        if (this.passwordValidator.validate(this.passwordData)) {
            this.savingPassword = true;
            auth.changePassword({
                currentPassword: this.passwordData.currentPassword,
                newPassword: this.passwordData.newPassword,
            })
                .then(() => {
                    App.notification($t('profile.notifications.passwordSuccess')).setType('success').setTime(5000).show();
                    this.passwordData = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
                })
                .catch(() => {
                    App.notification($t('profile.notifications.passwordError')).setType('error').setTime(5000).show();
                })
                .finally(() => { this.savingPassword = false; });
        }
    }

}
export default toNative(ProfilePage);
