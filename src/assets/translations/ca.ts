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
            steamId: "Steam ID",
            steamLinked: "Té Steam",
            locale: "Idioma",
            visibility: "Visibilitat del perfil",
            games: "Jocs",
            completed: "Completats",
            lastSync: "Darrera sincronització",
            createdAt: "Alta",
        },
        placeholders: {
            name: "Nom",
            nickname: "Sobrenom",
            email: "Correu electrònic",
            password: "Contrasenya",
            steamId: "SteamID64 (17 xifres, p. ex. 76561198…)",
        },
        form: {
            passwordHint: "Deixa-ho buit per mantenir la contrasenya actual.",
            steamHint: "Si el canvies, s'importa la biblioteca del nou compte. Si ho deixes buit, es desvincula (els jocs ja importats es mantenen).",
            openSteam: "Obre el perfil a Steam",
            localeNone: "Sense idioma",
            visibilityHint: "Públic: tothom. Amics: només els seus amics. Privat: ningú.",
        },
        errors: {
            name: "El nom és obligatori",
            nickname: "El sobrenom és obligatori",
            password: "La contrasenya és obligatòria",
            emailInUse: "Aquest correu ja està registrat",
            nicknameInUse: "Aquest sobrenom ja està en ús",
            steam_invalid_id: "L'ID de Steam ha de tenir 17 xifres i començar per 7656119",
            steam_already_linked: "Aquest compte de Steam ja està vinculat a un altre usuari",
            steam_not_found: "No s'ha trobat cap perfil de Steam amb aquest ID",
            steam_error: "No s'ha pogut verificar el compte de Steam",
        },
        visibility: {
            public: "Públic",
            friends: "Amics",
            private: "Privat",
        },
        filters: {
            localeNone: "Sense idioma",
            hasGames: "Té jocs",
            createdFrom: "Alta des de",
            createdTo: "Alta fins a",
            deactivated: "Desactivat",
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
            achievements: "Assoliments",
            story: "Història completada",
            platforms: "Plataformes",
            genres: "Gèneres",
        },
        filters: {
            yearFrom: "Any des de",
            yearTo: "Any fins a",
            manual: "Afegit a mà",
            platform: "Plataforma",
            missing: "Li falta",
            missingOptions: {
                icon: "Icona",
                logo: "Logotip",
                publisher: "Editor",
                developer: "Desenvolupador",
                year: "Any",
                genres: "Gèneres",
            },
        },
        placeholders: {
            name: "Nom del joc",
            year: "Any de llançament",
            publisher: "Editor",
            developer: "Desenvolupador",
            genres: "Afegeix gèneres",
        },
        suggest: {
            create: "Crea «{name}»",
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
        languages: {
            title: "Idiomes",
            save: "Desa idiomes",
            empty: "Aquest joc encara no té idiomes",
            text: "Text",
            audio: "Veus",
            mod: "Mod",
            modUrl: "Enllaç del mod",
            select: "Tria un idioma",
            add: "Afegeix",
            notifications: {
                success: "Idiomes desats correctament",
                error: "Error en desar els idiomes",
            },
            errors: {
                url: "L'enllaç del mod ha de ser una URL http(s)",
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
            keyLocked: "La clau no es pot editar un cop afegida. Per corregir-la, treu la plataforma i torna-la a afegir.",
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
                    text: "Segur que vols treure la plataforma \"{{name}}\" d'aquest joc?",
                    button: "Treu",
                },
            },
        },
        achievements: {
            title: "Assoliments",
            empty: "Aquest joc encara no té assoliments sincronitzats. Els jocs que ningú ha jugat no els tenen fins que es sincronitzen: usa «Sincronitza amb Steam».",
            sync: {
                button: "Sincronitza amb Steam",
                notifications: {
                    success: "Assoliments sincronitzats: {{added}} de nous ({{total}} en total)",
                },
                errors: {
                    noSteam: "Aquest joc no té cap entrada de Steam de la qual llegir assoliments.",
                    generic: "No s'han pogut sincronitzar els assoliments amb Steam",
                },
            },
            titlePlaceholder: "Títol de l'assoliment",
            description: "Descripció",
            translations: "Traduccions",
            page: "{{page}} de {{total}} ({{count}} en total)",
            story: {
                current: "Assoliment de història completada",
                hint: "Marca l'assoliment que significa «història completada»: qui el desbloquegi tindrà el joc com a completat, encara que no tingui el 100%.",
                mark: "Marcar com a història",
                isStory: "És el de la història",
                remove: "Treure",
                modals: {
                    mark: {
                        title: "Marcar com a assoliment de història completada",
                        text: "Es marcarà «{{title}}» com l'assoliment que completa la història d'aquest joc (només n'hi pot haver un: si ja n'hi havia un altre, es desmarcarà). Els jugadors que ja el tinguin desbloquejat tindran el joc com a completat ara; la resta, quan sincronitzin.",
                        button: "Marcar",
                    },
                },
                notifications: {
                    marked: "Assoliment marcat. Jugadors marcats com a completats ara: {{count}}",
                    unmarked: "Assoliment desmarcat. Els jocs ja completats es mantenen.",
                    error: "No s'ha pogut canviar l'assoliment de història",
                },
            },
            notifications: {
                success: "Assoliment desat correctament",
                error: "Error en desar l'assoliment",
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
