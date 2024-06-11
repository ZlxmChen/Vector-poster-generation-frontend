<template>
  <div v-if="controller.mode == '1'">
    <Card style="width: 250px; margin-top: 20px" @click="choseMode('2')">
      <Row>
        <Col span="8">
          <Avatar
            shape="square"
            src="https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/Image/WX20240305-115841%402x.png"
            size="50"
          />
        </Col>
        <Col span="16">
          <p style="font-weight: bold; font-size: medium; margin-top: 3px">AI矢量素材</p>
          <p>获取素材更轻松</p>
        </Col>
      </Row>
    </Card>
    <Card style="width: 250px; margin-top: 20px" @click="choseMode('3')">
      <Row>
        <Col span="8">
          <Avatar
            shape="square"
            src="https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/asto-poster.jpg"
            size="50"
          />
        </Col>
        <Col span="16">
          <p style="font-weight: bold; font-size: medium; margin-top: 3px">AI矢量海报</p>
          <p>让你的创意具体可见</p>
        </Col>
      </Row>
    </Card>
    <Card style="width: 250px; margin-top: 20px" @click="choseMode('4')">
      <Row>
        <Col span="8">
          <Avatar
            shape="square"
            src="https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/frog.png"
            size="50"
          />
        </Col>
        <Col span="16">
          <p style="font-weight: bold; font-size: medium; margin-top: 3px">AI艺术字生成</p>
          <p>创意设计不发愁</p>
        </Col>
      </Row>
    </Card>
  </div>

  <!-- 矢量素材生成 -->
  <div v-if="controller.mode == '2'">
    <!-- 标题区域 -->
    <div>
      <Button type="text" style="margin-top: 10px" @click="choseMode('1')">
        <Icon type="ios-arrow-back"></Icon>
        返回
      </Button>
      <p style="font-size: 20px; font-weight: bold; margin: 15px">AI素材生成</p>
    </div>

    <!-- 图像生成区域 -->
    <Card v-if="state.genState" style="margin: 10px; display: flex; justify-content: center">
      <Circle v-if="!genView.display" :percent="genView.percent" :stroke-color="genView.color">
        <Icon
          v-if="genView.percent == 100"
          type="ios-checkmark"
          size="60"
          style="color: #5cb85c"
        ></Icon>
        <span v-else style="font-size: 24px">{{ genView.percent }}%</span>
      </Circle>
      <div v-else>
        <img
          :src="genView.output"
          style="max-width: 100%; height: auto; cursor: pointer"
          @click="addItem"
          @dragend="dragItem"
        />
        <!-- 功能 -->
        <div style="display: flex; justify-content: space-between">
          <n-button type="primary" size="small" tertiary @click="addElement">立即添加</n-button>
          <n-button type="info" size="small" tertiary @click="saveElement">保存元素</n-button>
          <n-button type="error" size="small" tertiary @click="generatePoster">重新生成</n-button>
        </div>
      </div>
    </Card>

    <!-- 文本输入区域 -->
    <Card style="margin: 10px">
      <div style="display: flex; font-size: 15px; font-weight: 500; margin-bottom: 10px">
        <p style="color: red">*</p>
        <p style="">画面描述</p>
      </div>

      <Input
        v-model="state.prompt"
        type="textarea"
        maxlength="250"
        show-word-limit
        @on-change="disTemplate"
        :rows="4"
        placeholder="输入文本内容，引导图片生成方向，支持中英文"
      />
      <Space wrap style="margin-top: 10px">
        <p style="color: grey">示范：</p>
        <Button
          size="small"
          :key="`${i}-template`"
          v-for="(template, i) in state.materialist[0].list"
          @click="useTemplate(template)"
        >
          {{ template.label }}
        </Button>
      </Space>
    </Card>

    <!-- 风格选择区域 -->
    <Card style="margin: 10px">
      <div style="display: flex; font-size: 15px; font-weight: 500; margin-bottom: 10px">
        <p style="color: red">*</p>
        <p style="">风格</p>
      </div>

      <RadioGroup v-model="state.style">
        <div style="display: flex; flex-wrap: wrap">
          <div
            v-for="(info, i) in styleList"
            :key="`${i}-button`"
            style="flex: 1 0 0; display: flex; flex-direction: column; margin-bottom: 5px"
          >
            <img
              :alt="info.text"
              @click="choseStyle(info.label)"
              v-lazy="info.src"
              style="height: 50px; width: 50px"
            />
            <Radio :label="info.label">{{ info.text }}</Radio>
          </div>
        </div>
      </RadioGroup>
    </Card>

    <!-- 立即生成区域 -->
    <Divider />
    <div style="display: flex; justify-content: center">
      <Button type="primary" shape="circle" size="large" @click="generatePoster">
        <p style="font-weight: bold">立即生成</p>
      </Button>
    </div>
  </div>

  <!-- 矢量海报生成 -->
  <div v-if="controller.mode == '3'">
    <!-- 标题区域 -->
    <div>
      <Button type="text" style="margin-top: 10px" @click="choseMode('1')">
        <Icon type="ios-arrow-back"></Icon>
        返回
      </Button>
      <p style="font-size: 20px; font-weight: bold; margin: 15px">AI海报生成</p>
    </div>

    <!-- 图像生成区域 -->
    <Card v-if="state.genState" style="margin: 10px; display: flex; justify-content: center">
      <Circle v-if="!genView.display" :percent="genView.percent" :stroke-color="genView.color">
        <Icon
          v-if="genView.percent == 100"
          type="ios-checkmark"
          size="60"
          style="color: #5cb85c"
        ></Icon>
        <span v-else style="font-size: 24px">{{ genView.percent }}%</span>
      </Circle>
      <div v-else>
        <img
          :src="genView.output"
          style="max-width: 100%; height: auto; cursor: pointer"
          @click="addItem"
          @dragend="dragItem"
        />
        <div style="display: flex; justify-content: center">
          <img
            :src="genView.fg"
            style="max-width: 40%; height: auto; cursor: pointer; margin-right: auto"
            @click="addItem"
            @dragend="dragItem"
          />
          <img
            :src="genView.bg"
            style="max-width: 40%; height: auto; cursor: pointer"
            @click="addItem"
            @dragend="dragItem"
          />
        </div>
      </div>
    </Card>

    <!-- 文本输入区域 -->
    <Card style="margin: 10px">
      <div style="display: flex; font-size: 15px; font-weight: 500; margin-bottom: 10px">
        <p style="color: red">*</p>
        <p style="">画面描述</p>
      </div>

      <Input
        v-model="state.prompt"
        type="textarea"
        maxlength="250"
        show-word-limit
        @on-change="disTemplate"
        :rows="4"
        placeholder="输入文本内容，引导图片生成方向，支持中英文"
      />
      <Space wrap style="margin-top: 10px">
        <p style="color: grey">示范：</p>
        <Button
          size="small"
          :key="`${i}-template`"
          v-for="(template, i) in state.materialist[1].list"
          @click="useTemplate(template)"
        >
          {{ template.label }}
        </Button>
      </Space>
    </Card>

    <!-- 风格选择区域 -->
    <Card style="margin: 10px">
      <div style="display: flex; font-size: 15px; font-weight: 500; margin-bottom: 10px">
        <p style="color: red">*</p>
        <p style="">风格</p>
      </div>

      <RadioGroup v-model="state.style">
        <div style="display: flex; flex-wrap: wrap">
          <div
            v-for="(info, i) in styleList"
            :key="`${i}-button`"
            style="flex: 1 0 0; display: flex; flex-direction: column; margin-bottom: 5px"
          >
            <img
              :alt="info.text"
              @click="choseStyle(info.label)"
              v-lazy="info.src"
              style="height: 50px; width: 50px"
            />
            <Radio :label="info.label">{{ info.text }}</Radio>
          </div>
        </div>
      </RadioGroup>
    </Card>

    <!-- 立即生成区域 -->
    <Divider />
    <div style="display: flex; justify-content: center">
      <Button type="primary" shape="circle" size="large" @click="generatePoster">
        <p style="font-weight: bold">立即生成</p>
      </Button>
    </div>
  </div>

  <!-- 艺术字生成 -->
  <div v-if="controller.mode == '4'">
    <!-- 标题区域 -->
    <div>
      <Button type="text" style="margin-top: 10px" @click="choseMode('1')">
        <Icon type="ios-arrow-back"></Icon>
        返回
      </Button>
      <p style="font-size: 20px; font-weight: bold; margin: 15px">AI艺术字生成</p>
    </div>
    <!-- 图像生成区域 -->
    <Card v-if="state.genState" style="margin: 10px; display: flex; justify-content: center">
      <Circle v-if="!genView.display" :percent="genView.percent" :stroke-color="genView.color">
        <Icon
          v-if="genView.percent == 100"
          type="ios-checkmark"
          size="60"
          style="color: #5cb85c"
        ></Icon>
        <span v-else style="font-size: 24px">{{ genView.percent }}%</span>
      </Circle>
      <div v-else>
        <img
          :src="genView.output"
          style="max-width: 100%; height: auto; cursor: pointer"
          @click="addItem"
          @dragend="dragItem"
        />
        <!-- 功能 -->
        <div style="display: flex; justify-content: space-between">
          <n-button type="primary" size="small" tertiary @click="addElement">立即添加</n-button>
          <n-button type="info" size="small" tertiary @click="saveElement">保存元素</n-button>
          <n-button type="error" size="small" tertiary @click="generatePoster">重新生成</n-button>
        </div>
      </div>
    </Card>

    <!-- 文本输入区域 -->
    <Card style="margin: 10px">
      <div style="display: flex; font-size: 15px; font-weight: 500; margin-bottom: 10px">
        <p style="color: red">*</p>
        <p style="">文本</p>
      </div>

      <Input
        v-model="state.prompt"
        type="textarea"
        maxlength="10"
        show-word-limit
        @on-change="disTemplate"
        :rows="4"
        placeholder="输入想要进行设计的文本"
      />
      <Space wrap style="margin-top: 10px">
        <p style="color: grey">示范：</p>
        <Button
          size="small"
          :key="`${i}-template`"
          v-for="(template, i) in state.materialist[2].list"
          @click="useTemplate(template)"
        >
          {{ template.label }}
        </Button>
      </Space>
    </Card>

    <!-- 字体选择区域 -->
    <Card style="margin: 10px">
      <div style="display: flex; font-size: 15px; font-weight: 500; margin-bottom: 10px">
        <p style="color: red">*</p>
        <p style="">字体</p>
      </div>

      <RadioGroup v-model="state.style">
        <div style="display: flex; flex-wrap: wrap">
          <div
            v-for="(info, i) in fontList"
            :key="`${i}-button`"
            style="flex: 1 0 0; display: flex; flex-direction: column; margin-bottom: 5px"
          >
            <img
              :alt="info.text"
              @click="choseStyle(info.label)"
              v-lazy="info.src"
              style="height: 50px; width: auto"
            />
            <Radio :label="info.label">{{ info.text }}</Radio>
          </div>
        </div>
      </RadioGroup>
    </Card>

    <!-- 立即生成区域 -->
    <Divider />
    <div style="display: flex; justify-content: center">
      <Button type="primary" shape="circle" size="large" @click="generatePoster">
        <p style="font-weight: bold">立即生成</p>
      </Button>
    </div>
  </div>
