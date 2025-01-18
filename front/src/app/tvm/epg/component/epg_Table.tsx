import * as React from "react";
import {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Button, Checkbox, Chip, Stack} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import {Epg} from "../../../../api/ks/v1/km_pb";
import {message} from "antd";
import {EpgStoreProxy, useproxy_EpgFilter} from "../store/store";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../const/alert/store";
import {authProxy} from "../../../auth/store/store";
import {ActionStore} from "../../../../const/alert/model";
import {grpcEpglist} from "../api/grpcEpglist";
import ConfirmDialog from "../../../../const/alert/confirmDialog";
import {Epg_Column} from "./epg_Column";
import {StyledTableCell, StyledTableRow} from "../../../../const/tablestyle";
import Epg_Filter from "./epg_Filter";
import Epg_bindChannel from "./epg_bindChannel";

export default function Epg_Table() {
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
    var epgFilter = useproxy_EpgFilter();
    // 编辑apk
    const handleditxcombo = async (row: Epg) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑套餐资源",
        );
        if (foundOption) {
            EpgStoreProxy.EpgEdit = row;
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
    const handldeleteEpg = async (row: Epg) => {
        IsConfirmDialog.IsOpen = true;
        IsConfirmDialog.title = "确认删除选中EPG";
        IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
        // row.deleted = true
        setDeleteRow(row.channelName);
        setAction(ActionStore.DeleteEPG);
        // let foundOption = childrenMenu.find(option => option.name === "删除Epg");
        // if (foundOption) {
        //     IsConfirmDialog.IsOpen = true
        //     IsConfirmDialog.title = "确认删除选中EPG"
        //     IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!"
        //     // row.deleted = true
        //     setDeleteRow(row.channelName)
        //     setAction(ActionStore.DeleteEPG)
        //     return true; // 添加返回 true 停止循环
        // } else {
        //     message.error("暂无权限")
        // }
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    React.useEffect(() => {
        console.log("epgFilter", epgFilter);
        const fetchData = async () => {
            var res = await grpcEpglist(
                page,
                rowsPerPage,
                epgFilter,
                authProxy.token,
            );
            setRows(res.epgList);
            setCount(res.pageMeta?.totalRecords);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, refleshPage, epgFilter]);

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
            <Epg_Filter/>
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <Epg_Column
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
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.id}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.paradeTimestamp}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.paradeName}</span>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.channelName}</span>
                                </StyledTableCell>
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.endTimestamp}</span>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<span>{row.channelList}</span>*/}
                                    {row.channelList.map((category, index) => (
                                        <Chip key={index} label={category.name}></Chip>
                                    ))}
                                    {/*数据正在获取,请稍候.....*/}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Epg_bindChannel row={row}/>
                                </StyledTableCell>
                                {/*<StyledTableCell style={{width: 30}} align="center">*/}
                                {/*    /!*<IconButton aria-label="delete" size="large"*!/*/}
                                {/*    /!*            onClick={() => handleditnotification(row)}>*!/*/}
                                {/*    /!*    <EditIcon color={"primary"}/>*!/*/}
                                {/*    /!*</IconButton>*!/*/}
                                {/*    <Button variant="contained" size="large" onClick={() => handleditxcombo(row)}>*/}
                                {/*        编辑XC映射资源*/}
                                {/*    </Button>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handldeletenotification(row)}>*/}
                                    {/*    <DeleteIcon color={"error"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handldeleteEpg(row)}
                                    >
                                        删除EPG
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
                                {/*            onClick={() => handldeletenotificationlist(selected)}>*/}
                                {/*    <DeleteSweepIcon color={"error"}/>*/}
                                {/*</IconButton>*/}
                                {/*<BindChannel/>*/}
                                <IconButton aria-label="delete" size="large">
                                    <LocationOnIcon color={"disabled"}/>
                                    <Typography
                                        variant="caption"
                                        gutterBottom
                                        display="block"
                                        marginTop={2}
                                    >
                                        当前在 EPG 列表
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
