import * as React from "react";
import {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import {Button, Checkbox, Stack} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import {message} from "antd";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../const/alert/store";
import {authProxy} from "../../../../auth/store/store";
import {ActionStore} from "../../../../../const/alert/model";
import {StyledTableCell, StyledTableRow,} from "../../../../../const/tablestyle";
import {AppVersion} from "../../../../../api/ws/v1/wm_pb";
import {AppsverdetailStoreProxy} from "../../store/appversion/store";
import {grpcAppsVersionList} from "../../api/apkversion/grpcAppversionList";
import {Appsversion_Column} from "./appversion_Column";
import ConfirmDialog from "../../../../../const/alert/confirmDialog";

export default function Appsversion_Table() {
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取到AppsId
    const {menuId, id, classX} = useParams();
    // 获取权限菜单
    AppsverdetailStoreProxy.classX = classX;
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
    const [modelName, setmodelName] = React.useState<any>("test");
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 编辑版本信息
    const handleEditAppsversion = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑Apps版本",
        );
        if (foundOption) {
            AppsverdetailStoreProxy.AppVersionEdit = row;
            goto(`${foundOption.url}/${foundOption.id}/${row.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 添加版本信息
    const handleAddAppsversion = async () => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "新增Apps版本",
        );
        if (foundOption) {
            goto(`${foundOption.url}/${id}/${modelName}/${classX}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 删除版本信息
    const [DeleteRow, setDeleteRow] = useState();

    const handldeleteAppsVersion = async (row: AppVersion) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除Apps版本",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中Apps版本列表";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            row.deleted = true;
            setDeleteRow(row);
            setAction(ActionStore.DeleteAppsversion);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
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
            var res = await grpcAppsVersionList(
                id,
                page,
                rowsPerPage,
                authProxy.token,
            );
            setRows(res.apps);
            setCount(res.pageMeta?.totalRecords);
            // setmodelName(res.className)
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

    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            <Table sx={{minWidth: 500}}>
                <Appsversion_Column
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
                                    <span>{row.versionName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<Timeformat time={row.dateReleased}/>*/}
                                    <span>{row.dateReleased}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.changelog}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<span>{row.isLatest}</span>*/}
                                    {row.isLatest ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<span>{row.isPublic}</span>*/}
                                    {row.isPublic ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<span>{row.isPaid}</span>*/}
                                    {row.isPaid ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.filesize}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.url}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<span>{row.forceUninstall}</span>*/}
                                    {row.forceUninstall ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    /!*<span>{row.isShowToolTip}</span>*!/*/}
                                {/*    {row.isShowToolTip ? (*/}
                                {/*        <CheckCircleIcon color="success"/>*/}
                                {/*    ) : (*/}
                                {/*        <CancelIcon color="warning"/>*/}
                                {/*    )}*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 30}} align="center">*/}
                                {/*    /!*<span>{row.forceUpdate}</span>*!/*/}
                                {/*    {row.forceUpdate ? (*/}
                                {/*        <CheckCircleIcon color="success"/>*/}
                                {/*    ) : (*/}
                                {/*        <CancelIcon color="warning"/>*/}
                                {/*    )}*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.savePosition}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.filesize.toString()}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <Timeformat time={row.created}/>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <Timeformat time={row.updated}/>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 30}} align="center">*/}
                                {/*    {row.forceUninstall ? (*/}
                                {/*        <CheckCircleIcon color="success"/>*/}
                                {/*    ) : (*/}
                                {/*        <CancelIcon color="warning"/>*/}
                                {/*    )}*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 25}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handleEditAppsversion(row)}>*/}
                                    {/*    <EditIcon fontSize="inherit" color={"primary"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleEditAppsversion(row)}
                                    >
                                        编辑Apps版本
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handldeleteAppsVersion(row)}>*/}
                                    {/*    <DeleteIcon color={"error"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handldeleteAppsVersion(row)}
                                    >
                                        删除Apps版本
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
                                {/*<IconButton aria-label="delete" size="large" onClick={() => handleAddAppsversion()}>*/}
                                {/*    <PostAddTwoToneIcon color={"primary"}/>*/}
                                {/*</IconButton>*/}
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handleAddAppsversion()}
                                >
                                    添加Apps版本
                                </Button>
                                <IconButton aria-label="delete" size="large">
                                    <LocationOnIcon color={"disabled"}/>
                                    <Typography
                                        variant="caption"
                                        gutterBottom
                                        display="block"
                                        marginTop={2}
                                    >
                                        当前在 AppsVERSION 列表
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
