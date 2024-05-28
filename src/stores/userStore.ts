import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { post } from '@/network/index';

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
    registerTime: '',
  });
  const editingProject = ref<Project>({
    id: 0,
    userId: 0,
    projectName: '',
    projectUrl: '',
    isDelete: 0,
    isPublic: 0,
    file: '',
    editTime: '',
    folderId: 0,
  });

  //只有当前项目保存于后端时才为true，出现在导入项目到canvas和保存canvas后
  const haveProject = ref(false);
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
    haveProject.value = true;
  };

  const updateEditingProject = (editTime: string, file: string) => {
    editingProject.value.editTime = editTime;
    editingProject.value.file = file;
  };
  const saveProject = (file: string) => {
    if (haveProject.value) {
      //存在项目，
      //获取时间，格式如1983-08-03 13:01:09
      const editTime = getFormattedDate();
      editingProject.value.editTime = editTime;
      editingProject.value.file = file;
      post(
        'project/modify',
        editingProject.value,
        () => {},
        (err) => {
          console.log(err);
        }
      );
    } else {
      //不存在项目，
      post(
        '/poject/create',
        {
          file: file,
          userId: user.value.id,
          projectName: editingProject.value.projectName,
          isPublic: editingProject.value.isPublic,
          projectUrl: editingProject.value.projectUrl,
          isDelete: editingProject.value.isDelete,
          folderId: editingProject.value.folderId,
          editTime: getFormattedDate(),
        },
        (res: { id: number }) => {
          editingProject.value.id = res.id;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
  const getFormattedDate = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，因此需要+1
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  const cleanEditingProject = () => {
    editingProject.value = {
      id: 0,
      userId: 0,
      projectName: '',
      projectUrl: '',
      isDelete: 0,
      isPublic: 0,
      file: '',
      editTime: '',
      folderId: 0,
    };
    haveProject.value = false;
  };

  return {
    user,
    getUser,
    setUser,
    updateUserEmail,
    setEditingProject,
    updateEditingProject,
    cleanEditingProject,
    saveProject,
  };
});
