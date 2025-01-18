# apkStore
这是一个针对不同类型的终端下发指定apk资源的项目,综合考虑到下发apk资源过程中关于版本/价格套餐/菜单服务/用户等功能,追求性能的同时,又简约了开发过程中的沟通协作问题.

## 功能特点
- **统一的前后端开发模式**：采用 protobuf 的传输格式协议,利用Buf自动生成api,进行前后端联合开发.做到一处定义,处处使用.
- **更快的数据传输**：在终端与后台的通信过程中,使用了 fasthttp 进行通信,数据操作方面使用jackc/pgx 以及原生Sql进行数据操作.极大的减少了终端获取服务延迟的问题.
- **至简的前端开发**：在前端方面,基于Creat React App 和 Mui 组件进行开发.可以快速简单地实现绝大部分基础功能.
## 安装运行
```bash
# 克隆项目
git https://github.com/ludan3134/apkStore.git

# 前端
# 进入项目目录
cd front

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务# 
npm run dev:dev

# 后端
# 进入项目目录
cd server

# 本地运行
# 运行主节点服务
cd cmd/wsv
go run main.go
# 运行边缘节点服务
cd cmd/wnv
go run main.go
```

## 项目结构

```
# 后端项目结构

│  go.mod
│  go.sum
│  README.md
│  tr.txt
│  
├─.idea
│      .gitignore
│      modules.xml
│      vcs.xml
│      workspace.xml
│      wst.iml
│      
├─ap
│      aescode.go
│      aescode_test.go
│      helper.go
│      ip.go
│      ip_test.go
│      sleep.go
│      slicePage.go
│      toml.go
│      toml_test.go
│      writeBinaryFile.go
│      
├─cmd
│  ├─wnv	(子节点服务)
│  │  │  main.go
│  │  │  wn-config.toml
│  │  │  
│  │  └─log
│  │          test-error.log
│  │          test-error.log-2024101603.json
│  │          test.log
│  │          test.log-2024101603.json
│  │          
│  └─wsv	(主节点服务)
│      │  main.go
│      │  ws-config.toml
│      │  
│      └─log
│              test.log
│              test.log-2024101908.json
│              test.log-2024101910.json
│              test.log-2024102102.json
│              test.log-2024103005.json
│              
├─dbv5	(数据库操作)
│  │  aclient.go
│  │  afterconnect.go
│  │  pgxV5.go
│  │  
│  └─postgresconfig5
│          pgxconfig.go
│          
├─geoLite2 (IP节点)
│  ├─lib
│  │      getAddressByIp.go
│  │      
│  └─src
│          GeoLite2-ASN.mmdb
│          GeoLite2-Country.mmdb
│          
├─h2client	
│      http.go
│      
├─internal
│  ├─cache
│  │      acache.go
│  │      token.go
│  │      
│  ├─config
│  │  ├─nodeconfig
│  │  │      config.go
│  │  │      config_test.go
│  │  │      const.go
│  │  │      
│  │  └─serviceconfig
│  │          config.go
│  │          const.go
│  │          
│  ├─connect
│  │  ├─aes
│  │  │      aes.go
│  │  │      aes_test.go
│  │  │      
│  │  ├─jwt
│  │  │      jwt.go
│  │  │      
│  │  ├─middleware (跨域中间件)
│  │  │      cors.go
│  │  │      
│  │  └─wst
│  │      ├─client 
│  │      │      aclient.go
│  │      │      apps.go
│  │      │      auth.go
│  │      │      catagories.go
│  │      │      notification.go
│  │      │      
│  │      ├─node (边缘节点服务层)
│  │      │      aaanode.go
│  │      │      apps.go
│  │      │      auth.go
│  │      │      const.go
│  │      │      helper.go
│  │      │      importAppUserHandler.go
│  │      │      ip.go
│  │      │      middle.go
│  │      │      notification.go
│  │      │      response.go
│  │      │      router.go
│  │      │      
│  │      └─service (主服务访问)
│  │              apps.go
│  │              appuser.go
│  │              aservice.go
│  │              categories.go
│  │              priceplans.go
│  │              
│  ├─dbo	(数据库操作)
│  │  └─pgdbo
│  │      │  adbo.go
│  │      │  adbo_test.go
│  │      │  apps.go
│  │      │  apps_test.go
│  │      │  appuser.go
│  │      │  appuser_test.go
│  │      │  categories.go
│  │      │  priceplans.go
│  │      │  
│  │      └─prepareSql
│  │              perparewnvSql.go
│  │              perparewsvSql.go
│  │              
│  ├─fastclient
│  │      client.go
│  │      client_test.go
│  │      upload.go
│  │      
│  └─model
│      └─middle
│              parser.go
│              parser_test.go
│              
├─redix
│  │  pool.go
│  │  
│  └─redisconfig
│          config.go
│          
└─rustlib
    │  callRust.go
    │  callRust_test.go
    │  
    ├─example
    │  └─go-call-rust-demo
    │          main.go
    │          
    └─libcall_rust
            bindings.h
            libcall_rust.a
        


# 前端项目结构

├─app
│  ├─api(服务调用)
│  │  ├─apkversion
│  │  │      grpcAppversionEdit.tsx
│  │  │      grpcAppversionInsert.tsx
│  │  │      grpcAppversionList.tsx
│  │  │      
│  │  └─app
│  │          grpcAppCopy.tsx
│  │          grpcAppDeletelist.tsx
│  │          grpcAppEdit.tsx
│  │          grpcAppInsert.tsx
│  │          grpcAppList.tsx
│  │          
│  ├─component	(组件层)
│  │  ├─app
│  │  │      app_Add.tsx
│  │  │      app_Column.tsx
│  │  │      app_Copy.tsx
│  │  │      app_Edit.tsx
│  │  │      app_Filter.tsx
│  │  │      app_Table.tsx
│  │  │      
│  │  └─appversion
│  │          appversion_Add.tsx
│  │          appversion_Column.tsx
│  │          appversion_Edit.tsx
│  │          appversion_Table.tsx
│  │          
│  └─store	(数据存储代理)
│      ├─app
│      │      model.tsx
│      │      store.tsx
│      │      
│      └─appversion
│              model.tsx
│              store.tsx
│              


```

##  示例效果
![image](https://github.com/ludan3134/iamge/blob/main/projectMockup10.png)
