import { http } from 'lib';

export default {

    isLoggedIn: () => new Promise((resolve, reject) => {
        const token = http.token.get();
        if (!token) return reject();
        resolve(true);
    }),

    login: (email: string, password: string) => new Promise((resolve, reject) => {
        http.post('/account/Login')
            .data({ email, password })
            .then((response: any) => {
                if (response.accessToken) {
                    http.token.save('Bearer ' + response.accessToken, response.refreshToken);
                }
                resolve(response);
            })
            .catch(reject);
    }),

    refreshToken: () => new Promise((resolve, reject) => {
        http.post('/account/RefreshToken')
            .data({ refreshToken: http.token.getRefreshToken() })
            .then((response: any) => {
                if (response.accessToken) {
                    http.token.save('Bearer ' + response.accessToken, response.refreshToken);
                }
                resolve(response);
            })
            .catch(reject);
    }),

    logout: () => new Promise<void>(resolve => {
        const refreshToken = http.token.getRefreshToken();
        http.post('/account/Logout')
            .data({ refreshToken })
            .promise()
            .finally(() => {
                http.token.remove();
                resolve();
            });
    }),

    getUserInfo: (): Promise<any> => http.post('/account/GetUserInfo').promise() as Promise<any>,

    editProfile: (data: { name?: string, surnames?: string, telephone?: string, language?: number }): Promise<any> => http.put('/account/EditProfile', data).promise() as Promise<any>,

    changePassword: (data: { currentPassword: string, newPassword: string }): Promise<any> => http.put('/account/ChangePassword', data).promise() as Promise<any>,

    recover: (email: string): Promise<any> => http.post('/account/Recover', { email }).promise() as Promise<any>,

    resetPassword: (token: string, newPassword: string): Promise<any> => http.post('/account/ResetPassword', { token, newPassword }).promise() as Promise<any>,

    verifyEmail: (token: string): Promise<any> => http.get(`/account/VerifyEmail/${token}`).promise() as Promise<any>,

}
