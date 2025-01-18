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
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";


import {message} from "antd";

import {ActionStore} from "../../../../../const/alert/model";
import ConfirmDialog from "../../../../../const/alert/confirmDialog";
import {authProxy} from "../../../../auth/store/store";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage} from "../../../../../const/alert/store";
import {Top10ManagerStoreproxy} from "../../store/level1/store";
import {StyledTableCell, StyledTableRow} from "../../../../../const/tablestyle";
import {DistributorInputStoreProxy} from "../../../../../const/distributortomodel/store/store";
import {Top10Manager} from "../../../../../api/ks/v1/km_pb";
import {grpcQueryVodAccount} from "../../api/level1/grpcQueryVodAccount";
import {ModelVodAccount_Column} from "./ModelVodAccount_Column";

export default function TVModelTop10Manager_Table() {
    // 刷新页面
    const {t} = useTranslation();
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
    // // 跳转路由
    const navigate = useNavigate();
    // 筛选条件
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };
    const handlfindsublevel = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "查看点播视频跳转分类页面",
        );
        if (foundOption) {
            Top10ManagerStoreproxy.Top10ManagerFilter = {
                distributorId: row.distributorId,
                modelId: row.modelId,
                comboId: row.comboId
            } as Top10Manager;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("Sem permissão temporária.");
        }
    };
    // 编辑add
    const handleditVodUser = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑点播视频账号",
        );
        if (foundOption) {
            Top10ManagerStoreproxy.Top10ManagerEdit = row;
            DistributorInputStoreProxy.DistributorValue = row.distributorId
            DistributorInputStoreProxy.ModelValue = row.modelId;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("Sem permissão temporária.");
        }
    };

    const handldeleteVodUser = async (row: Top10Manager) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑点播视频账号",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "Yes OR No";
            IsConfirmDialog.content = t(
                "This operation cannot be undone, so please proceed with caution",
            );            // const mainclassData: string[] = [row.id];
            row.deleted = true;
            setDeleteRow(row);
            setAction(ActionStore.DeleteVodAccount);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    React.useEffect(() => {
        const fetchData = async () => {
            var res = await grpcQueryVodAccount(
                page,
                rowsPerPage,
                authProxy.token,
            );
            setRows(res.list);
            setCount(res.pageMeta?.totalRecords);
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
    // 用于筛选

    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>

            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <ModelVodAccount_Column
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
                                    <span>{row.distributorName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.modelName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.comboName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.aliasName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handlfindsublevel(row)}
                                    >
                                        {t("List")}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleditVodUser(row)}
                                    >
                                        {t("edit")}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handldeleteVodUser(row)}
                                    >
                                        {t("delete")}
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
                                <IconButton aria-label="delete" size="large">
                                    <LocationOnIcon color={"disabled"}/>

                                    <Typography
                                        variant="caption"
                                        gutterBottom
                                        display="block"
                                        marginTop={2}
                                    >
                                        {t("当前在点播账号界面")}
                                        {/*{t("distributor")}*/}
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
