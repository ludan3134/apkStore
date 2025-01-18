import * as React from "react";
import {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Button, Checkbox, Stack, TextField} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import {TerminalStoreProxy, useproxy_TerminalFilter} from "../store/store";
import {grpcTerminalList} from "../api/grpcTerminalList";
import Terminal_Filter from "./terminal_Filter";
import {Terminal_Column} from "./terminal_Column";

import {message} from "antd";
import {ActionStore} from "../../../../const/alert/model";
import {authProxy} from "../../../auth/store/store";
import {IsConfirmDialog, IsOpenDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../const/alert/store";
import {StyledTableCell, StyledTableRow} from "../../../../const/tablestyle";
import {TerminalInfo} from "../../../../api/asm/v1/asm_pb";
import ConfirmDialog from "../../../../const/alert/confirmDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import Terminal_updatelotstatus from "./terminal_updatelotstatus";
import {DistributorInputStoreProxy} from "../../../../const/distributortomodel/store/store";
import {MyTablePaginationActions} from "../../../../const/pagenation";

const CustomPageInput = (prop: any) => (
    <TextField
        id="standard-basic"
        label="请输入页码"
        variant="standard"
        type="number"
    />
);


export default function Terminal_Table() {
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
    var terminalfilter = useproxy_TerminalFilter();
    // // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 编辑apk
    const handleditterminal = async (row: TerminalInfo) => {
        let foundOption = childrenMenu.find((option) => option.name === "编辑终端");
        if (row.isUsed) {
            message.error("该盒子正在使用,无法编辑");

            return;
        }
        if (foundOption) {
            TerminalStoreProxy.TerminalEdit = row;
            DistributorInputStoreProxy.DistributorValue = row.distributorId;
            DistributorInputStoreProxy.ModelValue = row.modelId;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    const handldeleteterminallist = async (selected) => {
        let foundOption = childrenMenu.find((option) => option.name === "删除终端");
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中terminal列表";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            setDeleteRow(selected);
            setAction(ActionStore.Deleteterminal);
            return true; // 添加返回 true 停止循环
        } else {
            IsOpenDialog.IsOpen = true;
            IsOpenDialog.title = "暂无权限";
            IsOpenDialog.content = "暂时无删除账户权限,请联系管理员修改!";
        }
    };

    // 删除apk
    const handldeleteterminal = async (row: TerminalInfo) => {
        if (row.isUsed) {
            message.error("该盒子正在被使用,无法删除");
            return;
        }
        let foundOption = childrenMenu.find((option) => option.name === "删除终端");
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中terminal";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            const terminalData: string[] = [row.id];
            setDeleteRow(terminalData);
            setAction(ActionStore.Deleteterminal);
            return true; // 添加返回 true 停止循环
        } else {
            IsOpenDialog.IsOpen = true;
            IsOpenDialog.title = "暂无权限";
            IsOpenDialog.content = "暂时无删除账户权限,请联系管理员修改!";
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
            var res = await grpcTerminalList(
                page,
                rowsPerPage,
                terminalfilter,
                authProxy.token,
            );
            setRows(res.terminalList);
            setCount(res.pageMeta?.totalRecords);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, terminalfilter, refleshPage]);

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
            <Terminal_Filter/>
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <Terminal_Column
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
                                {/*<StyledTableCell style={{width: 50}} component="th" scope="row" align={"center"}>*/}
                                {/*    <span>{row.id}</span>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.macString}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.chipIdentity}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.serial}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.lotName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.boxId}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.accountId}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {row.isUsed ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>

                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.activeCode}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.distributorName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.modelName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 20}} align="center">
                                    {row.storeAuth ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 20}} align="center">
                                    {row.setActive ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 20}} align="center">
                                    {row.setService ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>

                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.updatedAt}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<IconButton aria-label="delete" size="large" onClick={() => handleditterminal(row)}>*/}
                                    {/*    <EditIcon color={"primary"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleditterminal(row)}
                                    >
                                        编辑终端
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <IconButton
                                        aria-label="delete"
                                        size="large"
                                        onClick={() => handldeleteterminal(row)}
                                    >
                                        <DeleteIcon color={"error"}/>
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <Terminal_updatelotstatus/>
                        <StyledTableCell style={{width: 30}} align="center">
                            <Stack spacing={2} direction={"row"}>
                                {/*<IconButton aria-label="delete" size="large"*/}
                                {/*            onClick={() => handldeleteterminallist(selected)}>*/}
                                {/*    /!*<DeleteSweepIcon color={"error"}/>*!/*/}

                                {/*</IconButton>*/}
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handldeleteterminallist(selected)}
                                >
                                    批量删除终端
                                </Button>
                                {/*<IconButton aria-label="delete" size="large">*/}
                                {/*    <LocationOnIcon color={"disabled"}/>*/}
                                {/*    <Typography variant="caption" gutterBottom display="block" marginTop={2}>*/}
                                {/*        当前在 终端 列表*/}
                                {/*    </Typography>*/}
                                {/*</IconButton>*/}
                            </Stack>

                        </StyledTableCell>


                        {/*<StyledTableCell align="right" style={{width: 30}} colSpan={12}>*/}
                        {/*    <TextField id="standard-basic" label="请输入页码" variant="standard" value={page+1} type={"number"}   onChange={(event: React.ChangeEvent<HTMLInputElement>) => {*/}
                        {/*        setPage(event.target.valueAsNumber);*/}
                        {/*    }}/>*/}
                        {/*</StyledTableCell>*/}
                        <TablePagination
                            count={count} //必填
                            rowsPerPage={rowsPerPage} //必填
                            page={page} //必填
                            onPageChange={handleChangePage} //必填
                            ActionsComponent={MyTablePaginationActions}
                            rowsPerPageOptions={[]}
                            showFirstButton={true}
                            showLastButton={true}
                        />


                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
