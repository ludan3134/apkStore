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
import {Button, Checkbox} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import {message} from "antd";
import {IsConfirmDialog, IsOpenDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../const/alert/store";
import {authProxy} from "../../../../auth/store/store";
import {ActionStore} from "../../../../../const/alert/model";
import {StyledTableCell, StyledTableRow,} from "../../../../../const/tablestyle";
import ConfirmDialog from "../../../../../const/alert/confirmDialog";
import {VodTypeItem} from "../../../../../api/ks/v1/km_pb";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import {VodTypeItemStoreProxy} from "../../store/thirdType/store";
import {grpcTypeThirdList} from "../../api/thirdType/grpcTypeThirdList";
import {VodTypeItem_Column} from "./TypeItem_Column";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";


export default function TypeItem_Table() {
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取到APkId
    const {menuId, firstId, secondId} = useParams();
    // 获取权限菜单
    var permissions = authProxy.permissions;
    const ThirdTable = permissions.find(
        (option) => option.name === "查看点播子类别选项",
    );
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
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 编辑版本信息
    const handleEditVodTypeItem = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑点播子类别选项",
        );
        if (foundOption) {
            VodTypeItemStoreProxy.VodTypeItemEdit = row;
            goto(`${foundOption.url}/${foundOption.id}/${firstId}/${secondId}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 添加版本信息
    const handleAddVodTypeItem = async () => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "新增点播子类别选项",
        );
        if (foundOption) {
            goto(`${foundOption.url}/${foundOption.id}/${firstId}/${secondId}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 删除版本信息
    const [DeleteRow, setDeleteRow] = useState();

    const handldeleteVodTypeItem = async (row: VodTypeItem) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除点播子类别选项",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中点播链接";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            var ids = [];
            ids = [row.id];
            setDeleteRow(ids);
            setAction(ActionStore.DeleteVodTypeItem);
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
            var res = await grpcTypeThirdList(
                authProxy.token,
                parseInt(secondId),
                page,
                rowsPerPage,
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
    const handldeleteVodTypeItemlist = async (selected) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除点播链接链接",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中点播链接列表";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            setDeleteRow(selected);
            setAction(ActionStore.DeleteVodTypeItem);
            return true; // 添加返回 true 停止循环
        } else {
            IsOpenDialog.IsOpen = true;
            IsOpenDialog.title = "暂无权限";
            IsOpenDialog.content = "暂时无删除账户权限,请联系管理员修改!";
        }
    };
    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    const handleReturn = () => {
        goto(`${ThirdTable?.url}/${ThirdTable?.id}/${firstId}`);

    };

    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            <Table sx={{minWidth: 500}}>
                <VodTypeItem_Column
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
                                    <span>{row.name}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.sort}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.num}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {row.isShow ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleEditVodTypeItem(row)}
                                    >
                                        编辑
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handldeleteVodTypeItem(row)}
                                    >
                                        删除点播子分类选项
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <StyledTableCell style={{width: 30}} align="center">
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleAddVodTypeItem()}
                            >
                                添加点播子分类选项
                            </Button>
                        </StyledTableCell>

                        {/*<StyledTableCell style={{width: 30}} align="center">*/}
                        {/*    <Button*/}
                        {/*        variant="contained"*/}
                        {/*        size="small"*/}
                        {/*        onClick={() => handldeleteVodTypeItemlist(selected)}*/}
                        {/*    >*/}
                        {/*        删除点播链接链接*/}
                        {/*    </Button>*/}
                        {/*</StyledTableCell>*/}

                        <StyledTableCell style={{width: 30}} align="center">
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => handleReturn()}
                            >
                                返回上一级
                            </Button>
                        </StyledTableCell>
                        <StyledTableCell style={{width: 30}} align="center">
                            <IconButton aria-label="delete" size="large">
                                <LocationOnIcon color={"disabled"}/>
                                <Typography
                                    variant="caption"
                                    gutterBottom
                                    display="block"
                                    marginTop={2}
                                >
                                    当前在 子类别选项 列表
                                </Typography>
                            </IconButton>
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
