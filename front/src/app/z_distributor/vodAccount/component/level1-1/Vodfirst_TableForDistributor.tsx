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
import {Vodfirst_ColumnForDistributor} from "./Vodfirst_ColumnForDistributor";
import {message} from "antd";
import {ActionStore} from "../../../../../const/alert/model";
import {authProxy} from "../../../../auth/store/store";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../const/alert/store";
import {StyledTableCell, StyledTableRow,} from "../../../../../const/tablestyle";
import ConfirmDialog from "../../../../../const/alert/confirmDialog";
import {VodClass} from "../../../../../api/ks/v1/km_pb";
import {VodClassStoreProxy} from "../../../../vod/lscategories/store/first/store";
import {grpcVodfirstList} from "../../../../vod/lscategories/api/first/grpcVodfirstList";
import {useTranslation} from "react-i18next";
import {grpcPulldata} from "../../api/level1-1/grpcPulldata";
import {useproxy_Top10ManagerFilter, useproxy_Top10ManagerUrl} from "../../store/level1/store";

export default function Vodfirst_TableForDistributor() {
    const {t} = useTranslation();

    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取本组件权限Id/下级权限
    const {menuId} = useParams();
    var permissions = authProxy.permissions;
    const childrenMenu = permissions.filter(
        (option) => option.parentId === Number(menuId),
    );
    var top10ManagerFilter = useproxy_Top10ManagerFilter();
    var vodClass = {comboId: top10ManagerFilter.comboId} as VodClass
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

    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 编辑apk
    const handleditmainclass = async (row: VodClass) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑点播一级分类",
        );
        if (foundOption) {
            VodClassStoreProxy.VodClassEdit = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 查看二级分类
    // 编辑apk
    const handlefindSubClass = async (row: VodClass) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "查看点播视频桌面推荐列表",
        );
        if (foundOption) {
            goto(`${foundOption.url}/${foundOption.id}/${row.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    // 删除apk
    const handldeletemainclass = async (row: VodClass) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除点播一级分类",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中一级分类";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            // const mainclassData: string[] = [row.id];
            row.deleted = true;
            setDeleteRow(row);
            setAction(ActionStore.DeleteVodClass);
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
            var res = await grpcVodfirstList(page, rowsPerPage, authProxy.token, vodClass);
            setRows(res.vodClassList);
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
        console.log("accountUrl", accountUrl)
        goto(accountUrl[0]);
    };
    const handlePulldata = async () => {
        var res = await grpcPulldata(authProxy.token, top10ManagerFilter.comboId)
        if (res.status) {
            message.success("拉取成功")
        } else {
            message.error("拉取失败")
        }
    };
    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <Vodfirst_ColumnForDistributor
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
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handlefindSubClass(row)}
                                    >
                                        {t("List")}
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
                                {/*<Button variant="contained" size="small" onClick={() => handldeletemainclasslist(selected)}>*/}
                                {/*    删除*/}
                                {/*</Button>*/}
                                <IconButton aria-label="delete" size="large">
                                    <LocationOnIcon color={"disabled"}/>
                                    <Typography
                                        variant="caption"
                                        gutterBottom
                                        display="block"
                                        marginTop={2}
                                    >
                                        {t("List")}
                                    </Typography>
                                </IconButton>
                            </Stack>
                        </StyledTableCell>

                        <StyledTableCell>
                            <Stack spacing={2} direction={"row"}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => handleReturn()}
                                >
                                    {t("Return to Previous Level")}
                                </Button>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => handlePulldata()}
                                >
                                    {t("pullData")}
                                </Button>
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
