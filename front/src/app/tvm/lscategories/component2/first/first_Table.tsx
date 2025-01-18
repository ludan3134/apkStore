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
import {grpcfirstList} from "../../api/first/grpcfirstList";
import {First_Column2} from "./first_Column";
import {message} from "antd";
import {ActionStore} from "../../../../../const/alert/model";
import {authProxy} from "../../../../auth/store/store";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../const/alert/store";
import {StyledTableCell, StyledTableRow,} from "../../../../../const/tablestyle";
import ConfirmDialog from "../../../../../const/alert/confirmDialog";
import {MainClass} from "../../../../../api/ks/v1/km_pb";
import {Timeformat} from "../../../../../const/timeformat";
import {MainClassStoreProxy} from "../../store/first/store";
import {grpcfirstCake} from "../../api/first/grpcfirstCake";
import {grpcfirstImportdomainInfo} from "../../api/first/grpcfirstImportdomainInfo";
import envUrls from "../../../../../const/baseurl";
import {grpcExportMainClassByExcel} from "../../api/first/grpcExportMainClassByExcel";
import Typography from "@mui/material/Typography";

export default function First_Table2() {
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
    const handleditmainclass = async (row: MainClass) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑一级分类",
        );
        if (foundOption) {
            MainClassStoreProxy.MainClassEdit = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    const handleExportFile = async () => {
        try {
            const res = await grpcExportMainClassByExcel(selected, authProxy.token);
            window.open(envUrls.ExportAccountFile + res.path)
        } catch (error) {
            console.error("导出文件失败:", error);
            // 这里可以处理错误，例如显示错误消息
        }
    };
    // 查看二级分类
    // 编辑apk
    const handlefindSubClass = async (row: MainClass) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "运维查看二级分类",
        );
        // if (foundOption) {
        //     // console.log("foundOption",foundOption)
        //     goto(`${foundOption.url}/${foundOption.id}/${row.id}`);
        //     return true; // 添加返回 true 停止循环
        // } else {
        //     message.error("暂无权限");
        // }
        // const foundOption = childrenMenu1.find(option => option.name === "运维查看三级分类");
        if (foundOption) {
            goto(`${foundOption.url}/${foundOption.id}/${row.id}/${row.id}/${true}`);
            return true;
        }
        message.error("暂无权限");

    };
    const handleproCake = async (row: MainClass) => {
        var res = await grpcfirstCake(row, authProxy.token);
        if (res.status) {
            message.success("生成缓存成功");
        } else {
            message.error("生成缓存失败");
        }
    };
    const handleimportKSystem = async (row: MainClass) => {
        var res = await grpcfirstImportdomainInfo(row, authProxy.token);
        if (res.status) {
            message.success("导入K系统成功");
        } else {
            message.error("导入K系统失败");
        }
    };
    //
    // const handldeletemainclasslist = async (selected) => {
    //     let foundOption = childrenMenu.find(option => option.name === "删除一级分类");
    //     if (foundOption) {
    //         IsConfirmDialog.IsOpen = true
    //         IsConfirmDialog.title = "确认删除选中一级分类列表"
    //         IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!"
    //         setDeleteRow(selected)
    //         setAction(ActionStore.DeleteMainClass)
    //         return true; // 添加返回 true 停止循环
    //     } else {
    //         IsOpenDialog.IsOpen = true
    //         IsOpenDialog.title = "暂无权限"
    //         IsOpenDialog.content = "暂时无删除账户权限,请联系管理员修改!"
    //     }
    // };

    // 删除apk
    const handldeletemainclass = async (row: MainClass) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除一级分类",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中一级分类";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            // const mainclassData: string[] = [row.id];
            row.deleted = true;
            setDeleteRow(row);
            setAction(ActionStore.DeleteMainClass);
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
            var res = await grpcfirstList(page, rowsPerPage, authProxy.token);
            setRows(res.mainClassList);
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
                <First_Column2
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
                                {/*<StyledTableCell padding="checkbox">*/}
                                {/*    <Checkbox*/}
                                {/*        onClick={(event) => console.log("aaa", row)}*/}
                                {/*        color="primary"*/}
                                {/*        checked={isItemSelected}*/}
                                {/*    />*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.sort}</span>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Button variant="text" onClick={() => handlefindSubClass(row)}>{row.listName}</Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.comboName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Timeformat time={row.created}/>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
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