</template>

<script setup name="ImportAI" lang="ts">
import { Input, Modal } from 'view-ui-plus';
import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import useSelect from '@/hooks/select';
import { SaveOutline } from '@vicons/ionicons5';
import { post, postFormData } from '@/network/index';
import { Message } from 'view-ui-plus';
const { canvasEditor }: { canvasEditor: any } = useSelect();

const defaultPosition = {
  left: 100,
  top: 100,
  shadow: '',
  fontFamily: '1-1',
};

const controller = reactive({ mode: '1' });

interface materialTypeI {
  value: string;
  label: string;
  list?: materialItemI[];
}

interface materialItemI {
  value: string;
  label: string;
  src: string;
  fore: string;
  back: string;
  prompt: string;
  style: string;
}

const state = reactive({
  prompt: '',
  style: ' ',
  genState: false,
  materialTypelist: <materialTypeI[]>[], // 分类列表
  materialist: <materialTypeI[]>[], // 列表内容
});

const genView = reactive({
  isTemplate: false,
  percent: 0,
  display: false,
  color: '#2db7f5',
  output: '',
  fg: '',
  bg: '',
});

const styleList = [
  {
    label: '1',
    text: '现实',
    src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/style-iconography.png',
  },
  {
    label: '2',
    text: '绘画',
    src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/style-painting.png',
  },
  {
    label: '3',
    text: '像素',
    src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/style-pixelart.png',
  },
  {
    label: '4',
    text: '低多边形',
    src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/style-lowpoly.png',
  },
  {
    label: '5',
    text: '素描',
    src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/style-sketch.png',
  },
  {
    label: '6',
    text: '水墨',
    src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/style-ink.png',
  },
];

