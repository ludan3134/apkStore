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
import {useTranslation} from "react-i18next";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../../const/alert/store";
import {authProxy} from "../../../../../auth/store/store";
import {ActionStore} from "../../../../../../const/alert/model";
import {HomeBackgroundImage} from "../../../../../../api/fs/v1/fm_pb";
import {Image, message} from "antd";
import {StyledTableCell, StyledTableRow,} from "../../../../../../const/tablestyle";
import {AppBannerStoreProxy, useproxy_AppBannerFilter,} from "../../store/level2/store";
import {grpcmarketImageList} from "../../api/level2/grpcmarketImageList";
import {MarketImageForDistributor_Column} from "./marketImageForDistributor_Column";
import ConfirmDialog from "../../../../../../const/alert/confirmDialog";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {IsUploadFileReset} from "../../../../../../const/uploadfile/store";
import envUrls from "../../../../../../const/baseurl";

export default function MarketImageForDistributor_Table() {
    // 刷新页面
    const {t} = useTranslation();
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    var bannerFilter = useproxy_AppBannerFilter();
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
            (option) => option.name === "编辑市场图片",
        );
        if (foundOption) {
            AppBannerStoreProxy.AppBannerEdit = row;
            IsUploadFileReset.IsReset = false;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    const handleAddBackground = async () => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "新增市场图片",
        );
        if (foundOption) {
            IsUploadFileReset.IsReset = false;
            // DesktopImageStoreProxy.DesktopImageEdit = row
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    // 删除add
    const handldeleteBackground = async (row: HomeBackgroundImage) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除市场图片",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "Yes OR No";
            IsConfirmDialog.content = t(
                "This operation cannot be undone, so please proceed with caution",
            );
            row.deleted = true;
            setDeleteRow(row);
            setAction(ActionStore.DeleteAppBanner);
            return true; // 添加返回 true 停止循环
        } else {
            message.error(t("No permissions"));
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            var res = await grpcmarketImageList(
                page,
                rowsPerPage,
                authProxy.token,
                bannerFilter,
            );
            setRows(res.appBannerList);
            setCount(res.pageMeta?.totalRecords);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, refleshPage, bannerFilter]);

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
                <MarketImageForDistributor_Column
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
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Image
                                        width={300}
                                        src={envUrls.TVImgBaseUrl + `${row.url}`}
                                        preview={{scaleStep: 5}}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <span>{row.sort}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {row.isUse ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>

                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handleditBackground(row)}>*/}
                                    {/*    <EditIcon color={"primary"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleditBackground(row)}
                                    >
                                        {t("edit")}
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
                                        {t("delete")}
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
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handleAddBackground()}
                                >
                                    {t("add")}
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
