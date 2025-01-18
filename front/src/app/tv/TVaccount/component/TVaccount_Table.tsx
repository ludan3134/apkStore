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
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import {TVAccountStoreProxy, useproxy_TVAccountFilter} from "../store/store";
import {grpcTVAccountList} from "../api/grpcTVAccountList";
import {TVAccount_Column} from "./TVaccount_Column";
import TVAccount_Filter from "./TVaccount_Filter";
import {message} from "antd";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../const/alert/store";
import {authProxy} from "../../../auth/store/store";
import {ActionStore} from "../../../../const/alert/model";
import {AccountInfo} from "../../../../api/asm/v1/asm_pb";
import {StyledTableCell, StyledTableRow} from "../../../../const/tablestyle";
import ConfirmDialog from "../../../../const/alert/confirmDialog";
import {DistributorInputStoreProxy} from "../../../../const/distributortomodel/store/store";
import TVaccount_updatelotstatus from "./TVaccount_updatelotstatus";

export default function TVAccount_Table() {
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
    var TVAccountfilter = useproxy_TVAccountFilter();

    // // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 编辑apk
    const handleditTVAccount = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑电视终端用户",
        );
        if (foundOption) {
            TVAccountStoreProxy.TVAccountEdit = row;
            DistributorInputStoreProxy.DistributorValue = row.distributorId;
            DistributorInputStoreProxy.ModelValue = row.modelId;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    const handldeleteTVAccountlist = async (selected) => {
        console.log("selected", selected);
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除电视终端用户",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中TVAccount列表";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            setDeleteRow(selected);
            setAction(ActionStore.DeleteTVAccount);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    // 删除apk
    const handldeleteTVAccount = async (row: AccountInfo) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除电视终端用户",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中TVAccount";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            const TVAccountData = [row.id];
            setDeleteRow(TVAccountData);
            setAction(ActionStore.DeleteTVAccount);
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
            var res = await grpcTVAccountList(
                page,
                rowsPerPage,
                TVAccountfilter,
                authProxy.token,
            );
            setRows(res.accountList);
            setCount(res.pageMeta?.totalRecords);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, TVAccountfilter, refleshPage]);

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
            <TVAccount_Filter/>
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <TVAccount_Column
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
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.lotName}</span>
                                </StyledTableCell>
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.boxId}</span>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.stbId}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.distributorName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.modelName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.macString}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.chipIdentity}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {row.storeAuth ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.apkType}</span>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 30}} align="center">
                                    {row.isActive ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {row.isService ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {row.isExpired ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.registerDate.substring(0, 10)}</span>
                                </StyledTableCell>
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.activeDateStart}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 25}} align="center">*/}
                                {/*    <span>{row.activeDays}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 60}} align="center">*/}
                                {/*    <span>{row.createAt.split("")[0]}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 25}} align="center">*/}
                                {/*    <span>{row.updatedAt.split("")[0]}</span>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handleditTVAccount(row)}>*/}
                                    {/*    <EditIcon color={"primary"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handleditTVAccount(row)}
                                    >
                                        编辑电视机用户
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handldeleteTVAccount(row)}>*/}
                                    {/*    <DeleteIcon color={"error"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handldeleteTVAccount(row)}
                                    >
                                        删除电视机用户
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
                                {/*<IconButton aria-label="delete" size="large"*/}
                                {/*            onClick={() => handldeleteTVAccountlist(selected)}>*/}
                                {/*    <DeleteSweepIcon color={"error"}/>*/}
                                {/*</IconButton>*/}
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => handldeleteTVAccountlist(selected)}
                                >
                                    批量删除电视机用户
                                </Button>
                                <TVaccount_updatelotstatus/>
                                <IconButton aria-label="delete" size="large">
                                    <LocationOnIcon color={"disabled"}/>
                                    <Typography
                                        variant="caption"
                                        gutterBottom
                                        display="block"
                                        marginTop={2}
                                    >
                                        当前在 账户列表 列表
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