const fontList = [
  {
    label: '1',
    text: 'Kaushan Script',
    src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/Kaushan%20Script%20.png',
  },
];

canvasEditor.getMaterialType('ai').then((list: materialTypeI[]) => {
  state.materialTypelist = [...list];
  state.materialist = list;
  console.log(list);
});

let intervalId;
/**
 * 选择模式
 *
 * @param mode 模式类型
 * @returns 无返回值
 */
const choseMode = (mode: string) => {
  if (mode == '1') {
    if (genView.display == true || genView.percent > 0) {
      Modal.confirm({
        title: '提示',
        content: '退出后已经生成的素材将丢失。',
        onOk: () => {
          controller.mode = '1';
          clearInterval(intervalId);
          state.genState = false;
          genView.percent = 0;
          genView.display = false;
          genView.color = '#2db7f5';
          genView.output = '';
        },
      });
    } else {
      controller.mode = '1';
    }
    state.prompt = '';
    state.style = '';
    return;
  } else if (mode == '3' || mode == '2' || mode == '4') {
    controller.mode = mode;
  } else {
    Modal.info({
      title: '提示',
      content: '此功能尚未开通，请耐心等待～',
    });
  }
};

const choseStyle = (label: string) => {
  disTemplate();
  state.style = label;
};

const disTemplate = () => {
  genView.isTemplate = false;
};

