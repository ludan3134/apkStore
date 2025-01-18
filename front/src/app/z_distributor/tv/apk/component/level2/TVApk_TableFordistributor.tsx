import * as React from "react";
import {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Button, Checkbox} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import {TVApk_ColumnFordistributor} from "./TVApk_ColumnFordistributor";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../../const/alert/store";
import {authProxy} from "../../../../../auth/store/store";
import {ActionStore} from "../../../../../../const/alert/model";
import {Image, message, Switch} from "antd";
import ConfirmDialog from "../../../../../../const/alert/confirmDialog";
import {StyledTableCell, StyledTableRow,} from "../../../../../../const/tablestyle";
import {useTranslation} from "react-i18next";

import {Apk} from "../../../../../../api/tv_fs/v1/fm_pb";
import {useproxy_ProvideTemplatetableUrl} from "../../../deskImage/store/level1/store";
import {ApkStoreProxy, useproxy_ApkFilter} from "../../store/level2/store";
import {grpcApkList} from "../../../../../tv/TVapk/api/apk/grpcApkList";
import {Timeformat} from "../../../../../../const/timeformat";
import {grpcTVApkEdit} from "../../../../../tv/TVapk/api/apk/grpcTVApkEdit";
import envUrls from "../../../../../../const/baseurl";

export default function TVApk_TableFordistributor() {
    const {t} = useTranslation();
    var provideTemplatetableUrl = useproxy_ProvideTemplatetableUrl();
    var tvApkFilter = useproxy_ApkFilter();
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
    // // 跳转路由
    const navigate = useNavigate();

    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 编辑apk
    const handledittvApk = async (row: Apk) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑电视Apk",
        );
        if (foundOption) {
            ApkStoreProxy.ApkEdit = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    //
    // const handldeletetvApklist = async (selected) => {
    //     let foundOption = childrenMenu.find(option => option.name === "删除终端");
    //     if (foundOption) {
    //         IsConfirmDialog.IsOpen = true
    //         IsConfirmDialog.title = "确认删除选中tvApk列表"
    //         IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!"
    //         setDeleteRow(selected)
    //         setAction(ActionStore.DeletetvApk)
    //         return true; // 添加返回 true 停止循环
    //     } else {
    //         IsOpenDialog.IsOpen = true
    //         IsOpenDialog.title = "暂无权限"
    //         IsOpenDialog.content = "暂时无删除账户权限,请联系管理员修改!"
    //     }
    // };

    const handleAddApk = async () => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "新增电视Apk",
        );
        if (foundOption) {
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 删除apk
    const handldeleteTVApk = async (row: Apk) => {
        IsConfirmDialog.IsOpen = true;
        IsConfirmDialog.title = "Yes OR No";
        IsConfirmDialog.content = t(
            "This operation cannot be undone, so please proceed with caution",
        );
        row.deleted = true;
        setDeleteRow(row);
        setAction(ActionStore.DeleteTVApk);
        return true; // 添加返回 true 停止循环

        // let foundOption = childrenMenu.find(
        // 	(option) => option.name === "删除电视Apk",
        // );
        // if (foundOption) {
        // 	IsConfirmDialog.IsOpen = true;
        // 	IsConfirmDialog.title = "Yes OR No";
        // 	IsConfirmDialog.content = t(
        // 		"This operation cannot be undone, so please proceed with caution",
        // 	);
        // 	// const tvApkData: string[] = [row.id];
        // 	row.deleted = true;
        // 	setDeleteRow(row);
        // 	setAction(ActionStore.DeleteTVApk);
        // 	return true; // 添加返回 true 停止循环
        // } else {
        // 	message.error("暂无权限");
        // }
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            var res = await grpcApkList(
                page,
                rowsPerPage,
                tvApkFilter,
                authProxy.token,
            );
            setRows(res.apkList);
            setCount(res.pageMeta?.totalRecords);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, refleshPage]);
    const handlefindTVApkversion = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "分销商查看电视Apk版本",
        );
        if (foundOption) {
            goto(`${foundOption.url}/${foundOption.id}/${row.id}`);
        } else {
            message.error("暂无权限");
        }
    };
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
    const handleReturn = () => {
        goto(provideTemplatetableUrl);
    };
    const handleisShowOnMarket = async (row: Apk, checked: boolean) => {
        // console.log("checked",checked)
        row.isShowOnMarket = checked;
        var res = await grpcTVApkEdit(row, authProxy.token);
        if (res.status) {
            message.success(t("更新发布市场状态成功"));
        } else {
            message.error(t("更新发布市场状态失败"));
            IsConfirmDialog.refleshPage = true;
        }
    };
    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <TVApk_ColumnFordistributor
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
                                    <Image
                                        width={200}
                                        src={
                                            envUrls.TVImgBaseUrl +
                                            `${row.img}?w=164&h=164&fit=crop&auto=format`
                                        }
                                        preview={{scaleStep: 5}}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.sort}</span>
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
                                        checkedChildren="ON"
                                        unCheckedChildren="OFF"
                                        value={row.isShowOnMarket}
                                        onChange={(checked) => handleisShowOnMarket(row, checked)}
                                    />
                                </StyledTableCell>
                                {/*<StyledTableCell style={{ width: 30 }} align="center">*/}
                                {/*	/!*{row.isShowBanner ? (*!/*/}
                                {/*	/!*    <CheckCircleIcon color="success"/>*!/*/}
                                {/*	/!*) : (*!/*/}
                                {/*	/!*    <CancelIcon color="warning"/>*!/*/}
                                {/*	/!*)}*!/*/}
                                {/*	<Switch*/}
                                {/*		checkedChildren="开启"*/}
                                {/*		unCheckedChildren="关闭"*/}
                                {/*		value={row.isShowBanner}*/}
                                {/*		// onChange={(checked) => handleisShowBanner(row, checked)}*/}
                                {/*	/>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{ width: 30 }} align="center">*/}
                                {/*	/!*{row.isShowToolTip ? (*!/*/}
                                {/*	/!*    <CheckCircleIcon color="success"/>*!/*/}
                                {/*	/!*) : (*!/*/}
                                {/*	/!*    <CancelIcon color="warning"/>*!/*/}
                                {/*	/!*)}*!/*/}
                                {/*	<Switch*/}
                                {/*		checkedChildren="开启"*/}
                                {/*		unCheckedChildren="关闭"*/}
                                {/*		value={row.isShowToolTip}*/}
                                {/*		// onChange={(checked) => handleisShowToolTip(row, checked)}*/}
                                {/*	/>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Timeformat time={row.created}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Timeformat time={row.updated}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handlefindTVApkversion(row)}>*/}
                                    {/*    <ViewListIcon fontSize="inherit" color={"info"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handlefindTVApkversion(row)}
                                    >
                                        {t("查看电视机APK版本")}
                                    </Button>
                                </StyledTableCell>

                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large" onClick={() => handleditTVApk(row)}>*/}
                                    {/*    <EditIcon color={"primary"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handledittvApk(row)}
                                    >
                                        {t("编辑电视机APK")}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large" onClick={() => handldeleteTVApk(row)}>*/}
                                    {/*    <DeleteIcon color={"error"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handldeleteTVApk(row)}
                                    >
                                        {t("删除电视机APK")}
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <StyledTableCell style={{width: 30}} align="right">
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => handleAddApk()}
                            >
                                {t("add")}
                            </Button>
                        </StyledTableCell>
                        <StyledTableCell style={{width: 30}} align="left">
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => handleReturn()}
                            >
                                {t("Return to Previous Level")}
                            </Button>
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
