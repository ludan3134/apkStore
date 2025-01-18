import * as React from "react";
import {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Checkbox, Stack} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";
import {PortalInfoStoreProxy} from "../store/store";
import {message} from "antd";
import {ActionStore} from "../../../../const/alert/model";
import {authProxy} from "../../../auth/store/store";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../const/alert/store";
import {StyledTableCell, StyledTableRow} from "../../../../const/tablestyle";
import {PortalInfo} from "../../../../api/tv_asm/v1/asm_pb";
import {grpcPortalInfoList} from "../api/grpcServiceList";
import ConfirmDialog from "../../../../const/alert/confirmDialog";
import {PortalInfo_Column} from "./service_Column";
import {grpcServiceDelete} from "../api/grpcServiceDelete";

export default function TVPortalInfo_Table() {
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
    const handleditPortalInfo = async (row: PortalInfo) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑电视机域名",
        );
        if (foundOption) {
            PortalInfoStoreProxy.PortalInfoEdit = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    //
    // const handldeletePortalInfolist = async (selected) => {
    //     let foundOption = childrenMenu.find(option => option.name === "删除终端");
    //     if (foundOption) {
    //         IsConfirmDialog.IsOpen = true
    //         IsConfirmDialog.title = "确认删除选中PortalInfo列表"
    //         IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!"
    //         setDeleteRow(selected)
    //         setAction(ActionStore.DeletePortalInfo)
    //         return true; // 添加返回 true 停止循环
    //     } else {
    //         IsOpenDialog.IsOpen = true
    //         IsOpenDialog.title = "暂无权限"
    //         IsOpenDialog.content = "暂时无删除账户权限,请联系管理员修改!"
    //     }
    // };

    // 删除apk
    const handldeletePortalInfo = async (row: PortalInfo) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除电视机域名",
        );

        if (foundOption) {
            // const PortalInfoData: string[] = [row.id];
            try {
                // 执行数据更新操作
                var response = await grpcServiceDelete(row, authProxy.token);
                if (response.status) {
                    message.success("更新成功");
                    IsConfirmDialog.refleshPage = true;
                }
            } catch (error) {
                message.error("调用接口发生错误");
                return;
            }
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
            var res = await grpcPortalInfoList(page, rowsPerPage, authProxy.token);
            setRows(res.portalList);
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
                <PortalInfo_Column
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
                                {/*    <span>{row.provider}</span>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.serviceType}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.serviceUrl}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {row.isService ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.baseUrl}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.updatedAt}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <IconButton
                                        aria-label="delete"
                                        size="large"
                                        onClick={() => handleditPortalInfo(row)}
                                    >
                                        <EditIcon color={"primary"}/>
                                    </IconButton>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <IconButton
                                        aria-label="delete"
                                        size="large"
                                        onClick={() => handldeletePortalInfo(row)}
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
                        <StyledTableCell style={{width: 30}} align="center">
                            <Stack spacing={2} direction={"row"}>
                                {/*<IconButton aria-label="delete" size="large"*/}
                                {/*            onClick={() => handldeletePortalInfolist(selected)}>*/}
                                {/*    <DeleteSweepIcon color={"error"}/>*/}
                                {/*</IconButton>*/}
                                <IconButton aria-label="delete" size="large">
                                    <LocationOnIcon color={"disabled"}/>
                                    <Typography
                                        variant="caption"
                                        gutterBottom
                                        display="block"
                                        marginTop={2}
                                    >
                                        当前在 电视服务通知 列表
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