const useTemplate = (template: materialItemI) => {
  state.prompt = template.prompt;
  state.style = template.style;
  genView.output = template.src;
  genView.fg = template.fore;
  genView.bg = template.back;
  genView.isTemplate = true;
  console.log(template);
};

const generatePoster = () => {
  if (state.style == '' || state.prompt == '') {
    Modal.warning({
      title: '提示',
      content: '请填写文字描述，选择风格。',
    });
    return;
  }
  if (genView.isTemplate == false) {
    Modal.info({
      title: '提示',
      content: '由于算力资源紧张，暂不支持自定义，请选择示范模板！',
    });
    return;
  } else if (state.genState == true) {
    Modal.confirm({
      title: '确认',
      content: '您确定重新生成吗？已生成的图片将不会保存。',
      onOk: () => {
        genView.percent = 0;
        genView.display = false;
      },
    });
  } else {
    state.genState = true;
  }
  let randomInt = Math.floor(Math.random() * 200) + 100;
  intervalId = setInterval(() => {
    genView.percent += 1;
    if (genView.percent >= 100) {
      genView.color = '#5cb85c';
      clearInterval(intervalId);
      showPoster();
    }
  }, randomInt);
};

const showPoster = () => {
  const intervalId = setInterval(() => {
    genView.display = true;
    genView.percent = 0;
    genView.color = '#2db7f5';
    clearInterval(intervalId);
  }, 400);
};

