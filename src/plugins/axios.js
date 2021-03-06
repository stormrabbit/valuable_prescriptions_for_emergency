import axios from 'axios';
import qs from 'qs';
// let loadingInstance = null;

const instance = axios.create({
    timeout: 15 * 1000, // 15 秒超时
    baseURL: process.env.VUE_APP_ADMIN_API_HOST, // 设置域名
    // withCredentials: true, // 携带 cookie
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

// 请求列表
const requestList = [];
const CancelToken = axios.CancelToken;
let sources = {};

instance.interceptors.request.use(config => {
    const request = JSON.stringify(config.url) + JSON.stringify(config.data);
    config.cancelToken = new CancelToken((cancel) => {
        sources[request] = cancel;
    })
    //1.判断请求是否已存在请求列表，避免重复请求，将当前请求添加进请求列表数组；
    if (requestList.includes(request)) {
        sources[request]('取消重复请求')
    } else {
        requestList.push(request)
        //2.请求开始，改变loading状态供加载动画使用
        // store.commit('app/putLoadingState', true);

    }
    return config;

}, error => Promise.reject(error));

instance.interceptors.response.use(response => {
    // 1.将当前请求中请求列表中删除
    const request = JSON.stringify(response.config.url) + JSON.stringify(response.config.data);
    requestList.splice(requestList.findIndex(item => item === request), 1);
    // 2.当请求列表为空时，更改loading状态
    if (requestList.length === 0) {
        // store.commit('app/putLoadingState', false);
    }
    try {
        const {
            code = 40000, 
            // message = '网络连接异常',
            data = {},
        } = response.data || {};
        // store.commit('app/putMessage', message);

        if (code === 100) {
            return Promise.resolve({
                code
            });
        }
        // if (code !== 200) {
        //     return Promise.resolve({});
        // }
        return Promise.resolve(data);
    } catch (ex) {
        return Promise.resolve('');
    }
}, error => {
    if (axios.isCancel(error)) {
        requestList.length = 0; // 可能会清掉重复的请求
    }
    return Promise.reject(error);
});


const request = function (url, params, config, method) {
    return new Promise((resolve, reject) => {
        instance[method](url, params, Object.assign({}, config)).then(response => {
            resolve(response)
        }, err => {
            if (err.Cancel) {
                console.log(err)
            } else {
                reject(err)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

const post = (url, params = {}, config = {}) => {
    return request(url, qs.stringify(params), config, 'post')
}

const get = (url, query = {}, params, config = {}) => {
    const _url = `${url}?${parseQuery(query)}`
    return request(_url, params, config, 'get')
}

const put = (url, query = {}, params, config = {}) => {
    const _url = `${url}?${parseQuery(query)}`
    return request(_url, qs.stringify(params), config, 'put')
}

const del = (url, query = {}, config = {}) => {
    const _url = `${url}?${parseQuery(query)}`
    return request(_url, {}, config, 'delete')
}

const parseQuery = (query = {}) => {
    return Object.keys(query).reduce((pre, cur) => {
        if ((typeof (query[cur]) === 'object') && !query[cur].length) {
            return pre;
        }
        const temp = (query[cur] && query[cur].length && typeof (query[cur]) === 'object') ? query[cur].map(qr => `${cur}=${qr}`).join('&') : `${cur}=${query[cur]}`
        return `${pre}&${temp}`;
    }, '').substring(1)
}
//3.导出cancel token列表供全局路由守卫使用
const api = {
    sources,
    post,
    get,
    put,
    del
}
export default api