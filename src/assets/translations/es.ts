import { Utils } from 'lib';
import { locale_es } from './base/es';

const es = Utils.merge(locale_es, {

    login: {
        notAdmin: "Esta cuenta no tiene permisos de administrador.",
    },

    profile: {
        title: "Mi perfil",
        save: "Guardar",
        passwordHint: "Déjalo en blanco para mantener la contraseña actual.",
        notifications: {
            success: "Perfil actualizado correctamente",
            error: "Error al actualizar el perfil",
        },
    },

    backoffice: {
        pagination: "Mostrando {first}-{last} de {totalRecords} resultados",
        logoutConfirm: "¿Seguro que quieres cerrar la sesión?",
        sidebar: {
            users: {
                label: "Usuarios",
                items: {
                    list: "Usuarios",
                },
            },
            catalog: {
                label: "Catálogo",
                items: {
                    games: "Juegos",
                    platforms: "Plataformas",
                },
            },
        },
    },

    users: {
        index: {
            title: "Usuarios",
            create: "Nuevo usuario",
        },
        labels: {
            nickname: "Apodo",
            admin: "Administrador",
        },
        placeholders: {
            name: "Nombre",
            nickname: "Apodo",
            email: "Correo electrónico",
            password: "Contraseña",
        },
        form: {
            passwordHint: "Déjalo vacío para mantener la contraseña actual.",
        },
        errors: {
            name: "El nombre es obligatorio",
            nickname: "El apodo es obligatorio",
            password: "La contraseña es obligatoria",
            emailInUse: "Este correo ya está registrado",
            nicknameInUse: "Este apodo ya está en uso",
        },
        create: {
            title: "Nuevo usuario",
            save: "Guardar",
            notifications: {
                success: "Usuario creado correctamente",
                error: "Error al crear el usuario",
            },
        },
        update: {
            title: "Editar usuario",
            save: "Guardar",
            notifications: {
                success: "Usuario actualizado correctamente",
                error: "Error al actualizar el usuario",
            },
        },
        modals: {
            delete: {
                title: "Eliminar usuario",
                text: "¿Seguro que quieres eliminar este usuario? Esta acción es irreversible.",
                button: "Eliminar",
                error: "Error al eliminar el usuario",
            },
        },
    },

    game: {
        index: {
            title: "Juegos",
            create: "Nuevo juego",
        },
        labels: {
            name: "Nombre",
            year: "Año",
            publisher: "Editor",
            developer: "Desarrollador",
            hidden: "Oculto",
            icon: "Icono",
            logo: "Logotipo",
            achievements: "Logros",
            story: "Historia completada",
            platforms: "Plataformas",
        },
        filters: {
            yearFrom: "Año desde",
            yearTo: "Año hasta",
            manual: "Añadido a mano",
            platform: "Plataforma",
            missing: "Le falta",
            missingOptions: {
                icon: "Icono",
                logo: "Logotipo",
                publisher: "Editor",
                developer: "Desarrollador",
                year: "Año",
                genres: "Géneros",
            },
        },
        placeholders: {
            name: "Nombre del juego",
            year: "Año de lanzamiento",
            publisher: "Editor",
            developer: "Desarrollador",
        },
        errors: {
            name: "El nombre es obligatorio",
            hasLibraryEntries: "No se puede eliminar un juego que existe en bibliotecas de jugadores.",
        },
        create: {
            title: "Nuevo juego",
            save: "Guardar",
            notifications: {
                success: "Juego creado correctamente",
                error: "Error al crear el juego",
            },
        },
        update: {
            title: "Editar juego",
            save: "Guardar",
            notifications: {
                success: "Juego actualizado correctamente",
                error: "Error al actualizar el juego",
            },
        },
        modals: {
            delete: {
                title: "Eliminar juego",
                text: "¿Seguro que quieres eliminar este juego?",
                button: "Eliminar",
                error: "Error al eliminar el juego",
            },
        },
        translations: {
            title: "Traducciones del nombre",
            name: "Nombre",
            save: "Guardar traducciones",
            notifications: {
                success: "Traducciones guardadas correctamente",
                error: "Error al guardar las traducciones",
            },
        },
        images: {
            title: "Imágenes",
            notifications: {
                success: "Imagen guardada correctamente",
                error: "Error al procesar la imagen",
            },
        },
        platforms: {
            title: "Plataformas",
            add: "Añadir",
            empty: "Este juego todavía no tiene ninguna plataforma asociada.",
            selectPlatform: "Selecciona una plataforma",
            keyPlaceholder: "Clave (Steam appid, ID de PSN...)",
            keyLocked: "La clave no se puede editar una vez añadida. Para corregirla, quita la plataforma y vuelve a añadirla.",
            errors: {
                keyTaken: "Esta clave ya está en uso por otro juego.",
                add: "Error al añadir la plataforma",
                update: "Error al actualizar la clave",
                remove: "Error al quitar la plataforma",
                hasLibraryEntries: "No se puede quitar una plataforma con entradas en bibliotecas de jugadores.",
            },
            notifications: {
                keySaved: "Clave guardada correctamente",
            },
            modals: {
                remove: {
                    title: "Quitar plataforma",
                    text: "¿Seguro que quieres quitar la plataforma \"{{name}}\" de este juego?",
                    button: "Quitar",
                },
            },
        },
        achievements: {
            title: "Logros",
            empty: "Este juego todavía no tiene logros sincronizados.",
            titlePlaceholder: "Título del logro",
            description: "Descripción",
            translations: "Traducciones",
            page: "{{page}} de {{total}} ({{count}} en total)",
            story: {
                current: "Logro de historia completada",
                hint: "Marca el logro que significa «historia completada»: a quien lo desbloquee se le marcará el juego como completado, aunque no tenga el 100%.",
                mark: "Marcar como historia",
                isStory: "Es el de la historia",
                remove: "Quitar",
                modals: {
                    mark: {
                        title: "Marcar como logro de historia completada",
                        text: "Se marcará «{{title}}» como el logro que completa la historia de este juego (solo puede haber uno: si ya había otro, se desmarcará). Los jugadores que ya lo tengan desbloqueado tendrán el juego como completado ahora; el resto, cuando sincronicen.",
                        button: "Marcar",
                    },
                },
                notifications: {
                    marked: "Logro marcado. Jugadores marcados como completados ahora: {{count}}",
                    unmarked: "Logro desmarcado. Los juegos ya completados se mantienen.",
                    error: "No se ha podido cambiar el logro de historia",
                },
            },
            notifications: {
                success: "Logro guardado correctamente",
                error: "Error al guardar el logro",
            },
        },
    },

    platform: {
        index: {
            title: "Plataformas",
            create: "Nueva plataforma",
        },
        labels: {
            name: "Nombre",
        },
        placeholders: {
            name: "Nombre de la plataforma",
        },
        errors: {
            name: "El nombre es obligatorio",
            exists: "Ya existe una plataforma con este nombre.",
            inUse: "No se puede eliminar una plataforma con juegos o cuentas asociadas.",
        },
        create: {
            title: "Nueva plataforma",
            save: "Guardar",
            notifications: {
                success: "Plataforma creada correctamente",
                error: "Error al crear la plataforma",
            },
        },
        update: {
            title: "Editar plataforma",
            save: "Guardar",
            notifications: {
                success: "Plataforma actualizada correctamente",
                error: "Error al actualizar la plataforma",
            },
        },
        modals: {
            delete: {
                title: "Eliminar plataforma",
                text: "¿Seguro que quieres eliminar esta plataforma?",
                button: "Eliminar",
                error: "Error al eliminar la plataforma",
            },
        },
    },

});

export default es;
