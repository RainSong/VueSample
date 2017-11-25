
import axios from 'axios'

let instance = axios.create({
    baseURL: 'http://localhost:9003/api',
    // baseURL: '/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
});
function transformRequest(paras) {
    let ret = ''
    for (let it in paras) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(paras[it]) + '&'
    }
    return ret
}
function getToken() {
    return localStorage.getItem('token');
}
function getParas(paras) {
    let params;
    let token = getToken();
    if (typeof paras !== 'undefined') {
        params = {
            ...paras,
            token: token
        };
    }
    else {
        params = {
            token: token
        };
    }
    return params;
}
function getData(url, paras) {
    let params = getParas(paras);
    return instance.get(url, { params: params });
}

function postData(url, paras) {
    let params = getParas(paras);
    return instance.post(url, params, { transformRequest: [transformRequest] });
}

function patchData(url, paras) {
    let params = getParas(paras);
    return instance.patch(url, params, { transformRequest: [transformRequest] });
}

function deleteData(url, paras) {
    let params = getParas(paras);
    return instance.delete(url, { params: params });
}

export const getInterviews = paras => {
    debugger
    return getData('/interview', paras).then(res => res.data);
}

export const addInterview = paras => {
    return postData('/interview', paras).then(res => res.data);
};
export const updateInterview = paras => {
    return patchData('/interview', paras).then(res => res.data);
}

export const deleteInterview = id => {
    return deleteData('/interview/' + id).then(res => res.data);
}

export const getInterviewInfo = id => {
    return getData('/interview/' + id).then(res => res.data);
}

export const getMenus = () => {
    return getData('/menu').then(res => res.data);
}

export const getDepartments = paras => {
    return getData('/department', { params: paras }).then(res => res.data);
}

export const getDepartmentInfo = id => {
    return getData('/department/' + id).then(res => res.data);
}

export const updateDepartment = paras => {
    return patchData('/department', paras).then(res => res.data);
}

export const addDepartment = paras => {
    return postData('/department', paras).then(res => res.data);
}

export const deleteDepartment = id => {
    return deleteData('/department/' + id).then(res => res.data);
}

export const getUsers = paras => {
    return getData('/user', { params: paras }).then(res => res.data).catch(err => { debugger; console.log(err); });
}

export const getUserInfo = id => {
    return getData('/user/' + id).then(res => res.data);
}

export const addUser = params => {
    return postData('/user', params).then(res => res.data);
}

export const updateUser = params => {
    return patchData('/user', params).then(res => res.data);
}

export const deleteUser = id => {
    return deleteData('/user', { params: { ids: id } }).then(res => res.data);
}

export const resetUserPassword = paras => {
    return postData('/user/resetpassword', paras).then(res => res.data);
}

export const login = paras => {
    return postData('/auth/login', paras).then(res => res.data);
}