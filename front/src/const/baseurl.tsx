// 根据环境变量导出不同的 URL
const urls = {
    development: {
        // 盒子
    },
    production: {
        // 盒子
     

        // WsvBaseUrl : "http://127.0.0.1:3000"
    },
};
// 根据当前环境导出对应的 URL
const envUrls = urls[process.env.ENV_BaseURL];
export default envUrls;
