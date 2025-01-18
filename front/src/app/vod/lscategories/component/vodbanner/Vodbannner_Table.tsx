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
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import {Image, message} from "antd";
import {IsConfirmDialog, IsOpenDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../const/alert/store";
import {authProxy} from "../../../../auth/store/store";
import {ActionStore} from "../../../../../const/alert/model";
import {StyledTableCell, StyledTableRow,} from "../../../../../const/tablestyle";
import ConfirmDialog from "../../../../../const/alert/confirmDialog";
import {Vodbannner_Column} from "./Vodbannner_Column";
import {VodBanner} from "../../../../../api/ks/v1/km_pb";
import {Timeformat} from "../../../../../const/timeformat";
import {grpcVodbannerList} from "../../api/vodbanner/grpcVodbannerList";
import envUrls from "../../../../../const/baseurl";
import {VodBannerStoreProxy} from "../../store/vodbanner/store";

export default function Vodbannner_Table() {
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取到APkId
    const {menuId, firstId} = useParams();
    // 获取权限菜单
    var permissions = authProxy.permissions;
    const FristTable = permissions.find(
        (option) => option.name === "查看点播一级分类",
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
    const [DeleteRow, setDeleteRow] = useState();
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    const handleEditVod = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑点播轮播图",
        );
        if (foundOption) {
            VodBannerStoreProxy.VodBannerEdit = row;
            goto(`${foundOption.url}/${foundOption.id}/${firstId}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    const handleAddSubCalss = async () => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "新增点播轮播图",
        );
        if (foundOption) {
            goto(`${foundOption.url}/${foundOption.id}/${firstId}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    const handldeleteVod = async (row: VodBanner) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除点播轮播图",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除点播轮播图";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            row.deleted = true
            setDeleteRow(row)
            setAction(ActionStore.DeleteVodBanner);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    const handldeleteVodlist = async (selected) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除二级分类",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中二级分类列表";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            setDeleteRow(selected);
            setAction(ActionStore.DeleteVod);
            return true; // 添加返回 true 停止循环
        } else {
            IsOpenDialog.IsOpen = true;
            IsOpenDialog.title = "暂无权限";
            IsOpenDialog.content = "暂时无删除账户权限,请联系管理员修改!";
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
            const res = await grpcVodbannerList(
                page,
                rowsPerPage,
                authProxy.token,
                parseInt(firstId)
            );
            setRows(res.vodBannerList);
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
        goto(`${FristTable?.url}/${FristTable?.id}`);
    };

    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            <Table sx={{minWidth: 500}}>
                <Vodbannner_Column
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
                                {/*vodType 为 2 时,代表着的是按季度查看*/}
                                <StyledTableCell padding="checkbox" sx={{width: "150px"}}>
                                    <Checkbox
                                        onClick={(event) => console.log("aaa", row)}
                                        color="primary"
                                        checked={isItemSelected}
                                    />
                                </StyledTableCell>

                                <StyledTableCell align="center">
                                    <span>{row.vodName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<span>{row.backdropPath}</span>*/}
                                    <Image
                                        width={200}
                                        src={row.backdropPath}
                                        preview={{scaleStep: 5}}
                                    />
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.pic ? (
                                        <Image
                                            width={200}
                                            src={envUrls.ImgBaseUrl + row.pic}
                                            preview={{scaleStep: 5}}
                                            alt={"图片找不到"}
                                        />
                                    ) : (
                                        <span>{"暂无图片"}</span>
                                    )}

                                    {/*<span>{row.pic}</span>*/}
                                    {/*<Image*/}
                                    {/*    width={200}*/}
                                    {/*    src={envUrls.ImgBaseUrl + row.pic}*/}
                                    {/*    preview={{scaleStep: 5}}*/}
                                    {/*/>*/}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <span>{row.sort}</span>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Timeformat time={row.created}/>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Timeformat time={row.updated}/>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleEditVod(row)}
                                    >
                                        编辑轮播图
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handldeleteVod(row)}
                                    >
                                        删除轮播图
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <StyledTableCell>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleAddSubCalss()}
                            >
                                添加轮播图
                            </Button>
                        </StyledTableCell>

                        <StyledTableCell>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleReturn()}
                            >
                                返回上一级
                            </Button>
                        </StyledTableCell>
                        <StyledTableCell>
                            <IconButton aria-label="delete" size="small">
                                <LocationOnIcon color={"disabled"}/>
                                <Typography variant="caption" gutterBottom display="block">
                                    当前在 点播轮播图片 列表
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
