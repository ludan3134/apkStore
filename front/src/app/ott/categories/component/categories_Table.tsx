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
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../const/alert/store";
import {authProxy} from "../../../auth/store/store";
import {ActionStore} from "../../../../const/alert/model";
import {HomeBackgroundImage} from "../../../../api/fs/v1/fm_pb";
import {ApkCategoryStoreProxy, useproxy_ApkCategorysFilter, useproxy_ApkCategorytableUrl,} from "../store/store";
import {StyledTableCell, StyledTableRow} from "../../../../const/tablestyle";
import ConfirmDialog from "../../../../const/alert/confirmDialog";
import {grpcApkCategoryList} from "../api/grpcCategoriesList";
import {ApkCategory_Column} from "./categories_Column";

export default function ApkCategory_Table() {
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取本组件权限Id/下级权限
    const {menuId} = useParams();
    var permissions = authProxy.permissions;
    const childrenMenu = permissions.filter(
        (option) => option.parentId === Number(menuId),
    );
    var apkCategorytableUrl = useproxy_ApkCategorytableUrl();
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
    var ApkCategorysFilter = useproxy_ApkCategorysFilter();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };
    // 编辑add
    const handleditBackground = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑Apk类型",
        );
        if (foundOption) {
            ApkCategoryStoreProxy.ApkCategoryEdit = row;
            ApkCategoryStoreProxy.ApkCategoryFilter.parentId = row.parentId
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    const handlefindSubCategory = async (row) => {
        ApkCategoryStoreProxy.ApkCategoryFilter.parentId = row.id
        IsConfirmDialog.refleshPage = true;
    };
    // 删除add
    const handldeleteBackground = async (row: HomeBackgroundImage) => {
        IsConfirmDialog.IsOpen = true;
        IsConfirmDialog.title = "确认删除选中菜单分类";
        IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
        row.deleted = true;
        setDeleteRow(row);
        setAction(ActionStore.DeleteApkCategory);
        return true; // 添加返回 true 停止循环
    };

    React.useEffect(() => {
        const fetchData = async () => {
            var res = await grpcApkCategoryList(
                page,
                rowsPerPage,
                authProxy.token,
                ApkCategorysFilter,
            );
            setRows(res.apkCategoryList);
            setCount(res.pageMeta?.totalRecords);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, refleshPage, ApkCategorysFilter]);

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
        goto(apkCategorytableUrl);
    };
    const handleAddCategory = () => {
        let foundOption = permissions.find(
            (option) => option.name === "新增Apk类型",
        );
        if (foundOption) {
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            {/*<ApkCategory_Filter/>*/}
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <ApkCategory_Column
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
                                    <span>{row.id}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.categoryName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.sort}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handleditBackground(row)}
                                    >
                                        编辑菜单分类
                                    </Button>
                                </StyledTableCell>
                                {!ApkCategorysFilter.parentId && (
                                    <StyledTableCell style={{width: 30}} align="center">
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={() => handlefindSubCategory(row)}
                                        >
                                            查看子级分类
                                        </Button>
                                    </StyledTableCell>
                                )}
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handldeleteBackground(row)}
                                    >
                                        删除菜单分类
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
                                        当前在 终端 列表
                                    </Typography>
                                </IconButton>

                                {ApkCategorysFilter.parentId && (
                                    <>
                                        <Button variant="contained" size="large" onClick={() => handleAddCategory()}>
                                            新增子类菜单
                                        </Button>
                                        <Button variant="contained" size="large" onClick={() => handleReturn()}>
                                            返回上一级
                                        </Button>
                                    </>
                                )}
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
