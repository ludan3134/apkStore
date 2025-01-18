import React, {useEffect, useState} from 'react';
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {Button, Layout, Menu, MenuProps, theme} from 'antd';
import {Outlet, useNavigate} from "react-router-dom";
import {authProxy, useauthmenuProxy} from "../../app/auth/store/store";
import {useTranslation} from "react-i18next";
import ChangeuserPwd_Button from "../../app/system/user/Component/changeuserPwd_Button";
import ChangeLanguage from "../../const/changeLanuage";
import NewIcon from "./newIcon";

const {Header, Sider, Content} = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const convertToMenuItems = (menus, parentId = 1) => {
    const {t} = useTranslation();
    return menus
        .filter(menu => menu.parentId === parentId)
        .map(menu => {
            const item: MenuItem = {
                key: menu.url + "/" + menu.id.toString(),
                icon: <NewIcon icon={menu.icon}/>,
                label: `${t(menu.name)}`,
                children: convertToMenuItems(menus, menu.id), // 递归构建子菜单项
            };
            // 确保子菜单项不为空
            if (item.children.length === 0) {
                delete item.children;
            }
            return item;
        });
};


const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    transition: 'margin-inline-start 10s ease',
};
export default function NewLayout() {

    var menus = useauthmenuProxy();
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    useEffect(() => {
        // 检查用户是否已登录
        if (!authProxy.status) {
            // 如果用户未登录，则导航到登录页面
            goto("/login");
        }
    }, [authProxy.status]); // 依赖项列表，当这些值变化时，useEffect 会重新运行
    const [collapsed, setCollapsed] = useState(false);
    const menuItems = convertToMenuItems(menus);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const onClick = (e) => {
        // 检查 e.key 是否包含 "index"
        if (e.key.includes("index")) {
            // 如果包含 "index"，则跳转到 "index" 页面
            goto("/index");
        } else {
            // 否则，使用 e.key 作为跳转的目标路径
            goto(e.key);
        }
    };


    return (
        <Layout hasSider>
            <Sider style={siderStyle} width={collapsed ? 80 : 320} trigger={null} collapsible collapsed={collapsed} >
                <div className="demo-logo-vertical"/>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={menuItems}
                    onClick={onClick}
                    lang={"en"}
                />
            </Sider>
            <Layout style={{marginInlineStart: collapsed ? 80 : 320}} >
                <Header style={{padding: 0, background: colorBgContainer,transition: 'margin-inline-start 10s ease'}}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <ChangeuserPwd_Button/>
                    <ChangeLanguage/>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    );
};

