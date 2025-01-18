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
import {message} from "antd";
import {grpcResourceList} from "../api/grpcResourceList";
import {Resource_Column} from "./resource_Column";
import {ResourceStoreproxy} from "../store/store";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../const/alert/store";
import {ActionStore} from "../../../../const/alert/model";
import {authProxy} from "../../../auth/store/store";
import {StyledTableCell, StyledTableRow} from "../../../../const/tablestyle";
import ConfirmDialog from "../../../../const/alert/confirmDialog";
import {DownloadConfig} from "../../../../api/ta/v1/tam_pb";

export default function Resource_Table() {
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
    const handleditDownloadConfig = async (row: DownloadConfig) => {
        let foundOption = childrenMenu.find((option) => option.name === "编辑配置");
        if (foundOption) {
            ResourceStoreproxy.ResourceEdit = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    //
    // const handldeletenotificationlist = async (selected) => {
    //     let foundOption = childrenMenu.find(option => option.name === "删除终端");
    //     if (foundOption) {
    //         IsConfirmDialog.IsOpen = true
    //         IsConfirmDialog.title = "确认删除选中notification列表"
    //         IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!"
    //         setDeleteRow(selected)
    //         setAction(ActionStore.Deletenotification)
    //         return true; // 添加返回 true 停止循环
    //     } else {
    //         IsOpenDialog.IsOpen = true
    //         IsOpenDialog.title = "暂无权限"
    //         IsOpenDialog.content = "暂时无删除账户权限,请联系管理员修改!"
    //     }
    // };

    // 删除apk
    const handldeleteResource = async (row: DownloadConfig) => {
        let foundOption = childrenMenu.find((option) => option.name === "删除配置");
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中配置";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            setDeleteRow(row.id);
            setAction(ActionStore.DeleteResource);
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
            var res = await grpcResourceList(page, rowsPerPage, authProxy.token);
            setRows(res.downloadConfigList);
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
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <Resource_Column
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
                                    <span>{row.id}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.domain}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handleditDownloadConfig(row)}
                                    >
                                        编辑
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handldeleteResource(row)}
                                    >
                                        删除
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
                                        当前在 TVM配置 列表
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
