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
import {Image, message} from "antd";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../const/alert/store";
import {authProxy} from "../../../auth/store/store";
import {ActionStore} from "../../../../const/alert/model";
import {HomeBackgroundImage} from "../../../../api/fs/v1/fm_pb";
import {DistributorDetailStoreProxy, useproxy_DistributorDetailsFilter,} from "../store/store";
import {StyledTableCell, StyledTableRow} from "../../../../const/tablestyle";
import ConfirmDialog from "../../../../const/alert/confirmDialog";
import {grpcDistributorDetailList} from "../api/grpcDistributorDetailList";
import {DistributorDetail_Column} from "./DistributorDetail_Column";
import envUrls from "../../../../const/baseurl";
import {DistributorInputStoreProxy} from "../../../../const/distributortomodel/store/store";

export default function DistributorDetail_Table() {
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
    // // 跳转路由
    const navigate = useNavigate();
    // 筛选条件
    var DistributorDetailsFilter = useproxy_DistributorDetailsFilter();
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
            (option) => option.name === "编辑分销商账号信息",
        );
        if (foundOption) {
            DistributorDetailStoreProxy.DistributorDetailEdit = row;
            DistributorInputStoreProxy.DistributorValue = row.distributorId;
            DistributorInputStoreProxy.ModelValue = row.modelId;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    // 删除add
    const handldeleteBackground = async (row: HomeBackgroundImage) => {
        // let foundOption = childrenMenu.find(
        //     (option) => option.name === "删除分销商账号",
        // );
        // if (foundOption) {
        //     IsConfirmDialog.IsOpen = true;
        //     IsConfirmDialog.title = "确认删除选中Background";
        //     IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
        //     row.deleted = true;
        //     setDeleteRow(row);
        //     setAction(ActionStore.DeleteDistributorDetail);
        //     return true; // 添加返回 true 停止循环
        // } else {
        //     message.error("暂无权限");
        // }
        IsConfirmDialog.IsOpen = true;
        IsConfirmDialog.title = "确认删除选中分销商账号";
        IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
        row.deleted = true;
        setDeleteRow(row);
        setAction(ActionStore.DeleteDistributorDetail);
        return true; // 添加返回 true 停止循环
    };

    React.useEffect(() => {
        const fetchData = async () => {
            var res = await grpcDistributorDetailList(
                page,
                rowsPerPage,
                authProxy.token,
                DistributorDetailsFilter,
            );
            setRows(res.distributorDetailList);
            setCount(res.pageMeta?.totalRecords);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, refleshPage, DistributorDetailsFilter]);

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
            {/*<DistributorDetail_Filter/>*/}
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <DistributorDetail_Column
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
                                    <span>{row.distributorName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.modelName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.facebook}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Image
                                        width={300}
                                        src={
                                            envUrls.ImgBaseUrl +
                                            `${row.facebookImg}?w=164&h=164&fit=crop&auto=format`
                                        }
                                        preview={{scaleStep: 5}}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.email}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<span>{row.emailImg}</span>*/}
                                    <Image
                                        width={300}
                                        src={
                                            envUrls.ImgBaseUrl +
                                            `${row.emailImg}?w=164&h=164&fit=crop&auto=format`
                                        }
                                        preview={{scaleStep: 5}}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handleditBackground(row)}>*/}
                                    {/*    <EditIcon color={"primary"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handleditBackground(row)}
                                    >
                                        编辑分销商账号
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handldeleteBackground(row)}>*/}
                                    {/*    <DeleteIcon color={"error"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handldeleteBackground(row)}
                                    >
                                        删除分销商账号
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
