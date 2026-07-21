import { reactive } from "vue";

export interface UserData {
    id: number;
    name: string;
    email: string;
    nickname: string;
    isAdmin: boolean;
    avatar?: string | null;
    platforms: { id: number; name: string; key: string }[];
}

const userStore = reactive<{ data: UserData | null }>({
    data: null
});

export default userStore;
