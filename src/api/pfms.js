import request from '@/utils/request'
// import {uploadFile} from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/pfms/list',
    method: 'get',
    params: params
  })
}

export function listCategories(params) {
  return request({
    url: '/pfms/category/listCategories',
    method: 'get',
    params: params
  })
}

export function createFinance(data) {
  return request({
    url: '/pfms/create',
    method: 'post',
    data: data
  })
}

export function updateFinance(id, data) {
  return request({
    url: '/pfms/update/' + id,
    method: 'post',
    data: data
  })
}

export function fetchCategories(params) {
  return request({
    url: '/pfms/category/list',
    method: 'get',
    params: params
  })
}

export function createCategory(data) {
  return request({
    url: '/pfms/category/create',
    method: 'post',
    data: data
  })
}

export function deleteFinance(id) {
  return request({
    url: '/pfms/delete/' + id,
    method: 'post'
  })
}

export function importFinance(file) {
  const formData = new FormData()
  formData.append('file', file);
  return request({
    url: '/pfms/import',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data; charset=UTF-8',
    },
    data: formData
  });
}

export function fetchBackupList(params) {
  return request({
    url: '/pfms/backup/list',
    method: 'get',
    params: params
  })
}

export function exportFinance() {
  return request({
    url: '/pfms/backup/export',
    method: 'get',
    responseType: 'blob'
        // headers: {
    //   'Content-Type': 'text/csv; charset=UTF-8',
    // },
  });
}


export function exportFinanceNew(params) {
  return request({
    url: '/pfms/backup/exportNew',
    method: 'get',
    params: params
  });
}

export function dashboard() {
  return request({
    url: '/pfms/dashboard',
    method: 'get',
  });
}

export function trend(params) {
  return request({
    url: '/pfms/trend',
    method: 'get',
    params: params
  });
}

export function backup() {
  return request({
    url: '/pfms/backup/backup',
    method: 'get',
  });
}


export function budgetSetting() {
  return request({
    url: '/pfms/budget/getSetting',
    method: 'get',
  });
}

export function budgetUpdateSetting(data) {
  return request({
    url: '/pfms/budget/updateSetting',
    method: 'post',
    data: data,
  });
}

export function noticeSetting() {
  return request({
    url: '/pfms/notice/getSetting',
    method: 'get',
  });
}

export function noticeUpdateSetting(data) {
  return request({
    url: '/pfms/notice/updateSetting',
    method: 'post',
    data: data,
  });
}


export function fetchMessageList(params) {
  return request({
    url: '/pfms/message/list',
    method: 'get',
    params: params,
  });
}

export function readMessage(params) {
  return request({
    url: '/pfms/message/read',
    method: 'get',
    params: params,
  });
}

export function trendPie(params) {
  return request({
    url: '/pfms/trendPie',
    method: 'get',
    params: params
  });
}
