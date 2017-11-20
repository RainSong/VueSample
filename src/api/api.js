
import axios from 'axios'

let instance = axios.create({
    baseURL: 'http://localhost:9003/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});
function transformRequest(paras) {
    let ret = ''
    for (let it in paras) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(paras[it]) + '&'
    }
    return ret
}
export const getInterviews = params => {
    return instance.get('/interview', { params: params }).then(res => res.data);
}

export const addInterview = params => {
    return instance.post('/interview', params, { transformRequest: [transformRequest] }).then(res => res.data);
};
export const updateInterview = params => {
    return instance.patch('/interview', params, { transformRequest: [transformRequest] }).then(res => res.data);
}

export const deleteInterview = id => {
    return instance.delete('/interview/' + id).then(res => res.data);
}

export const getInterviewInfo = id => {
    return instance.get('/interview/' + id).then(res => res.data);
}

export const getMenus = () => {
    return instance.get('/menu').then(res => res.data);
}

export const getDepartments = params => {
    return instance.get('/department', { params: params }).then(res => res.data);
}

export const getDepartmentInfo = id => {
    return instance.get('/department/' + id).then(res => res.data);
}

export const updateDepartment = params => {
    return instance.patch('/department', params, { transformRequest: [transformRequest] }).then(res => res.data);
}

export const addDepartment = paras => {
    return instance.post('/department', paras, { transformRequest: [transformRequest] }).then(res => res.data);
}

export const deleteDepartment = id => {
    return instance.delete('/department/' + id).then(res => res.data);
}

export const getUsers = params => {
    return instance.get('/user', { params: params }).then(res => res.data);
}

export const getUserInfo = id => {
    return instance.get('/user/' + id).then(res => res.data);
}

export const addUser = params => {
    return instance.post('/user', params, { transformRequest: [transformRequest] }).then(res => res.data);
}

export const updateUser = params => {
    return instance.patch('/user', params, { transformRequest: [transformRequest] }).then(res => res.data);
}

export const deleteUser = id => {
    return instance.delete('/user', { params: { ids: id } }).then(res => res.data);
}

export const resetUserPassword = params =>{
    return instance.post('/user/resetpassword',params, { transformRequest: [transformRequest] }).then(res => res.data);
}