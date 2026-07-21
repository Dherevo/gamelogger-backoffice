import auth from "@/modules/auth";
import { http, Config, HttpError } from "lib";

export default () => {

    http.baseURL = Config.get('api.url');

    ///// FLUJO PARA REFRESCAR EL TOKEN
    // Cada vez que una request falla, primero ejecuta esto para detectar si el problema
    // es que el token ha caducado: (resolve true/false)
    http.token.CheckIfExpired = (err: HttpError) => new Promise(resolve => {
        const token = http.token.get();
        resolve(!!token && err.status == 401);
    });

    // Si la función anterior devuelve true (ha caducado el token)
    // entonces ejecuta esta para refrescar el token.
    // Si ésta devuelve true, volverá a repetir la request original que falló
    // con 401 para intentar con el nuevo token.
    http.token.Refresh = () => new Promise((resolve, reject) => {
        auth.refreshToken()
        .then(() => resolve(true))
        .catch(() => {
            http.token.remove();
            location.href = '/login';
            reject();
        });
    });
    //////////////
}