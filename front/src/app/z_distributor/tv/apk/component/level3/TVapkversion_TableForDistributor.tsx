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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import {TVapkversion_ColumnForDistributor} from "./TVapkversion_ColumnForDistributor";
import {message} from "antd";
import {ActionStore} from "../../../../../../const/alert/model";
import {TVApkverdetailStoreProxy} from "../../store/level3/store";
import {ApkDetail} from "../../../../../../api/tv_fs/v1/fm_pb";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../../const/alert/store";
import {grpcApkVersionList} from "../../../../../tv/TVapk/api/apkversion/grpcApkversionList";
import {authProxy} from "../../../../../auth/store/store";
import ConfirmDialog from "../../../../../../const/alert/confirmDialog";
import {StyledTableCell, StyledTableRow,} from "../../../../../../const/tablestyle";
import {Timeformat} from "../../../../../../const/timeformat";
import {useproxy_ApktableUrl} from "../../store/level2/store";
import {useTranslation} from "react-i18next";

export default function TVapkversion_TableForDistributor() {
    const {t} = useTranslation();

    var apktableUrl = useproxy_ApktableUrl();
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取到TVApkId
    const {menuId, id, apkId} = useParams();
    // 获取权限菜单
    var permissions = authProxy.permissions;
    const childrenMenu = permissions.filter(
        (option) => option.parentId === Number(menuId),
    );
    // 分页相关
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState<any[]>([]);
    const [count, setCount] = React.useState<any>();
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    // 操作
    const [Action, setAction] = useState<ActionStore>();

    // 型号名称
    const [modelName, setmodelName] = React.useState<any>();
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 编辑版本信息
    const handleEditTVApkversion = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "分销商编辑电视Apk版本",
        );
        if (foundOption) {
            TVApkverdetailStoreProxy.TVApkdetailEdit = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 添加版本信息
    const handleAddTVApkversion = async () => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "分销商新增电视Apk版本",
        );
        if (foundOption) {
            goto(`${foundOption.url}/${menuId}/${apkId}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 删除版本信息
    const [DeleteRow, setDeleteRow] = useState();

    const handldeleteTVApkVersion = async (row: ApkDetail) => {
        IsConfirmDialog.IsOpen = true;
        IsConfirmDialog.IsOpen = true;
        IsConfirmDialog.title = "Yes OR No";
        IsConfirmDialog.content = t(
            "This operation cannot be undone, so please proceed with caution",
        );
        row.deleted = true;
        setDeleteRow(row);
        setAction(ActionStore.DeleteTVApkversion);
        return true; // 添加返回 true 停止循环
        // let foundOption = childrenMenu.find(
        // 	(option) => option.name === "删除电视APK版本",
        // );
        // if (foundOption) {
        // 	IsConfirmDialog.IsOpen = true;
        // 	IsConfirmDialog.title = "确认删除选中TVApk版本列表";
        // 	IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
        // 	row.deleted = true;
        // 	setDeleteRow(row);
        // 	setAction(ActionStore.DeleteTVApkversion);
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
            // await grpcDistributorToModel();
            var res = await grpcApkVersionList(
                apkId,
                page,
                rowsPerPage,
                authProxy.token,
            );
            setRows(res.apkDetailList);
            setCount(res.pageMeta?.totalRecords);
            setmodelName(res.className);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, refleshPage]);

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
        goto(apktableUrl);
    };
    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            <Table sx={{minWidth: 500}}>
                <TVapkversion_ColumnForDistributor
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
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.version}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.md5}</span>
                                </StyledTableCell>
                                {/*<StyledTableCell style={{ width: 50 }} align="center">*/}
                                {/*	<span>{row.url}</span>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.content}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<span>{row.forceUpdate}</span>*/}
                                    {row.forceUpdate ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                {/*<StyledTableCell style={{ width: 50 }} align="center">*/}
                                {/*	<span>{row.savePosition}</span>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.filesize.toString()}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Timeformat time={row.created}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Timeformat time={row.updated}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {row.forceUninstall ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handleEditTVApkversion(row)}>*/}
                                    {/*    <EditIcon fontSize="inherit" color={"primary"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handleEditTVApkversion(row)}
                                    >
                                        {t("编辑电视机apk版本")}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handldeleteTVApkVersion(row)}>*/}
                                    {/*    <DeleteIcon color={"error"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handldeleteTVApkVersion(row)}
                                    >
                                        {t("删除电视机apk版本")}
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
                                {/*<IconButton aria-label="delete" size="large" onClick={() => handleAddTVApkversion()}>*/}
                                {/*    <PostAddTwoToneIcon color={"primary"}/>*/}
                                {/*</IconButton>*/}
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => handleAddTVApkversion()}
                                >
                                    {t("添加电视机APK版本")}
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handleReturn()}
                                >
                                    {t("Return to Previous Level")}
                                </Button>
                                {/*<IconButton aria-label="delete" size="large">*/}
                                {/*	<LocationOnIcon color={"disabled"} />*/}
                                {/*	<Typography*/}
                                {/*		variant="caption"*/}
                                {/*		gutterBottom*/}
                                {/*		display="block"*/}
                                {/*		marginTop={2}*/}
                                {/*	>*/}
                                {/*		当前在 TVApkVERSION 列表*/}
                                {/*	</Typography>*/}
                                {/*</IconButton>*/}
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
