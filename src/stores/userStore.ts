import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { post } from '@/network/index';
import { Message } from 'view-ui-plus';
// 定义用户信息的类型
interface User {
  id: string;
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
  id: string;
  isDelete: number;
  isPublic: number;
  projectName: string;
  projectUrl: string;
  userId: number;
}
// 定义并导出 Store
export const useUserStore = defineStore('user', () => {
  const user = ref<User>({
    id: '0',
    username: '',
    email: '',
    gender: '',
    avatarUrl: '',
    registerTime: '',
  });
  const editingProject = ref<Project>({
    id: '0',
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
  const setProjectUrl = (newProjectUrl: string) => {
    editingProject.value.projectUrl = newProjectUrl;
  };
  const setFile = (newFile: string) => {
    editingProject.value.file = newFile;
  };
  const setHaveProject = (have: boolean) => {
    haveProject.value = have;
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
  const updateDate = () => {
    editingProject.value.editTime = getFormattedDate();
  };
  const uploadProject = () => {
    console.log(editingProject.value);
    Message.info('保存中，请稍后');
    post(
      '/project/modify',
      {
        id: editingProject.value.id,
        userId: editingProject.value.userId,
        projectName: editingProject.value.projectName,
        projectUrl: editingProject.value.projectUrl,
        isDelete: editingProject.value.isDelete,
        isPublic: editingProject.value.isPublic,
        fileUrl: editingProject.value.file,
        folderId: editingProject.value.folderId,
      },

      (res: any) => {
        Message.success('项目保存成功');
        console.log(res);
      },
      (err) => {
        Message.error('项目保存失败，请重试');
        console.log(err);
      }
    );
  };
  const saveTemplate = () => {
    Message.info('模板创建中，请稍后');
    post(
      '/template/create',
      {
        id: editingProject.value.id,
      },
      (res: any) => {
        Message.success('模板创建成功');
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const setEditingProjectName = (newName: string) => {
    editingProject.value.projectName = newName;
  };
  return {
    user,
    getUser,
    setUser,
    editingProject,
    haveProject,
    updateUserEmail,
    setEditingProject,
    updateEditingProject,
    cleanEditingProject,
    setFile,
    setHaveProject,
    setProjectUrl,
    getFormattedDate,
    updateDate,
    uploadProject,
    saveTemplate,
    setEditingProjectName,
  };
});
