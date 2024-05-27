import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 定义用户信息的类型
interface User {
    id: string;
    username: string;
    email: string;
    gender: string;
    avatarUrl: string;
    registerTime: string;
}

// 定义并导出 Store
export const useUserStore = defineStore('user', () => {
    const user = ref<User>({
        id: '',
        username: '',
        email: '',
        gender: '',
        avatarUrl: '',
        registerTime: ''
    });

    // Getters
    const getUser = computed(() => {
        return user.value;
    });

    // Setters / Actions
    const setUser = (newUser: User) => {
        user.value = newUser;
    };

    const updateUserEmail = (newEmail: string) => {
        user.value.email = newEmail;
    };

    return {
        user,
        getUser,
        setUser,
        updateUserEmail
    };
});
