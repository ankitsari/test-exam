import axios from 'axios'
import utils from './index'

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  const originalRequest = error.config;
  if (error.response && error.response.status === 401 && !originalRequest._retry) {

    originalRequest._retry = true;

    const RefreshToken = window.localStorage.getItem('exam-refreshToken');
      if (!RefreshToken || RefreshToken === 'undefined') {
          localStorage.removeItem('exam-token');
          localStorage.removeItem('exam-refreshToken');
          localStorage.removeItem('exam-user');
          window.location.href = '/';
          return;

      }
    const Email = window.localStorage.getItem('exam-email');
    const url = utils.getURL('/AccountApi/RefreshToken');
    return axios.post(url, {Email, RefreshToken})
      .then(({data}) => {
        if (!data) {
          localStorage.removeItem('exam-token');
          localStorage.removeItem('exam-refreshToken');
          localStorage.removeItem('exam-user');
        }
        window.localStorage.setItem('exam-token', data.token);
        window.localStorage.setItem('exam-refreshToken', data.refreshToken);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
        originalRequest.headers['Authorization'] = 'Bearer ' + data.token;
        return axios(originalRequest);
      });
  }

  return Promise.reject(error);
});
const config = () => ({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('exam-token')}` || '',
  },
})

// Authenticate
export async function login(callbackUrl) {
  const url = utils.getURL(`/AccountApi/Login?callbackUrl=${callbackUrl}`);
  const res = await axios.get(url, config())
  return res.data;
}

export async function getToken(data) {
  const url = utils.getURL(`/AccountApi/Office365`);
  const res = await axios.post(url, data, config())
  return res.data;
}

export async function logout() {
  localStorage.removeItem('exam-token');
  localStorage.removeItem('exam-email');
  localStorage.removeItem('exam-refreshToken');
  localStorage.removeItem('exam-user');
  window.location.pathname = '/login';
}

export async function getUserInfo(data) {
  const url = utils.getURL(`/AccountApi/Office365`);
  const res = await axios.post(url, data, config())
  return res.data;
}

// Common Api

export async function getSourceList() {
  const url = utils.getURL(`/CommonApi/SourceList`);
  let res = await axios.get(url, config())
  return res
}

export async function getExamStatusList() {
  const url = utils.getURL(`/CommonApi/ExamStatusList`);
  const res = await axios.get(url, config())
  return res.data;
}

export async function getAllExamsList() {
  const url = utils.getURL(`/CommonApi/ExamsList`);
  const res = await axios.get(url, config())
  return res.data;
}

// For Exam

export async function getExamsList() {
  const url = utils.getURL('/ManageExamApi/ExamList');
  const res = await axios.get(url, config())
  return res
}

export async function deleteExamsById(TestId) {
  const url = utils.getURL(`/ManageExamApi/Delete/${TestId}`);
  const res = await axios.delete(url, config())
  return res.data;
}

export async function createExams(data) {
  const url = utils.getURL('/ManageExamApi/Save');
  const res = await axios.post(url, data, config())
  return res.data;
}


export async function editExamById(examId) {
  const url = utils.getURL(`/ManageExamApi/EditExam/${examId}`);
  const res = await axios.get(url, config())
  return res.data;
}

export async function updateExam(data) {
  const url = utils.getURL('/ManageExamApi/Update');
  const res = await axios.put(url, data, config())
  return res.data;
}

// For Test

export async function getTestsList() {
  const url = utils.getURL('/CreateSessionApi/TestList');
  const res = await axios.get(url, config())
  return res
}

export async function getTestById(testId) {
  const url = utils.getURL(`/CreateSessionApi/View/${testId}`);
  const res = await axios.get(url, config())
  return res.data;
}

export async function getTestByIdForEdit(testId) {
  const url = utils.getURL(`/CreateSessionApi/Edit/${testId}`);
  const res = await axios.get(url, config())
  return res.data;
}

export async function createSession(data) {
  const url = utils.getURL('/CreateSessionApi/Create');
  const res = await axios.post(url, data, config())
  return res.data;
}

export async function updateSession(data) {
  const url = utils.getURL('/CreateSessionApi/Update');
  const res = await axios.put(url, data)
  return res.data;
}

export async function checkValidateToken(token) {
  const url = utils.getURL(`/CreateSessionApi/ValidateToken/${token}`);
  const res = await axios.get(url, config())
  return res.data;
}

export async function deleteSession(id) {
  const url = utils.getURL(`/CreateSessionApi/delete/${id}`);
  const res = await axios.delete(url, config())
  return res.data;
}

export async function filterListSession(data) {
    const url = utils.getURL(`/CreateSessionApi/FilterList`)
    if(data){
        const res = await axios.post(url, data, config());
        return res.data;
    }else{
        const res = await axios.post(url, {}, config());
        return res.data;
    }
}
// Technical test

export async function getExamDetail(examdetailId) {
  const url = utils.getURL(`/TechnicalTestApi/StartTest/${examdetailId}`);
  const res = await axios.get(url, config())
  return res.data;
}

export async function submitTechnicalTest(data) {
  const url = utils.getURL(`/TechnicalTestApi/SubmitTest`);
  const res = await axios.put(url, data, config())
  return res.data;
}

export async function updateStatusMultiple(data) {
    const url = utils.getURL(`/CreateSessionApi/UpdateStatusForMultiple`);
    const res = await axios.post(url, data, config())
    return res.data;
}

export async function multipleDelete(data) {
    const url = utils.getURL(`/CreateSessionApi/DeleteMultiple`);
    const res = await axios.post(url, data, config())
    return res.data;
}

export async function refreshToken() {
  const RefreshToken = window.localStorage.getItem('exam-refreshToken');
  const Email = window.localStorage.getItem('exam-email');
  const url = utils.getURL('/AccountApi/RefreshToken');
  return axios.post(url, {Email, RefreshToken})
    .then(({data}) => {
      if (!data) {
        localStorage.removeItem('exam-token');
        localStorage.removeItem('exam-refreshToken');
        localStorage.removeItem('exam-user');
      }
      window.localStorage.setItem('exam-token', data.token);
      window.localStorage.setItem('exam-refreshToken', data.refreshToken);
    });
}

export async function getStatusList() {
    const url = utils.getURL(`/ExamStatusApi/StatusList`);
    const res = await axios.get(url, config())
    return res
}

export async function addStatus(data) {
    const url = utils.getURL('/ExamStatusApi/Save');
    const res = await axios.post(url, data, config())
    return res.data;
}

export async function updateStatus(data) {
    const url = utils.getURL('/ExamStatusApi/Update');
    const res = await axios.put(url, data, config())
    return res.data;
}

export async function removeStatus(id) {
    const url = utils.getURL('/ExamStatusApi/Delete/'+id);
    const res = await axios.delete(url, config())
    return res.data;
}

setInterval(async function () {
  await refreshToken();
}, 18 * 60 * 1000); // 18 minutes