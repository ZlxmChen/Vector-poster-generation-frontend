import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 定义用户信息的类型
interface User {
    id: number;
    username: string;
    email: string;
    gender: string;
    avatarUrl: string;
    registerTime: string;
}
interface Project {
    editTime: string;
    file: string;
    folderId: number;
    id: number;
    isDelete: number;
    isPublic: number;
    projectName: string;
    projectUrl: string;
    userId: number;
}
// 定义并导出 Store
export const useUserStore = defineStore('user', () => {
    const user = ref<User>({
        id: 0,
        username: '',
        email: '',
        gender: '',
        avatarUrl: '',
        registerTime: ''
    });
    const editingProject = ref<Project>({
        "id": 0,
        "userId": 0,
        "projectName": "",
        "projectUrl": "",
        "isDelete": 0,
        "isPublic": 0,
        "file": "",
        "editTime": "",
        "folderId": 0
    })
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

    const setEditingProject = (newEditingProject: Project) => {
        editingProject.value = newEditingProject;
    }

    const updateEditingProject = (editTime: string, file: string) => {
        editingProject.value.editTime = editTime;
        editingProject.value.file = file;
    }

    return {
        user,
        getUser,
        setUser,
        updateUserEmail,
        setEditingProject,
        updateEditingProject
    };
});
