import * as React from "react";
import {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Alert, Button, Checkbox, Stack} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import {StyledTableCell, StyledTableRow} from "../../../../const/tablestyle";
import {Event_Column} from "./event_Column";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../const/alert/store";
import {Event_Filter} from "./event_Filter";
import {grpcEventlist} from "../api/grpcEventlist";
import {authProxy} from "../../../auth/store/store";
import {EventStoreProxy, useproxy_EventFilter} from "../store/store";
import {useNavigate, useParams} from "react-router-dom";
import {TimeComponent} from "../../../../const/timeformat";
import {message} from "antd";

export default function Event_Table() {
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取本组件权限Id/下级权限
    const {menuId} = useParams();
    var permissions = authProxy.permissions;
    const childrenMenu = permissions.filter(
        (option) => option.parentId === Number(menuId),
    );
    // // 分页相关
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState<any[]>([]);
    const [count, setCount] = React.useState<any>(0);
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    var eventFilter = useproxy_EventFilter();
    // // 删除apk
    // const [DeleteRow, setDeleteRow] = useState()
    // const [Action, setAction] = useState<ActionStore>()
    // // 筛选条件
    // var terminalfilter = useproxy_TerminalFilter();
    // // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 编辑apk
    const handleditevent = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑体育赛事",
        );
        // if (row.isUsed) {
        //     IsOpenDialog.IsOpen = true
        //     IsOpenDialog.title = "暂无权限"
        //     IsOpenDialog.content = "该盒子正在使用,无法编辑!"
        //     return
        // }
        if (foundOption) {
            EventStoreProxy.EventEdit = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    // const handldeleteterminallist = async (selected) => {
    //     let foundOption = childrenMenu.find(option => option.name === "删除终端");
    //     if (foundOption) {
    //         IsConfirmDialog.IsOpen = true
    //         IsConfirmDialog.title = "确认删除选中terminal列表"
    //         IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!"
    //         setDeleteRow(selected)
    //         setAction(ActionStore.Deleteterminal)
    //         return true; // 添加返回 true 停止循环
    //     } else {
    //         IsOpenDialog.IsOpen = true
    //         IsOpenDialog.title = "暂无权限"
    //         IsOpenDialog.content = "暂时无删除账户权限,请联系管理员修改!"
    //     }
    // };

    // 删除apk
    const handldeleteterminal = async (row) => {
        // let foundOption = childrenMenu.find(option => option.name === "删除终端");
        // if (foundOption) {
        //     IsConfirmDialog.IsOpen = true
        //     IsConfirmDialog.title = "确认删除选中terminal"
        //     IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!"
        //     const terminalData: string[] = [row.id];
        //     setDeleteRow(terminalData)
        //     setAction(ActionStore.Deleteterminal)
        //     return true; // 添加返回 true 停止循环
        // } else {
        //     IsOpenDialog.IsOpen = true
        //     IsOpenDialog.title = "暂无权限"
        //     IsOpenDialog.content = "暂时无删除账户权限,请联系管理员修改!"
        // }
    };
    // 时间范围
    const [startTime, setStartTime] = useState<number>();
    const [endTime, setEndTime] = useState<number>();
    const [timeError, setTimeError] = useState<boolean>();
    const handleTime = (time1: number, time2: number): boolean => {
        try {
            if (time1 == undefined || time2 == undefined) {
                return true;
            }
            if (time2 > time1) {
                setTimeError(false);
                return true;
            } else {
                setTimeError(true);
                message.error("结束时间不能早于开始时间");
                return false;
            }
        } catch (error) {
            message.error("请选择好时间");
        }
        return false;
    };

    // 时间范围
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };
    const handleStartTime = (time) => {
        setStartTime(time);
        // setSelected(newSelected);
    };
    const handleEndTime = (time) => {
        setEndTime(time);
        // setSelected(newSelected);
    };
    React.useEffect(() => {
        const fetchData = async () => {
            var res = await grpcEventlist(
                page,
                rowsPerPage,
                eventFilter,
                authProxy.token,
            );
            setRows(res.majorEventList);
            setCount(res.pageMeta?.totalRecords);
            handleTime(startTime, endTime);
            console.log("开始时间:", startTime);
            console.log("结束时间:", endTime);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, eventFilter]);

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
            <Event_Filter/>
            {/*<Stack spacing={3} direction={"row"}   divider={<Divider orientation="vertical" flexItem />}>*/}
            {/*        <Datapick lable={"开始时间"} getTime={handleStartTime}/>*/}
            {/*        <Datapick lable={"结束时间"} getTime={handleEndTime}/>*/}
            {/*</Stack>*/}
            {timeError && (
                <Alert severity="error">结束时间不能早于开始时间,请重新选择!</Alert>
            )}
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <Event_Column
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
                                    <span>{row.title}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <TimeComponent
                                        timestamp={row.baseTime}
                                        timezone={Number(row.timezone)}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 80}} align="center">
                                    <img src={row.teams.a?.icon}/>
                                    <br/>
                                    <span>{row.teams.a?.name}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 80}} align="center">
                                    <img src={row.teams.b?.icon}/>
                                    <br/>
                                    <span>{row.teams.b?.name}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.timezone}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handleditevent(row)}>*/}
                                    {/*    <EditIcon color={"primary"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handleditevent(row)}
                                    >
                                        编辑体育赛事
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handldeleteterminal(row)}>*/}
                                    {/*    <DeleteIcon color={"error"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handldeleteterminal(row)}
                                    >
                                        删除体育赛事
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
                                {/*            onClick={() => handldeleteterminallist(selected)}>*/}
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
                                        当前在 赛事 列表
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
