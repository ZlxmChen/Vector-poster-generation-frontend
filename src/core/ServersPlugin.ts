/*
 
 * @Date: 2023-06-20 12:52:09

 * @LastEditTime: 2024-02-06 18:46:28
 * @Description: 内部插件
 */
import { v4 as uuid } from 'uuid';
import { selectFiles, clipboardText } from '@/utils/utils';
// import { clipboardText } from '@/utils/utils.ts';
import { fabric } from 'fabric';
import Editor from '../core';

import { postFormData, post } from '@/network/index';
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();
type IEditor = Editor;
import { Message } from 'view-ui-plus';
// import { v4 as uuid } from 'uuid';

function downFile(fileStr: string, fileType: string) {
  const anchorEl = document.createElement('a');
  anchorEl.href = fileStr;
  anchorEl.download = `${uuid()}.${fileType}`;
  document.body.appendChild(anchorEl); // required for firefox
  anchorEl.click();
  anchorEl.remove();
}

function transformText(objects: any) {
  if (!objects) return;
  objects.forEach((item: any) => {
    if (item.objects) {
      transformText(item.objects);
    } else {
      item.type === 'text' && (item.type = 'textbox');
    }
  });
}

class ServersPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'ServersPlugin';
  static apis = [
    'insert',
    'insertSvgFile',
    'getJson',
    'dragAddItem',
    'clipboard',
    'saveJson',
    'getCanvasData',
    'saveSvg',
    'saveImg',
    'saveProject',
    'saveTemplate',
    'clear',
    'preview',
  ];
  // public hotkeys: string[] = ['left', 'right', 'down', 'up'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  insert() {
    selectFiles({ accept: '.json' }).then((files) => {
      const [file] = files;
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        this.insertSvgFile(reader.result);
      };
    });
  }

  insertSvgFile(jsonFile: string) {
    // 加载前钩子
    this.editor.hooksEntity.hookImportBefore.callAsync(jsonFile, () => {
      this.canvas.loadFromJSON(jsonFile, () => {
        this.canvas.renderAll();
        // 加载后钩子
        this.editor.hooksEntity.hookImportAfter.callAsync(jsonFile, () => {
          this.canvas.renderAll();
          // this.editor.getPlugin('HistoryPlugin').history.clear();
        });
      });
    });
  }

  getJson() {
    return this.canvas.toJSON(['id', 'gradientAngle', 'selectable', 'hasControls']);
  }

  /**
   * @description: 拖拽添加到画布
   * @param {Event} event
   * @param {Object} item
   */
  dragAddItem(event: DragEvent, item: fabric.Object) {
    const { left, top } = this.canvas.getSelectionElement().getBoundingClientRect();
    if (event.x < left || event.y < top || item.width === undefined) return;

    const point = {
      x: event.x - left,
      y: event.y - top,
    };
    const pointerVpt = this.canvas.restorePointerVpt(point);
    item.left = pointerVpt.x - item.width / 2;
    item.top = pointerVpt.y;
    this.canvas.add(item);
    this.canvas.requestRenderAll();
  }

  clipboard() {
    const jsonStr = this.getJson();
    clipboardText(JSON.stringify(jsonStr, null, '\t'));
  }

  async saveJson() {
    const dataUrl = this.getJson();
    // 把文本text转为textgroup，让导入可以编辑
    await transformText(dataUrl.objects);
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, '\t')
    )}`;
    downFile(fileStr, 'json');
  }
  async getJsonStringsify(): Promise<string> {
    const jsonStr = this.getJson();
    console.log(JSON.stringify(jsonStr, null, '\t'));
    return JSON.stringify(jsonStr, null, '\t');
  }

  async getCanvasData() {
    const dataUrl = this.getJson();
    // 把文本text转为textgroup，让导入可以编辑
    await transformText(dataUrl.objects);
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, '\t')
    )}`;
    return fileStr;
  }

  saveSvg() {
    this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
      const option = this._getSaveSvgOption();
      const dataUrl = this.canvas.toSVG(option);
      const fileStr = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataUrl)}`;
      this.editor.hooksEntity.hookSaveAfter.callAsync(fileStr, () => {
        downFile(fileStr, 'svg');
      });
    });
  }

  saveImg() {
    this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
      const option = this._getSaveOption();
      this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = this.canvas.toDataURL(option);
      this.editor.hooksEntity.hookSaveAfter.callAsync(dataUrl, () => {
        downFile(dataUrl, 'png');
      });
    });
  }
  base64ToFile(base64: string, fileName: string, type: string): File {
    let arr = base64.split(',');
    let mime = arr[0].match(/:(.*?);/)![1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: type });
  }

  base64ToBlob(base64: string, contentType: string) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }
  //return img
  async getImgFile(): Promise<File> {
    return new Promise((resolve, reject) => {
      this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
        const option = this._getSaveOption();
        this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        const dataUrl = this.canvas.toDataURL(option);
        this.editor.hooksEntity.hookSaveAfter.callAsync(dataUrl, () => {
          try {
            const file = this.base64ToFile(dataUrl, 'img', 'png');
            resolve(file);
          } catch (error) {
            reject(error);
          }
        });
      });
    });
  }
  async saveTemplate() {
    //只有保存为项目后才能存为template
    if (userStore.haveProject) {
      userStore.saveTemplate();
    } else {
      Message.info('请先保存项目在保存为模板');
    }
  }

  async compressImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Canvas context is null'));
            return;
          }

          // Calculate the new dimensions while maintaining the aspect ratio
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            if (width > height) {
              width = maxWidth;
              height = maxWidth / aspectRatio;
            } else {
              height = maxHeight;
              width = maxHeight * aspectRatio;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, { type: 'image/png' });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          }, 'image/png');
        };

        img.onerror = (error) => {
          reject(error);
        };
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  async saveProject() {
    console.log('保存项目');
    try {
      // 判断是否是新项目
      console.log('haveProject', userStore.haveProject);
      if (userStore.haveProject) {
        // 老项目
        //更新照片
        const formData = new FormData();
        formData.append('img', await this.compressImage(await this.getImgFile(), 800, 800));
        formData.append('id', userStore.user.id.toString());

        postFormData('/project/img', formData, async (res2: any) => {
          //设置editingOroject
          console.log(res2.imgUr);
          userStore.setHaveProject(true);
          //更新照片链接
          userStore.setProjectUrl(res2.imgUr);
          //更新project编辑时间
          userStore.updateDate();
          //更新项目内容
          userStore.setFile(await this.getJsonStringsify());
          userStore.uploadProject();
        });
      } else {
        console.log('新项目');
        post(
          '/project/create',
          {
            name: userStore.editingProject.projectName,
            isPublic: userStore.editingProject.isPublic,
          },
          async (res: any) => {
            //更新照片
            const formData = new FormData();
            formData.append('img', await this.compressImage(await this.getImgFile(), 800, 800));
            formData.append('id', res.id);
            postFormData('/project/img', formData, async (res2: any) => {
              console.log('res2', res2);
              //设置项目信息
              userStore.setEditingProject({
                id: res.id,
                userId: userStore.user.id,
                projectName: userStore.editingProject.projectName,
                projectUrl: res2.imgUrl,
                isDelete: 0,
                isPublic: 0,
                file: await this.getJsonStringsify(),
                editTime: userStore.getFormattedDate(),
                folderId: 0,
              });
              //上传项目
              userStore.uploadProject();
            });
          }
        );
      }
      // 新项目的逻辑可以在这里添加
    } catch (error) {
      console.error('保存项目时出错:', error);
    }
  }

  preview() {
    return new Promise((resolve, reject) => {
      this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
        const option = this._getSaveOption();
        this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        this.canvas.renderAll();
        const dataUrl = this.canvas.toDataURL(option);
        this.editor.hooksEntity.hookSaveAfter.callAsync(dataUrl, () => {
          resolve(dataUrl);
        });
      });
    });
  }

  _getSaveSvgOption() {
    const workspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
    const { left, top, width, height } = workspace as fabric.Object;
    return {
      width,
      height,
      viewBox: {
        x: left,
        y: top,
        width,
        height,
      },
    };
  }

  _getSaveOption() {
    const workspace = this.canvas
      .getObjects()
      .find((item: fabric.Object) => item.id === 'workspace');
    const { left, top, width, height } = workspace as fabric.Object;
    const option = {
      name: 'New Image',
      format: 'png',
      quality: 1,
      width,
      height,
      left,
      top,
    };
    return option;
  }

  clear() {
    this.canvas.getObjects().forEach((obj) => {
      if (obj.id !== 'workspace') {
        this.canvas.remove(obj);
      }
    });
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default ServersPlugin;
