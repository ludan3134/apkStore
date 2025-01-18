import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {zhCN} from "@mui/x-data-grid";
import App from "./entry/App";
import {ConfigProvider, message} from "antd";
import {ComponentStyleConfig} from "antd/es/config-provider/context";

const rootNode = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootNode);
// 挂载中文主题
const theme = createTheme(
    {
        palette: {
            primary: {main: "#1976d2"},
        },
    },
    zhCN,
);


root.render(
    <ConfigProvider direction="rtl"  >
        <ThemeProvider theme={theme}>
            <App/>
        </ThemeProvider>,
    </ConfigProvider>
);
