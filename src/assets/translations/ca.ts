import { Utils } from 'lib';
import { locale_ca } from './base/ca';

const ca = Utils.merge(locale_ca, {

    login: {
        notAdmin: "Aquest compte no té permisos d'administrador.",
    },

    profile: {
        title: "El meu perfil",
        save: "Desa",
        passwordHint: "Deixa-ho buit per mantenir la contrasenya actual.",
        notifications: {
            success: "Perfil actualitzat correctament",
            error: "Error en actualitzar el perfil",
        },
    },

    backoffice: {
        pagination: "Mostrant {first}-{last} de {totalRecords} resultats",
        logoutConfirm: "Segur que vols tancar la sessió?",
        sidebar: {
            users: {
                label: "Usuaris",
                items: {
                    list: "Usuaris",
                },
            },
            catalog: {
                label: "Catàleg",
                items: {
                    games: "Jocs",
                    platforms: "Plataformes",
                },
            },
        },
    },

    users: {
        index: {
            title: "Usuaris",
            create: "Nou usuari",
        },
        labels: {
            nickname: "Sobrenom",
            admin: "Administrador",
        },
        placeholders: {
            name: "Nom",
            nickname: "Sobrenom",
            email: "Correu electrònic",
            password: "Contrasenya",
        },
        form: {
            passwordHint: "Deixa-ho buit per mantenir la contrasenya actual.",
        },
        errors: {
            name: "El nom és obligatori",
            nickname: "El sobrenom és obligatori",
            password: "La contrasenya és obligatòria",
            emailInUse: "Aquest correu ja està registrat",
            nicknameInUse: "Aquest sobrenom ja està en ús",
        },
        create: {
            title: "Nou usuari",
            save: "Desa",
            notifications: {
                success: "Usuari creat correctament",
                error: "Error en crear l'usuari",
            },
        },
        update: {
            title: "Edita usuari",
            save: "Desa",
            notifications: {
                success: "Usuari actualitzat correctament",
                error: "Error en actualitzar l'usuari",
            },
        },
        modals: {
            delete: {
                title: "Elimina usuari",
                text: "Segur que vols eliminar aquest usuari? Aquesta acció és irreversible.",
                button: "Elimina",
                error: "Error en eliminar l'usuari",
            },
        },
    },

    game: {
        index: {
            title: "Jocs",
            create: "Nou joc",
        },
        labels: {
            name: "Nom",
            year: "Any",
            publisher: "Editor",
            developer: "Desenvolupador",
            hidden: "Ocult",
            icon: "Icona",
            logo: "Logotip",
        },
        placeholders: {
            name: "Nom del joc",
            year: "Any de llançament",
            publisher: "Editor",
            developer: "Desenvolupador",
        },
        errors: {
            name: "El nom és obligatori",
            hasLibraryEntries: "No es pot eliminar un joc que existeix a biblioteques de jugadors.",
        },
        create: {
            title: "Nou joc",
            save: "Desa",
            notifications: {
                success: "Joc creat correctament",
                error: "Error en crear el joc",
            },
        },
        update: {
            title: "Edita joc",
            save: "Desa",
            notifications: {
                success: "Joc actualitzat correctament",
                error: "Error en actualitzar el joc",
            },
        },
        modals: {
            delete: {
                title: "Elimina joc",
                text: "Segur que vols eliminar aquest joc?",
                button: "Elimina",
                error: "Error en eliminar el joc",
            },
        },
        translations: {
            title: "Traduccions del nom",
            name: "Nom",
            save: "Desa traduccions",
            notifications: {
                success: "Traduccions desades correctament",
                error: "Error en desar les traduccions",
            },
        },
        images: {
            title: "Imatges",
            notifications: {
                success: "Imatge desada correctament",
                error: "Error en processar la imatge",
            },
        },
        platforms: {
            title: "Plataformes",
            add: "Afegeix",
            empty: "Aquest joc encara no té cap plataforma associada.",
            selectPlatform: "Selecciona una plataforma",
            keyPlaceholder: "Clau (Steam appid, ID de PSN...)",
            errors: {
                keyTaken: "Aquesta clau ja està en ús per un altre joc.",
                add: "Error en afegir la plataforma",
                update: "Error en actualitzar la clau",
                remove: "Error en treure la plataforma",
                hasLibraryEntries: "No es pot treure una plataforma amb entrades a biblioteques de jugadors.",
            },
            notifications: {
                keySaved: "Clau desada correctament",
            },
            modals: {
                remove: {
                    title: "Treu plataforma",
                    text: "Segur que vols treure la plataforma \"{name}\" d'aquest joc?",
                    button: "Treu",
                },
            },
        },
    },

    platform: {
        index: {
            title: "Plataformes",
            create: "Nova plataforma",
        },
        labels: {
            name: "Nom",
        },
        placeholders: {
            name: "Nom de la plataforma",
        },
        errors: {
            name: "El nom és obligatori",
            exists: "Ja existeix una plataforma amb aquest nom.",
            inUse: "No es pot eliminar una plataforma amb jocs o comptes associats.",
        },
        create: {
            title: "Nova plataforma",
            save: "Desa",
            notifications: {
                success: "Plataforma creada correctament",
                error: "Error en crear la plataforma",
            },
        },
        update: {
            title: "Edita plataforma",
            save: "Desa",
            notifications: {
                success: "Plataforma actualitzada correctament",
                error: "Error en actualitzar la plataforma",
            },
        },
        modals: {
            delete: {
                title: "Elimina plataforma",
                text: "Segur que vols eliminar aquesta plataforma?",
                button: "Elimina",
                error: "Error en eliminar la plataforma",
            },
        },
    },

});

export default ca;
