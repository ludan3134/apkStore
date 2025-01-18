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
import {Playback} from "../../../../api/ks/v1/km_pb";
import {message} from "antd";
import {PlaybackStoreProxy, useproxy_PlaybackFilter} from "../store/store";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../const/alert/store";
import {authProxy} from "../../../auth/store/store";
import {ActionStore} from "../../../../const/alert/model";
import {grpcPlaybacklist} from "../api/grpcPlaybacklist";
import ConfirmDialog from "../../../../const/alert/confirmDialog";
import {StyledTableCell, StyledTableRow} from "../../../../const/tablestyle";
import {Playback_Column} from "./playback_Column";
import Playback_bindChannel from "./playback_bindChannel";
import {grpcSyncPlayback} from "../api/grpcSyncPlayback";

export default function Playback_Table() {
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
    var PlaybackFilter = useproxy_PlaybackFilter();
    // 编辑apk
    const handleditplayback = async (row: Playback) => {
        let foundOption = childrenMenu.find((option) => option.name === "编辑回放");
        if (foundOption) {
            PlaybackStoreProxy.PlaybackEdit = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    const handlsynvplayback = async () => {
        var res = await grpcSyncPlayback(authProxy.token);
        if (res.status) {
            message.success("同步成功!");
        } else {
            message.error("同步失败!");
        }
        return true; // 添加返回 true 停止循环
    };
    //
    // const handldeleteplayback = async (selected) => {
    //     // let foundOption = childrenMenu.find(option => option.name === "删除终端");
    //     // if (foundOption) {
    //         IsConfirmDialog.IsOpen = true
    //         IsConfirmDialog.title = "确认删除选中playback列表"
    //         IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!"
    //         setDeleteRow(selected)
    //         setAction(ActionStore.DeletePlayback)
    //         return true; // 添加返回 true 停止循环
    //     // } else {
    //     //     IsOpenDialog.IsOpen = true
    //     //     IsOpenDialog.title = "暂无权限"
    //     //     IsOpenDialog.content = "暂时无删除账户权限,请联系管理员修改!"
    //     // }
    // };

    // 删除apk
    const handldeletePlayback = async (row: Playback) => {
        IsConfirmDialog.IsOpen = true;
        IsConfirmDialog.title = "确认删除选中Playback";
        IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
        setDeleteRow([row.streamId]);
        setAction(ActionStore.DeletePlayback);
        // let foundOption = childrenMenu.find(option => option.name === "删除Playback");
        // if (foundOption) {
        //     IsConfirmDialog.IsOpen = true
        //     IsConfirmDialog.title = "确认删除选中Playback"
        //     IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!"
        //     // row.deleted = true
        //     setDeleteRow(row.channelName)
        //     setAction(ActionStore.DeletePlayback)
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
        console.log("PlaybackFilter", PlaybackFilter);
        const fetchData = async () => {
            var res = await grpcPlaybacklist(
                page,
                rowsPerPage,
                PlaybackFilter,
                authProxy.token,
            );
            setRows(res.playbackList);
            setCount(res.pageMeta?.totalRecords);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, refleshPage, PlaybackFilter]);

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
            {/*<Playback_Filter/>*/}
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <Playback_Column
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
                                    <span>{row.name}</span>
                                </StyledTableCell>

                                <StyledTableCell style={{width: 50}} align="center">
                                    {row.channelList.map((item) => (
                                        <Chip key={item.id} label={item.name}></Chip>
                                    ))}
                                </StyledTableCell>
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.epgChannelId}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.tvArchive}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.categoryId}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.channelList}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    /!*<span>{row.channelList}</span>*!/*/}
                                {/*    {row.channelList.map((category, index) => (*/}
                                {/*        <Chip key={index} label={category.name}></Chip>*/}
                                {/*    ))}*/}
                                {/*    /!*数据正在获取,请稍候.....*!/*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Playback_bindChannel row={row}/>
                                </StyledTableCell>
                                {/*<StyledTableCell style={{width: 30}} align="center">*/}
                                {/*    /!*<IconButton aria-label="delete" size="large"*!/*/}
                                {/*    /!*            onClick={() => handleditplayback(row)}>*!/*/}
                                {/*    /!*    <EditIcon color={"primary"}/>*!/*/}
                                {/*    /!*</IconButton>*!/*/}
                                {/*    <Button variant="contained" size="large" onClick={() => handleditplayback(row)}>*/}
                                {/*        编辑XC映射资源*/}
                                {/*    </Button>*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handldeleteplayback(row)}>*/}
                                    {/*    <DeleteIcon color={"error"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handldeletePlayback(row)}
                                    >
                                        删除Playback
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <StyledTableCell style={{width: 30}} align="center">
                            <Stack direction={"row"}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handlsynvplayback()}
                                >
                                    同步回放
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
