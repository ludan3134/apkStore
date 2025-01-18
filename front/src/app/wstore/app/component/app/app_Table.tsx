import * as React from "react";
import {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Button, Checkbox, Chip, Stack} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import {Image, message, Switch} from "antd";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../const/alert/store";
import {authProxy} from "../../../../auth/store/store";
import {ActionStore} from "../../../../../const/alert/model";
import {StyledTableCell, StyledTableRow,} from "../../../../../const/tablestyle";
import {Apps} from "../../../../../api/ws/v1/wm_pb";
import {AppsStoreProxy, useproxy_AppsFilter} from "../../store/app/store";
import {grpcAppsList} from "../../api/app/grpcAppList";
import {Apps_Column} from "./app_Column";
import ConfirmDialog from "../../../../../const/alert/confirmDialog";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import App_Filter from "./app_Filter";
import App_Copy from "./app_Copy";
import envUrls from "../../../../../const/baseurl";
import {grpcAppsEdit} from "../../api/app/grpcAppEdit";

export default function Apps_Table() {
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取本组件权限Id/下级权限
    const {menuId} = useParams();
    var permissions = authProxy.permissions;
    const childrenMenu = permissions.filter(
        (option) => option.parentId === Number(menuId),
    );
    // 分页相关
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState<any[]>([]);
    const [count, setCount] = React.useState<any>(0);
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [selectRow, setSelectRow] = useState<readonly Apps[]>([]);

    console.log("selected", selected);
    // 删除Apps
    const [DeleteRow, setDeleteRow] = useState();
    const [Action, setAction] = useState<ActionStore>();
    // 筛选条件
    var Appsfilter = useproxy_AppsFilter();
    // // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 查找版本
    const handlefindAppsversion = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "查看Apps版本",
        );
        if (foundOption) {
            goto(`${foundOption.url}/${foundOption.id}/${row.id}/${row.class}`);
        } else {
            message.error("暂无权限");
        }
    };
    // 编辑Apps
    const handleditApps = async (row) => {
        let foundOption = childrenMenu.find((option) => option.name === "编辑Apps");
        if (foundOption) {
            AppsStoreProxy.AppsEdit = row;
            goto(`${foundOption.url}/${foundOption.id}/${row.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    const handldeleteAppslist = async (selected) => {
        let foundOption = childrenMenu.find((option) => option.name === "删除Apps");
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中Apps列表";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            setDeleteRow(selected);
            // setAction(ActionStore.DeleteAppss)
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    // 删除Apps
    const handldeleteApps = async (row: Apps) => {
        let foundOption = childrenMenu.find((option) => option.name === "删除Apps");
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中Apps";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            row.deleted = true;
            setDeleteRow(row);
            setAction(ActionStore.DeleteApps);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    // 删除Apps
    const handleCopyApps = async (row: Apps) => {
        // let foundOption = childrenMenu.find(option => option.name === "复制Apps");
        // if (foundOption) {
        //     IsConfirmDialog.IsOpen = true
        //     IsConfirmDialog.title = "确认删除选中Apps"
        //     IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!"
        //     row.deleted = true
        //     setDeleteRow(row)
        //     setAction(ActionStore.DeleteApps)
        //     return true; // 添加返回 true 停止循环
        // } else {
        //     IsOpenDialog.IsOpen = true
        //     IsOpenDialog.title = "暂无权限"
        //     IsOpenDialog.content = "暂时无删除Apps权限,请联系管理员修改!"
        // }
    };
    const handleisShowOnMarket = async (row: Apps, checked: boolean) => {
        // console.log("checked",checked)
        row.isShowOnMarket = checked ? 1 : 2; // 直接在这里转换布尔值为数字
        var res = await grpcAppsEdit(row, authProxy.token);
        if (res.status) {
            message.success("更新发布市场状态成功!");
        } else {
            message.error("更新发布市场状态失败!");
            IsConfirmDialog.refleshPage = true;
        }
    };
    const handleisShowToolTip = async (row: Apps, checked: boolean) => {
        // console.log("checked",checked)
        row.isShowToolTip = checked ? 1 : 2; // 直接在这里转换布尔值为数字
        console.log("row.isShowToolTip", row.isShowToolTip);
        var res = await grpcAppsEdit(row, authProxy.token);
        if (res.status) {
            message.success("更新发布市场状态成功!");
        } else {
            message.error("更新发布市场状态失败!");
            IsConfirmDialog.refleshPage = true;
        }
    };
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    React.useEffect(() => {
        AppsStoreProxy.AppsCopy = [];
        const fetchData = async () => {
            var res = await grpcAppsList(
                page,
                rowsPerPage,
                Appsfilter,
                authProxy.token,
            );
            setRows(res.appsList);
            setCount(res.pageMeta?.totalRecords);
            setSelected([]);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, Appsfilter, refleshPage]);

    // const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    //     const selectedIndex = selected.indexOf(id);
    //     let newSelected: readonly number[] = [];
    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, id);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selected.slice(0, selectedIndex),
    //             selected.slice(selectedIndex + 1),
    //         );
    //     }
    //     setSelected(newSelected);
    // };
    const handleClick = (
        event: React.MouseEvent<unknown>,
        id: number,
        row: Apps,
    ) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];
        let newSelectRow: Apps[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
            AppsStoreProxy.AppsCopy.push(row); // 使用push方法将row添加到AppsCopy中
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            AppsStoreProxy.AppsCopy.splice(0, 1); // 使用splice方法移除第一个元素
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            AppsStoreProxy.AppsCopy.pop(); // 使用pop方法移除最后一个元素
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
            AppsStoreProxy.AppsCopy = newSelectRow;
        }
        setSelected(newSelected);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            <App_Filter/>
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <Apps_Column
                    numSelected={selected.length}
                    onSelectAllClick={handleSelectAllClick}
                    rowCount={rows.length}
                />
                <TableBody>
                    {rows.map((row) => {
                        const isItemSelected = isSelected(row.id);

                        return (
                            <StyledTableRow
                                hover
                                onClick={(event) => handleClick(event, row.id, row)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.id}
                                selected={isItemSelected}
                                sx={{cursor: "pointer"}}
                            >
                                <StyledTableCell padding="checkbox">
                                    <Checkbox
                                        onClick={(event) => console.log("aaa", row)}
                                        color="primary"
                                        checked={isItemSelected}
                                    />
                                </StyledTableCell>
                                <StyledTableCell
                                    style={{width: 50}}
                                    component="th"
                                    scope="row"
                                    align={"center"}
                                >
                                    <span>{row.appName}</span>
                                </StyledTableCell>
                                <StyledTableCell
                                    style={{width: 50}}
                                    component="th"
                                    scope="row"
                                    align={"center"}
                                >
                                    <span>{row.class}</span>
                                </StyledTableCell>
                                <StyledTableCell
                                    style={{width: 500}}
                                    component="th"
                                    scope="row"
                                    align={"center"}
                                >
                                    <span>{row.appDescription}</span>
                                </StyledTableCell>
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.appIcon}</span>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<img*/}
                                    {/*    style={{*/}
                                    {/*        width: "50%", // 设置图片宽度为容器宽度的一半*/}
                                    {/*        height: "auto", // 自动计算图片高度，保持原始宽高比*/}
                                    {/*        borderRadius: "10%", // 设置图片圆角为50%以呈现圆形*/}
                                    {/*    }}*/}
                                    {/*    srcSet={*/}
                                    {/*        envUrls.ImgBaseUrl +*/}
                                    {/*        `${row.appIcon}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`*/}
                                    {/*    }*/}
                                    {/*    src={*/}
                                    {/*        envUrls.ImgBaseUrl +*/}
                                    {/*        `${row.appIcon}?w=164&h=164&fit=crop&auto=format`*/}
                                    {/*    }*/}
                                    {/*    alt={row.AppsName} // 使用数据行中的 altText 属性作为 alt 文本*/}
                                    {/*    // onError={(e) => {*/}
                                    {/*    //     const img = e.currentTarget*/}
                                    {/*    //     img.src = "/photo/AppsBannerimg_notfound.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x"*/}
                                    {/*    // }}*/}
                                    {/*    loading="lazy"*/}
                                    {/*/>*/}
                                    <Image
                                        width={200}
                                        src={envUrls.ImgBaseUrl + row.appIcon}
                                        preview={{scaleStep: 5}}
                                    />
                                </StyledTableCell>

                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<img*/}
                                    {/*    style={{*/}
                                    {/*        width: "50%", // 设置图片宽度为容器宽度的一半*/}
                                    {/*        height: "auto", // 自动计算图片高度，保持原始宽高比*/}
                                    {/*        borderRadius: "10%", // 设置图片圆角为50%以呈现圆形*/}
                                    {/*    }}*/}
                                    {/*    srcSet={*/}
                                    {/*        envUrls.ImgBaseUrl +*/}
                                    {/*        `${row.appCarousel}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`*/}
                                    {/*    }*/}
                                    {/*    src={*/}
                                    {/*        envUrls.ImgBaseUrl +*/}
                                    {/*        `${row.appCarousel}?w=164&h=164&fit=crop&auto=format`*/}
                                    {/*    }*/}
                                    {/*    alt={row.AppsName} // 使用数据行中的 altText 属性作为 alt 文本*/}
                                    {/*    // onError={(e) => {*/}
                                    {/*    //     const img = e.currentTarget*/}
                                    {/*    //     img.src = "/photo/AppsBannerimg_notfound.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x"*/}
                                    {/*    // }}*/}
                                    {/*    loading="lazy"*/}
                                    {/*/>*/}
                                    <Image
                                        width={200}
                                        src={envUrls.ImgBaseUrl + row.appCarousel}
                                        preview={{scaleStep: 5}}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.appSort}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    {row.appBanner.map((rowa, index) => (
                                        // <img
                                        //     style={{
                                        //         width: "50%", // 设置图片宽度为容器宽度的一半
                                        //         height: "auto", // 自动计算图片高度，保持原始宽高比
                                        //         borderRadius: "10%", // 设置图片圆角为50%以呈现圆形
                                        //     }}
                                        //     srcSet={
                                        //         envUrls.ImgBaseUrl +
                                        //         `${rowa}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`
                                        //     }
                                        //     src={envUrls.ImgBaseUrl + rowa}
                                        //     alt={row.AppsName} // 使用数据行中的 altText 属性作为 alt 文本
                                        //     // onError={(e) => {
                                        //     //     const img = e.currentTarget
                                        //     //     img.src = "/photo/AppsBannerimg_notfound.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x"
                                        //     // }}
                                        //     loading="lazy"
                                        // />
                                        <Image
                                            width={100}
                                            src={envUrls.ImgBaseUrl + rowa}
                                            preview={{scaleStep: 5}}
                                        />
                                    ))}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<img*/}
                                    {/*    style={{*/}
                                    {/*        width: "50%", // 设置图片宽度为容器宽度的一半*/}
                                    {/*        height: "auto", // 自动计算图片高度，保持原始宽高比*/}
                                    {/*        borderRadius: "10%", // 设置图片圆角为50%以呈现圆形*/}
                                    {/*    }}*/}
                                    {/*    srcSet={*/}
                                    {/*        envUrls.ImgBaseUrl +*/}
                                    {/*        `${row.catPromo}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`*/}
                                    {/*    }*/}
                                    {/*    src={*/}
                                    {/*        envUrls.ImgBaseUrl +*/}
                                    {/*        `${row.catPromo}?w=164&h=164&fit=crop&auto=format`*/}
                                    {/*    }*/}
                                    {/*    alt={row.AppsName} // 使用数据行中的 altText 属性作为 alt 文本*/}
                                    {/*    // onError={(e) => {*/}
                                    {/*    //     const img = e.currentTarget*/}
                                    {/*    //     img.src = "/photo/AppsBannerimg_notfound.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x"*/}
                                    {/*    // }}*/}
                                    {/*    loading="lazy"*/}
                                    {/*/>*/}
                                    <Image
                                        width={200}
                                        src={envUrls.ImgBaseUrl + row.catPromo}
                                        preview={{scaleStep: 5}}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.systemRequirement}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.rating}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {row.categoriesName.map((category, index) => (
                                        <Chip key={index} label={category}></Chip>
                                    ))}
                                </StyledTableCell>

                                <StyledTableCell style={{width: 50}} align="center">
                                    {row.pricePlansName.map((plan, index) => (
                                        <Chip key={index} label={plan}></Chip>
                                    ))}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.distributorName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.modelName}</span>
                                </StyledTableCell>
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.copyrightNotice}</span>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*{row.isShowOnMarket === 1 ? (*/}
                                    {/*	<CheckCircleIcon color="success" />*/}
                                    {/*) : (*/}
                                    {/*	<CancelIcon color="warning" />*/}
                                    {/*)}*/}
                                    <Switch
                                        checkedChildren="开启"
                                        unCheckedChildren="关闭"
                                        value={row.isShowOnMarket === 1}
                                        onChange={(checked) => handleisShowOnMarket(row, checked)}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*{row.isShowOnMarket === 1 ? (*/}
                                    {/*	<CheckCircleIcon color="success" />*/}
                                    {/*) : (*/}
                                    {/*	<CancelIcon color="warning" />*/}
                                    {/*)}*/}
                                    <Switch
                                        checkedChildren="开启"
                                        unCheckedChildren="关闭"
                                        value={row.isShowToolTip === 1}
                                        onChange={(checked) => handleisShowToolTip(row, checked)}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.categoriesId}</span>
                                </StyledTableCell>

                                <StyledTableCell style={{width: 30}} align="center">
                                    {row.isShowToolTip === 1 ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>

                                {/*<StyledTableCell style={{width: 30}} align="center">*/}
                                {/*    {row.isShowBanner ? (*/}
                                {/*        <CheckCircleIcon color="success"/>*/}
                                {/*    ) : (*/}
                                {/*        <CancelIcon color="warning"/>*/}
                                {/*    )}*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 30}} align="center">*/}
                                {/*    {row.isShowToolTip ? (*/}
                                {/*        <CheckCircleIcon color="success"/>*/}
                                {/*    ) : (*/}
                                {/*        <CancelIcon color="warning"/>*/}
                                {/*    )}*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <Timeformat time={row.created}/>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <Timeformat time={row.updated}/>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handlefindAppsversion(row)}>*/}
                                    {/*    <ViewListIcon fontSize="inherit" color={"info"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handlefindAppsversion(row)}
                                    >
                                        查看Apps版本
                                    </Button>
                                </StyledTableCell>

                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large" onClick={() => handleditApps(row)}>*/}
                                    {/*    <EditIcon color={"primary"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleditApps(row)}
                                    >
                                        编辑Apps
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large" onClick={() => handldeleteApps(row)}>*/}
                                    {/*    <DeleteIcon color={"error"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handldeleteApps(row)}
                                    >
                                        删除Apps
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <StyledTableCell style={{width: 30}} align="center">
                            <Stack spacing={2} direction={"row"}>
                                {/*<IconButton aria-label="delete" size="large"*/}
                                {/*            onClick={() => handldeleteAppslist(selected)}>*/}
                                {/*    <DeleteSweepIcon color={"error"}/>*/}
                                {/*</IconButton>*/}
                                {/*<Button variant="contained" size="small" onClick={() => handldeleteAppslist(selected)}>*/}
                                {/*    批量删除Apps*/}
                                {/*</Button>*/}
                                {/*<Button_addModel/>*/}
                                {/*<Apps_Copy/>*/}
                                <App_Copy/>
                                <IconButton aria-label="delete" size="large">
                                    <LocationOnIcon color={"disabled"}/>
                                    <Typography
                                        variant="caption"
                                        gutterBottom
                                        display="block"
                                        marginTop={2}
                                    >
                                        当前在 Apps 列表
                                    </Typography>
                                </IconButton>
                            </Stack>
                        </StyledTableCell>

                        <TablePagination
                            count={count} //必填
                            rowsPerPage={rowsPerPage} //必填
                            page={page} //必填
                            onPageChange={handleChangePage} //必填
                            ActionsComponent={TablePaginationActions}
                            rowsPerPageOptions={[]}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
