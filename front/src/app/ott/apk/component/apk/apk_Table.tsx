import * as React from "react";
import {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Button, Checkbox, Stack} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import {ApkStoreProxy, useproxy_ApkFilter} from "../../store/apk/store";
import {grpcApkList} from "../../api/apk/grpcApkList";
import Apk_Filter from "./apk_Filter";
import {Apk_Column} from "./apk_Column";
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import Apk_Copy from "./apk_Copy";
import {Image, message, Switch} from "antd";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../const/alert/store";
import {authProxy} from "../../../../auth/store/store";
import {Apk} from "../../../../../api/fs/v1/fm_pb";
import {ActionStore} from "../../../../../const/alert/model";
import {Timeformat} from "../../../../../const/timeformat";
import {StyledTableCell, StyledTableRow,} from "../../../../../const/tablestyle";
import {grpcApkEdit} from "../../api/apk/grpcApkEdit";
import {DistributorInputStoreProxy} from "../../../../../const/distributortomodel/store/store";
import envUrls from "../../../../../const/baseurl";
import ConfirmDialog from "../../../../../const/alert/confirmDialog";

export default function Apk_Table() {
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
    // 删除apk
    const [DeleteRow, setDeleteRow] = useState();
    const [Action, setAction] = useState<ActionStore>();
    // 筛选条件
    var apkfilter = useproxy_ApkFilter();
    // // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 查找版本
    const handlefindApkversion = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "查看APK版本",
        );
        if (foundOption) {
            goto(`${foundOption.url}/${foundOption.id}/${row.id}`);
        } else {
            message.error("暂无权限");
        }
    };
    // 编辑apk
    const handleditApk = async (row) => {
        let foundOption = childrenMenu.find((option) => option.name === "编辑APK");
        if (foundOption) {
            ApkStoreProxy.ApkEdit = row;
            DistributorInputStoreProxy.DistributorValue = row.distributorId;
            DistributorInputStoreProxy.ModelValue = row.modelId;
            goto(`${foundOption.url}/${foundOption.id}/${row.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    const handldeleteApklist = async (selected) => {
        let foundOption = childrenMenu.find((option) => option.name === "删除APK");
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中Apk列表";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            setDeleteRow(selected);
            setAction(ActionStore.DeleteApks);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    // 删除apk
    const handldeleteApk = async (row: Apk) => {
        let foundOption = childrenMenu.find((option) => option.name === "删除APK");
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中Apk";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            row.deleted = true;
            setDeleteRow(row);
            setAction(ActionStore.DeleteApk);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    const handleisShowOnMarket = async (row: Apk, checked: boolean) => {
        // console.log("checked",checked)
        row.isShowOnMarket = checked;
        var res = await grpcApkEdit(row, authProxy.token);
        if (res.status) {
            message.success("更新发布市场状态成功!");
        } else {
            message.error("更新发布市场状态失败!");
            IsConfirmDialog.refleshPage = true;
        }
    };
    const handleisShowBanner = async (row: Apk, checked: boolean) => {
        // console.log("checked",checked)
        row.isShowBanner = checked;
        var res = await grpcApkEdit(row, authProxy.token);
        if (res.status) {
            message.success("更新滚动状态成功!");
        } else {
            message.error("更新发滚动状态失败!");
            IsConfirmDialog.refleshPage = true;
        }
    };
    const handleisShowToolTip = async (row: Apk, checked: boolean) => {
        // console.log("checked",checked)
        row.isShowToolTip = checked;
        var res = await grpcApkEdit(row, authProxy.token);
        if (res.status) {
            message.success("更新提示状态成功!");
        } else {
            message.error("更新提示状态失败!");
            IsConfirmDialog.refleshPage = true;
        }
    };
    const handleisPromptUpdate = async (row: Apk, checked: boolean) => {
        // console.log("checked",checked)
        row.isPromptUpdate = checked;
        var res = await grpcApkEdit(row, authProxy.token);
        if (res.status) {
            message.success("更新提示状态成功!");
        } else {
            message.error("更新提示状态失败!");
            IsConfirmDialog.refleshPage = true;
        }
    };
    // 删除apk
    // const handleCopyApk = async (selected) => {
    //     console.log("AAAselected",selected)
    //     let foundOption = childrenMenu.find(option => option.name === "复制APK");
    //     if (foundOption) {
    //         IsConfirmDialog.IsOpen = true
    //         IsConfirmDialog.title = "确认删除选中Apk"
    //         IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!"
    //         row.deleted = true
    //         setDeleteRow(row)
    //         setAction(ActionStore.DeleteApk)
    //         return true; // 添加返回 true 停止循环
    //     } else {
    //         IsOpenDialog.IsOpen = true
    //         IsOpenDialog.title = "暂无权限"
    //         IsOpenDialog.content = "暂时无删除apk权限,请联系管理员修改!"
    //     }
    // };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    React.useEffect(() => {
        ApkStoreProxy.ApkCopy = [];
        const fetchData = async () => {
            var res = await grpcApkList(
                page,
                rowsPerPage,
                apkfilter,
                authProxy.token,
            );
            setRows(res.apkList);
            setCount(res.pageMeta?.totalRecords);
            setSelected([]);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, apkfilter, refleshPage]);

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
    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
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
            <Apk_Filter/>
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <Apk_Column
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
                                onClick={(event) => handleClick(event, row.id)}
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
                                    <span>{row.name}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.type}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.class}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<img*/}
                                    {/*    style={{*/}
                                    {/*        width: "50%", // 设置图片宽度为容器宽度的一半*/}
                                    {/*        height: "auto", // 自动计算图片高度，保持原始宽高比*/}
                                    {/*        borderRadius: "10%", // 设置图片圆角为50%以呈现圆形*/}
                                    {/*    }}*/}
                                    {/*    srcSet={ImgBaseUrl + `${row.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}*/}
                                    {/*    src={ImgBaseUrl + `${row.img}?w=164&h=164&fit=crop&auto=format`}*/}
                                    {/*    alt={row.apkName} // 使用数据行中的 altText 属性作为 alt 文本*/}
                                    {/*    onError={(e) => {*/}
                                    {/*        const img = e.currentTarget*/}
                                    {/*        img.src = "/photo/apk_logo.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x"*/}
                                    {/*    }}*/}
                                    {/*    loading="lazy"*/}
                                    {/*/>*/}
                                    {/*<img*/}
                                    {/*    style={{*/}
                                    {/*        width: "50%", // 设置图片宽度为容器宽度的一半*/}
                                    {/*        height: "auto", // 自动计算图片高度，保持原始宽高比*/}
                                    {/*        borderRadius: "10%", // 设置图片圆角为50%以呈现圆形*/}
                                    {/*    }}*/}
                                    {/*    srcSet={ImgBaseUrl + `${row.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}*/}
                                    {/*    src={ImgBaseUrl + `${row.img}?w=164&h=164&fit=crop&auto=format`}*/}
                                    {/*    alt={"图片失踪了"} // 使用数据行中的 altText 属性作为 alt 文本*/}
                                    {/*    // onError={(e) => {*/}
                                    {/*    //     const img = e.currentTarget*/}
                                    {/*    //     img.src = "/photo/apk_logo.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x"*/}
                                    {/*    // }}*/}
                                    {/*    loading="lazy"*/}
                                    {/*/>*/}
                                    {/*<Image*/}
                                    {/*    width={200}*/}
                                    {/*    src={*/}
                                    {/*        envUrls.ImgBaseUrl +*/}
                                    {/*        `${row.img}?w=164&h=164&fit=crop&auto=format`*/}
                                    {/*    }*/}
                                    {/*    preview={{scaleStep: 5}}*/}
                                    {/*/>*/}
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
                                    {/*        `${row.bannerImg}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`*/}
                                    {/*    }*/}
                                    {/*    src={*/}
                                    {/*        envUrls.ImgBaseUrl +*/}
                                    {/*        `${row.bannerImg}?w=164&h=164&fit=crop&auto=format`*/}
                                    {/*    }*/}
                                    {/*    alt={row.apkName} // 使用数据行中的 altText 属性作为 alt 文本*/}
                                    {/*    // onError={(e) => {*/}
                                    {/*    //     const img = e.currentTarget*/}
                                    {/*    //     img.src = "/photo/apkBannerimg_notfound.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x"*/}
                                    {/*    // }}*/}
                                    {/*    loading="lazy"*/}
                                    {/*/>*/}
                                    <Image
                                        width={200}
                                        src={envUrls.ImgBaseUrl + row.bannerImg}
                                        preview={{scaleStep: 5}}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.sort}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.categoryName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.star}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.downloadCount}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.distributorName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.modelName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*{row.isShowOnMarket ? (*/}
                                    {/*    <CheckCircleIcon color="success"/>*/}
                                    {/*) : (*/}
                                    {/*    <CancelIcon color="warning"/>*/}
                                    {/*)}*/}
                                    <Switch
                                        checkedChildren="开启"
                                        unCheckedChildren="关闭"
                                        value={row.isShowOnMarket}
                                        onChange={(checked) => handleisShowOnMarket(row, checked)}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*{row.isShowBanner ? (*/}
                                    {/*    <CheckCircleIcon color="success"/>*/}
                                    {/*) : (*/}
                                    {/*    <CancelIcon color="warning"/>*/}
                                    {/*)}*/}
                                    <Switch
                                        checkedChildren="开启"
                                        unCheckedChildren="关闭"
                                        value={row.isShowBanner}
                                        onChange={(checked) => handleisShowBanner(row, checked)}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*{row.isShowToolTip ? (*/}
                                    {/*    <CheckCircleIcon color="success"/>*/}
                                    {/*) : (*/}
                                    {/*    <CancelIcon color="warning"/>*/}
                                    {/*)}*/}
                                    <Switch
                                        checkedChildren="开启"
                                        unCheckedChildren="关闭"
                                        value={row.isShowToolTip}
                                        onChange={(checked) => handleisShowToolTip(row, checked)}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*{row.isShowToolTip ? (*/}
                                    {/*    <CheckCircleIcon color="success"/>*/}
                                    {/*) : (*/}
                                    {/*    <CancelIcon color="warning"/>*/}
                                    {/*)}*/}
                                    <Switch
                                        checkedChildren="开启"
                                        unCheckedChildren="关闭"
                                        value={row.isPromptUpdate}
                                        onChange={(checked) => handleisPromptUpdate(row, checked)}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Timeformat time={row.created}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Timeformat time={row.updated}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {row.apkImg.map((row, index) => (
                                        <Image
                                            width={100}
                                            src={envUrls.ImgBaseUrl + row}
                                            preview={{scaleStep: 5}}
                                        />
                                    ))}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handlefindApkversion(row)}>*/}
                                    {/*    <ViewListIcon fontSize="inherit" color={"info"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handlefindApkversion(row)}
                                    >
                                        查看apk版本
                                    </Button>
                                </StyledTableCell>

                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large" onClick={() => handleditApk(row)}>*/}
                                    {/*    <EditIcon color={"primary"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleditApk(row)}
                                    >
                                        编辑apk
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large" onClick={() => handldeleteApk(row)}>*/}
                                    {/*    <DeleteIcon color={"error"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handldeleteApk(row)}
                                        color={"error"}
                                    >
                                        删除apk
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
                                {/*            onClick={() => handldeleteApklist(selected)}>*/}
                                {/*    <DeleteSweepIcon color={"error"}/>*/}
                                {/*</IconButton>*/}
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handldeleteApklist(selected)}
                                    color={"error"}
                                >
                                    批量删除apk
                                </Button>
                                {/*<Button_addModel/>*/}
                                <Apk_Copy selectedApks={selected}/>

                                <IconButton aria-label="delete" size="large">
                                    <LocationOnIcon color={"disabled"}/>
                                    <Typography
                                        variant="caption"
                                        gutterBottom
                                        display="block"
                                        marginTop={2}
                                    >
                                        当前在 APK 列表
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