const dragItem = (event: Event) => {
  const target = event.target as HTMLImageElement;
  const url = target.src;
  // 会有性能开销 dragAddItem复用更简洁
  fabric.loadSVGFromURL(url, (objects) => {
    const item = fabric.util.groupSVGElements(objects, {
      shadow: '',
      fontFamily: 'arial',
      id: uuid(),
      name: 'svg元素',
    });
    canvasEditor.dragAddItem(event, item);
  });
};

/**
 * 按照类型渲染
 *
 * @param e 事件对象
 * @returns 无返回值
 */
const addItem = (e: Event) => {
  const target = e.target as HTMLImageElement;
  const url = target.src;
  fabric.loadSVGFromURL(url, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      ...defaultPosition,
      id: uuid(),
      name: 'svg元素',
    });
    canvasEditor.canvas.add(item);
    canvasEditor.canvas.setActiveObject(item);
    canvasEditor.canvas.requestRenderAll();
  });
};
const addElement = () => {
  // const target = genView.output as unknown as HTMLImageElement;
  const url = genView.output;
  fabric.loadSVGFromURL(url, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      ...defaultPosition,
      id: uuid(),
      name: 'svg元素',
    });
    canvasEditor.canvas.add(item);
    canvasEditor.canvas.setActiveObject(item);
    canvasEditor.canvas.requestRenderAll();
  });
};
// 将SVG链接转换为PNG并返回数据URL
async function svgUrlToPng(svgUrl: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = 'anonymous'; // 避免跨域问题
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(img, 0, 0, width, height);
        const pngDataUrl = canvas.toDataURL('image/png');
        resolve(pngDataUrl);
      } else {
        reject(new Error('Canvas context is null'));
      }
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = svgUrl;
  });
}
// 将SVG URL获取为文件对象
async function fetchSvgAsFile(svgUrl: string, filename: string): Promise<File> {
  const response = await fetch(svgUrl);
  const svgText = await response.text();
  const blob = new Blob([svgText], { type: 'image/svg+xml' });
  return new File([blob], filename, { type: 'image/svg+xml' });
}

// 将数据URL转换为File对象
function dataUrlToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

async function compressImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
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
const saveElement = async () => {
  //TODO
  // 1. 将SVG URL转换为PNG数据URL
  const pngDataUrl = await svgUrlToPng(genView.output, 400, 400);

  // 2. 将PNG数据URL转换为File对象
  const pngFile = dataUrlToFile(pngDataUrl, 'image.png');

  // 3. 使用axios发送File对象
  const formData = new FormData();
  formData.append('file', pngFile);
  formData.append('fileName', 'png');
  await postFormData('/element/upload', formData, async (res: any) => {
    var pngUrl = res.filePath;
    console.log(res);
    const formData2 = new FormData();
    const svgfile = await fetchSvgAsFile(genView.output, 'image.svg');
    formData2.append('file', svgfile);
    formData2.append('fileName', 'svg');
    await postFormData('/element/upload', formData2, async (res2: any) => {
      var svgUrl = res2.filePath;
      console.log(res2);
      post(
        '/element/save',
        {
          fileName: 'element',
          filePath: svgUrl,
          isPublic: false,
          pngPath: pngUrl,
        },
        (res: any) => {
          Message.success('保存成功');
        }
      );
    });
  });
};
</script>

<style scoped lang="less">
.upload-button {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 99;
}
</style>
