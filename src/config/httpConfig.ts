import { http, Config, HttpError, translate } from "lib";

export default () => {

    http.baseURL = Config.get('api.url');

    // Send the current UI language so the API can localize error messages / content.
    http.setGlobalHeaders(() => Promise.resolve({
        'Accept-Language': translate.currentLanguage
    }));

    // Detect whether a failed request is due to an expired access token.
    http.token.CheckIfExpired = (err: HttpError) => new Promise(resolve => {
        const token = http.token.get();
        resolve(!!token && err.status == 401);
    });

    // Refresh the access token. If it succeeds the original request is retried.
    http.token.Refresh = () => new Promise((resolve, reject) => {

        const refreshToken = http.token.getRefreshToken();
        if (!refreshToken) {
            return reject();
        }

        http.post('/auth/refresh')
            .data({ refreshToken })
            .promise()
            .then((response: any) => {
                http.token.save(response.access, response.refresh);
                resolve(true);
            })
            .catch(() => {
                http.token.remove();
                location.href = '/login';
                reject();
            });
    });
};
