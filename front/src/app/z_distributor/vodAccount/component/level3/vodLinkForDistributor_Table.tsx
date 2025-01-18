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
import {useTranslation} from "react-i18next";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import {ActionStore} from "../../../../../const/alert/model";
import {StyledTableCell, StyledTableRow} from "../../../../../const/tablestyle";
import ConfirmDialog from "../../../../../const/alert/confirmDialog";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage} from "../../../../../const/alert/store";
import {VodLinkStoreproxy} from "../../store/level3/store";
import {VodLink} from "../../../../../api/ks/v1/km_pb";
import {VodLinkLinkDistributor_Column} from "./vodLinkDistributor_Column";
import {grpcDesktopLinkList} from "../../api/level3/grpcDesktopLinkList";
import {useproxy_Top10ManagerUrl} from "../../store/level1/store";

export default function VodLinkLinkForDistributor_Table() {
    // 刷新页面
    const {t} = useTranslation();
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取本组件权限Id/下级权限
    const {menuId, firstId, secondId} = useParams();
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
    var accountUrl = useproxy_Top10ManagerUrl();
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
    // 编辑add
    const handleditVodLink = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑点播视频桌面推荐链接列表",
        );
        if (foundOption) {
            VodLinkStoreproxy.VodLinkEdit = row;
            goto(`${foundOption.url}/${foundOption.id}/${firstId}/${secondId}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    const handleAddDeskTop = async () => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "新增点播视频桌面推荐链接列表",
        );
        if (foundOption) {
            goto(`${foundOption.url}/${foundOption.id}/${firstId}/${secondId}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    // 删除add
    const handldeleteBackground = async (row: VodLink) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除点播视频桌面推荐链接列表",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "Yes OR No";
            IsConfirmDialog.content = t(
                "This operation cannot be undone, so please proceed with caution",
            );

            const VodLinksecond = [row.id];
            setDeleteRow(VodLinksecond);
            setAction(ActionStore.DeleteVodLinkAccount);
            return true; // 添加返回 true 停止循环
        } else {
            message.error(t("No permissions"));
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            var res = await grpcDesktopLinkList(
                page,
                rowsPerPage,
                parseInt(secondId),
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
    const handleReturn = () => {
        goto(accountUrl[2] + "/" + firstId);
    };
    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>

            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <VodLinkLinkDistributor_Column
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

                                <StyledTableCell style={{width: 50}} component="th" scope="row" align={"center"}>
                                    <span>{row.season}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.episode}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <span>{row.keyword}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <span>{row.link}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handldeleteBackground(row)}>*/}
                                    {/*    <DeleteIcon color={"error"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleditVodLink(row)}
                                    >
                                        {t("edit")}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handldeleteBackground(row)}
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
                        <StyledTableCell style={{width: 30}} align="right">
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => handleAddDeskTop()}
                            >
                                {t("add")}
                            </Button>
                        </StyledTableCell>
                        <StyledTableCell style={{width: 30}} align="left">
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => handleReturn()}
                            >
                                {t("Return to Previous Level")}
                            </Button>
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
