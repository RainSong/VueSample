
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
    return instance.get(url, { params: params }).then(res => res.data);
}

function postData(url, paras) {
    let params = getParas(paras);
    return instance.post(url, params, { transformRequest: [transformRequest] }).then(res => res.data);
}

function patchData(url, paras) {
    let params = getParas(paras);
    return instance.patch(url, params, { transformRequest: [transformRequest] }).then(res => res.data);
}

function deleteData(url, paras) {
    let params = getParas(paras);
    return instance.delete(url, { params: params }).then(res => res.data);
}

export const getInterviews = paras => {
    return getData('/interview', paras);
}

export const addInterview = paras => {
    return postData('/interview', paras);
};
export const updateInterview = paras => {
    return patchData('/interview', paras);
}

export const deleteInterview = id => {
    return deleteData('/interview/' + id);
}

export const getInterviewInfo = id => {
    return getData('/interview/' + id);
}

export const getMenus = () => {
    return getData('/menu');
}

export const getDepartments = paras => {
    return getData('/department', paras);
}

export const getDepartmentInfo = id => {
    return getData('/department/' + id);
}

export const updateDepartment = paras => {
    return patchData('/department', paras);
}

export const addDepartment = paras => {
    return postData('/department', paras);
}

export const deleteDepartment = id => {
    return deleteData('/department/' + id);
}

export const getUsers = paras => {
    return getData('/user', paras);
}

export const getUserInfo = id => {
    return getData('/user/' + id);
}

export const addUser = params => {
    return postData('/user', params);
}

export const updateUser = params => {
    return patchData('/user', params);
}

export const deleteUser = id => {
    return deleteData('/user', { ids: id });
}

export const resetUserPassword = paras => {
    return postData('/user/resetpassword', paras);
}

export const login = paras => {
    return postData('/auth/login', paras);
}

export const getRoles = paras => {
    return getData('/role', paras);
}

export const getRoleInfo = id => {
    return getData('/role/' + id);
}

export const addRole = paras => {
    return postData('/role', paras).then(res => res);
}

export const updateRole = paras => {
    return patchData('/role', paras);
}

export const deleteRole = ids => {
    return deleteData('/role', { ids });
}

export const getPermissions = paras => {
    return getData('/permissions', paras);
}

export const getPermissionsinfo = id => {
    return getData('/permissions/' + id);
}

export const addPermissions = paras => {
    return postData('/permissions', paras).then(res => res);
}

export const updatePermissions = paras => {
    return patchData('/permissions', paras);
}

export const deletePermissions = ids => {
    return deleteData('/permissions', { ids });
}

export const getUserRoleIds = userId => {
    return getData('/user/role/' + userId);
}

export const updateUserRoles = paras => {
    return postData('/user/role',  paras );
}

export const getRolePermissionsIds = roleId => {
    return getData('/role/permissions/' + roleId);
}

export const updateRolePermissions = paras => {
    return postData('/role/permissions', paras);
}

