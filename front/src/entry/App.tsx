import * as React from "react";
import {RouterProvider} from "react-router-dom";
import {router} from "./routes";
import {hot} from "react-hot-loader/root";
import {message} from "antd";

function App() {
    message.config({
        top: 300, // 可以调整这个值来改变垂直位置
        duration: 2,
        maxCount: 3,
        rtl: true,
        prefixCls: 'my-message',
    });
    return <RouterProvider router={router}/>;
}

export default hot(App);
