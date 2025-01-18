import * as React from "react";
import {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import {Checkbox, Chip, Stack} from "@mui/material";
import {grpcUserList} from "../api/grpcUserList";
import {authProxy} from "../../../auth/store/store";
import EditIcon from "@mui/icons-material/Edit";
import {useNavigate, useParams} from "react-router-dom";
import {UserlistStoreProxy} from "../store/store";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import {User_Column} from "./user_Column";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import Adduser_Button from "./adduser_Button";
import {StyledTableCell, StyledTableRow} from "../../../../const/tablestyle";
import TableRow from "@mui/material/TableRow";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../const/alert/store";
import {ActionStore} from "../../../../const/alert/model";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ConfirmDialog from "../../../../const/alert/confirmDialog";
import LockResetIcon from "@mui/icons-material/LockReset";
import {message} from "antd";

export default function User_Table() {
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState<any[]>([]);
    const [count, setCount] = React.useState<any>();
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const {menuId} = useParams();
    var permissions = authProxy.permissions;
    const childrenMenu = permissions.filter(
        (option) => option.parentId === Number(menuId),
    );
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 删除apk
    const [DeleteRow, setDeleteRow] = useState();
    const [Action, setAction] = useState<ActionStore>();
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };
    const handleEditUser = async (row) => {
        let foundOption = childrenMenu.find((option) => option.name === "编辑用户");
        if (foundOption) {
            UserlistStoreProxy.editUser = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 新增跳转
    const handleAddUser = () => {
        // return childrenMenu.find(option => option.name === "新增用户")
        return true;
    };
    // 编辑跳转
    const handleDeleteUser = async (row) => {
        let foundOption = childrenMenu.find((option) => option.name === "删除用户");
        if (!foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中用户";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            row.deleted = true;
            setDeleteRow(row);
            setAction(ActionStore.DeleteUser);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 编辑跳转
    const handleResetUser = async (row) => {
        let foundOption = childrenMenu.find((option) => option.name === "重置密码");
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认重置选中用户密码";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            row.deleted = true;
            setDeleteRow(row);
            setAction(ActionStore.ResetUserPwd);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    React.useEffect(() => {
        const fetchData = async () => {
            // await grpcDistributorToModel();
            var res = await grpcUserList(page, rowsPerPage, authProxy.token);
            setRows(res.userList);
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

    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            <Table sx={{minWidth: 500}}>
                <User_Column
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
                                    <span>{row.userName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.roleName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.distributorName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    {row.isUse ? (
                                        <Chip label="启用" color="success"/>
                                    ) : (
                                        <Chip label="禁用" color="error"/>
                                    )}
                                </StyledTableCell>

                                <StyledTableCell style={{width: 25}} align="center">
                                    <IconButton
                                        aria-label="delete"
                                        size="large"
                                        onClick={() => handleEditUser(row)}
                                    >
                                        <EditIcon fontSize="inherit" color={"primary"}/>
                                    </IconButton>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <IconButton
                                        aria-label="delete"
                                        size="large"
                                        onClick={() => handleDeleteUser(row)}
                                    >
                                        <PersonRemoveIcon color={"error"}/>
                                    </IconButton>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <IconButton
                                        aria-label="delete"
                                        size="large"
                                        onClick={() => handleResetUser(row)}
                                    >
                                        <LockResetIcon color={"error"}/>
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <StyledTableCell style={{width: 30}} align="center">
                            <Stack spacing={2} direction={"row"}>
                                {handleAddUser() ? <Adduser_Button/> : null}
                                <IconButton aria-label="delete" size="large">
                                    <LocationOnIcon color={"disabled"}/>
                                    <Typography
                                        variant="caption"
                                        gutterBottom
                                        display="block"
                                        marginTop={2}
                                    >
                                        当前在 查看用户 列表
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
