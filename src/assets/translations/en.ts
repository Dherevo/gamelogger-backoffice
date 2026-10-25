import { Utils } from 'lib';
import { locale_en } from './base/en';

const en = Utils.merge(locale_en, {

    login: {
        notAdmin: "This account does not have administrator permissions.",
    },

    profile: {
        title: "My profile",
        save: "Save",
        passwordHint: "Leave blank to keep the current password.",
        notifications: {
            success: "Profile updated successfully",
            error: "Error updating profile",
        },
    },

    backoffice: {
        pagination: "Showing {first}-{last} of {totalRecords} results",
        logoutConfirm: "Are you sure you want to log out?",
        sidebar: {
            users: {
                label: "Users",
                items: {
                    list: "Users",
                },
            },
            catalog: {
                label: "Catalog",
                items: {
                    games: "Games",
                    platforms: "Platforms",
                },
            },
        },
    },

    users: {
        index: {
            title: "Users",
            create: "New user",
        },
        labels: {
            nickname: "Nickname",
            admin: "Administrator",
            steamId: "Steam ID",
            steamLinked: "Has Steam",
            locale: "Language",
            visibility: "Profile visibility",
            games: "Games",
            completed: "Completed",
            lastSync: "Last sync",
            createdAt: "Signed up",
        },
        placeholders: {
            name: "Name",
            nickname: "Nickname",
            email: "Email",
            password: "Password",
            steamId: "SteamID64 (17 digits, e.g. 76561198…)",
        },
        form: {
            passwordHint: "Leave empty to keep the current password.",
            steamHint: "Changing it imports the library of the new account. Leaving it empty unlinks it (games already imported stay).",
            openSteam: "Open the profile on Steam",
            localeNone: "No language",
            visibilityHint: "Public: everyone. Friends: only their friends. Private: nobody.",
        },
        errors: {
            name: "Name is required",
            nickname: "Nickname is required",
            password: "Password is required",
            emailInUse: "This email is already registered",
            nicknameInUse: "This nickname is already taken",
            steam_invalid_id: "The Steam ID must be 17 digits starting with 7656119",
            steam_already_linked: "This Steam account is already linked to another user",
            steam_not_found: "No Steam profile found for this ID",
            steam_error: "Could not verify the Steam account",
        },
        visibility: {
            public: "Public",
            friends: "Friends",
            private: "Private",
        },
        filters: {
            localeNone: "No language",
            hasGames: "Has games",
            createdFrom: "Signed up from",
            createdTo: "Signed up to",
            deactivated: "Deactivated",
        },
        create: {
            title: "New user",
            save: "Save",
            notifications: {
                success: "User created successfully",
                error: "Error creating the user",
            },
        },
        update: {
            title: "Edit user",
            save: "Save",
            notifications: {
                success: "User updated successfully",
                error: "Error updating the user",
            },
        },
        modals: {
            delete: {
                title: "Delete user",
                text: "Are you sure you want to delete this user? This action is irreversible.",
                button: "Delete",
                error: "Error deleting the user",
            },
        },
    },

    game: {
        index: {
            title: "Games",
            create: "New game",
        },
        labels: {
            name: "Name",
            year: "Year",
            publisher: "Publisher",
            developer: "Developer",
            hidden: "Hidden",
            icon: "Icon",
            logo: "Logo",
            achievements: "Achievements",
            story: "Story completed",
            platforms: "Platforms",
        },
        filters: {
            yearFrom: "Year from",
            yearTo: "Year to",
            manual: "Added by hand",
            platform: "Platform",
            missing: "Missing",
            missingOptions: {
                icon: "Icon",
                logo: "Logo",
                publisher: "Publisher",
                developer: "Developer",
                year: "Year",
                genres: "Genres",
            },
        },
        placeholders: {
            name: "Game name",
            year: "Release year",
            publisher: "Publisher",
            developer: "Developer",
        },
        errors: {
            name: "Name is required",
            hasLibraryEntries: "Cannot delete a game that exists in player libraries.",
        },
        create: {
            title: "New game",
            save: "Save",
            notifications: {
                success: "Game created successfully",
                error: "Error creating the game",
            },
        },
        update: {
            title: "Edit game",
            save: "Save",
            notifications: {
                success: "Game updated successfully",
                error: "Error updating the game",
            },
        },
        modals: {
            delete: {
                title: "Delete game",
                text: "Are you sure you want to delete this game?",
                button: "Delete",
                error: "Error deleting the game",
            },
        },
        translations: {
            title: "Name translations",
            name: "Name",
            save: "Save translations",
            notifications: {
                success: "Translations saved successfully",
                error: "Error saving the translations",
            },
        },
        images: {
            title: "Images",
            notifications: {
                success: "Image saved successfully",
                error: "Error processing the image",
            },
        },
        platforms: {
            title: "Platforms",
            add: "Add",
            empty: "This game has no platforms attached yet.",
            selectPlatform: "Select a platform",
            keyPlaceholder: "Key (Steam appid, PSN id...)",
            keyLocked: "The key can't be edited once attached. To correct it, remove the platform and add it again.",
            errors: {
                keyTaken: "This key is already in use by another game.",
                add: "Error adding the platform",
                update: "Error updating the key",
                remove: "Error removing the platform",
                hasLibraryEntries: "Cannot remove a platform that has player library entries.",
            },
            notifications: {
                keySaved: "Key saved successfully",
            },
            modals: {
                remove: {
                    title: "Remove platform",
                    text: "Are you sure you want to remove the platform \"{{name}}\" from this game?",
                    button: "Remove",
                },
            },
        },
        achievements: {
            title: "Achievements",
            empty: "This game has no synced achievements yet. Games nobody has played have none until they are synced: use \"Sync from Steam\".",
            sync: {
                button: "Sync from Steam",
                notifications: {
                    success: "Achievements synced: {{added}} new ({{total}} in total)",
                },
                errors: {
                    noSteam: "This game has no Steam entry to read achievements from.",
                    generic: "Could not sync the achievements from Steam",
                },
            },
            titlePlaceholder: "Achievement title",
            description: "Description",
            translations: "Translations",
            page: "{{page}} of {{total}} ({{count}} total)",
            story: {
                current: "Story-completed achievement",
                hint: "Pick the achievement that means \"story completed\": players who unlock it get the game marked as completed, even without the 100%.",
                mark: "Mark as story",
                isStory: "This is the story one",
                remove: "Remove",
                modals: {
                    mark: {
                        title: "Mark as the story-completed achievement",
                        text: "\"{{title}}\" will be marked as the achievement that completes this game's story (only one is allowed: a previous one will be unmarked). Players who already have it unlocked get the game as completed now; the rest when they sync.",
                        button: "Mark",
                    },
                },
                notifications: {
                    marked: "Achievement marked. Players marked as completed now: {{count}}",
                    unmarked: "Achievement unmarked. Games already completed stay completed.",
                    error: "Could not change the story achievement",
                },
            },
            notifications: {
                success: "Achievement saved successfully",
                error: "Error saving the achievement",
            },
        },
    },

    platform: {
        index: {
            title: "Platforms",
            create: "New platform",
        },
        labels: {
            name: "Name",
        },
        placeholders: {
            name: "Platform name",
        },
        errors: {
            name: "Name is required",
            exists: "A platform with this name already exists.",
            inUse: "Cannot delete a platform with games or linked accounts.",
        },
        create: {
            title: "New platform",
            save: "Save",
            notifications: {
                success: "Platform created successfully",
                error: "Error creating the platform",
            },
        },
        update: {
            title: "Edit platform",
            save: "Save",
            notifications: {
                success: "Platform updated successfully",
                error: "Error updating the platform",
            },
        },
        modals: {
            delete: {
                title: "Delete platform",
                text: "Are you sure you want to delete this platform?",
                button: "Delete",
                error: "Error deleting the platform",
            },
        },
    },

});

export default en;
