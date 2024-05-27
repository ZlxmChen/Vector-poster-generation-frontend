import axios from 'axios';
import router from '@/router';
//在本地mock环境使用
const baseUrl = 'http://127.0.0.1:4523/m1/4527485-0-default';
//在服务器环境使用
// baseUrl = 'http://192.168.3.11:4527/m1';
//在MaterialPlugin中还有关于获取素材的设置, 统一只通过;

async function post(url, data, success, error = defaultError) {
  try {
    if (!localStorage.getItem('Token') != '') {
      const response = await axios.post(baseUrl + url, data, {
        headers: {
          Token: localStorage.getItem('Token'),
        },
      });
      if (response.status == 200) success(response.data);
      else error(response.data);
    } else router.push('/login');
  } catch (axiosError) {
    if (axiosError.response) {
      error(axiosError.response.data);
    } else {
      error('Network Error');
    }
  }
}

async function get(url, params, success, error = defaultError) {
  try {
    if (localStorage.getItem('Token') != '') {
      const response = await axios.get(baseUrl + url, {
        headers: {
          Token: localStorage.getItem('Token'),
        },
        params,
      });
      if (response.status == 200) success(response.data);
      else error(response.data);
    } else router.push('/login');
  } catch (axiosError) {
    if (axiosError.response) {
      error(axiosError.response.data);
    } else {
      error('Network Error');
    }
  }
}
async function postNToken(url, data, success, error = defaultError) {
  try {
    const response = await axios.post(baseUrl + url, data, {
      headers: {},
    });
    if (response.status == 200) success(response.data);
    else error(response.data);
  } catch (axiosError) {
    if (axiosError.response) {
      error(axiosError.response.data);
    } else {
      error('Network Error');
    }
  }
}

async function getNToken(url, params, success, error = defaultError) {
  try {
    const response = await axios.get(baseUrl + url, {
      headers: {},
      params,
    });
    if (response.status == 200) success(response.data);
    else error(response.data);
  } catch (axiosError) {
    if (axiosError.response) {
      error(axiosError.response.data);
    } else {
      error('Network Error');
    }
  }
}
function defaultError(message, status = 'error') {
  if (status == 'error') {
    //router.push('/login');
    console.log(message);
  }
}
export { get, post, getNToken, postNToken };
