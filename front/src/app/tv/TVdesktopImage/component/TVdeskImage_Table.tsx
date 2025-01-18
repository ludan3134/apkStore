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
import {grpcTVDeskImageList} from "../api/grpcTVDeskImageList";
import {TVdeskImage_Column} from "./TVdeskImage_Column";

import {TVDesktopImageStoreProxy, useproxy_TVDesktopImageFilter,} from "../store/store";
import {message} from "antd";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../const/alert/store";
import ConfirmDialog from "../../../../const/alert/confirmDialog";
import {authProxy} from "../../../auth/store/store";
import {ActionStore} from "../../../../const/alert/model";
import {StyledTableCell, StyledTableRow} from "../../../../const/tablestyle";
import {Timeformat} from "../../../../const/timeformat";
import {AdvertisementPicture} from "../../../../api/fs/v1/fm_pb";
import {useTranslation} from "react-i18next";
import envUrls from "../../../../const/baseurl";
import {TVdeskImage_Filter} from "./TVdeskImage_Filter";

export default function TVdeskImage_Table() {
    // 刷新页面
    const {t} = useTranslation();
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取本组件权限Id/下级权限
    const {menuId} = useParams();
    var permissions = authProxy.permissions;
    console.log("menuId", menuId);
    const childrenMenu = permissions.filter(
        (option) => option.parentId === Number(menuId),
    );
    // 分页相关
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState<any[]>([]);
    const [count, setCount] = React.useState<any>(0);
    const [selected, setv_tv_fselected] = React.useState<readonly number[]>([]);
    // 删除apk
    const [DeleteRow, setDeleteRow] = useState();
    const [Action, setAction] = useState<ActionStore>();
    // 筛选条件
    var advertisementfilter = useproxy_TVDesktopImageFilter();
    // // 跳转路由
    const navigate = useNavigate();
    // 筛选条件
    // var backgroundfilter = useproxy_BackgroundFilter();
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
            (option) => option.name === "编辑电视桌面广告图片",
        );
        if (foundOption) {
            TVDesktopImageStoreProxy.TVDesktopImageEdit = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    // 删除add
    const handldeleteBackground = async (row: AdvertisementPicture) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除电视桌面广告图片",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中Background";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            row.deleted = true;
            setDeleteRow(row);
            setAction(ActionStore.DeleteTVDeskImage);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            var res = await grpcTVDeskImageList(
                page,
                rowsPerPage,
                authProxy.token,
                advertisementfilter,
            );
            setRows(res.advertisementPictureList);
            setCount(res.pageMeta?.totalRecords);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, refleshPage, advertisementfilter]);

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
        setv_tv_fselected(newSelected);
    };
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setv_tv_fselected(newSelected);
            return;
        }
        setv_tv_fselected([]);
    };
    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            <TVdeskImage_Filter/>
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <TVdeskImage_Column
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
                                    <span>{row.distributorName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.modelName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.name}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.version}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.url}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.md5}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.sort}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <span>{row.filesize.toString()}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Timeformat time={row.created}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Timeformat time={row.updated}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {/*<img*/}
                                    {/*    style={{*/}
                                    {/*        width: "50%", // 设置图片宽度为容器宽度的一半*/}
                                    {/*        height: "auto", // 自动计算图片高度，保持原始宽高比*/}
                                    {/*        borderRadius: "10%", // 设置图片圆角为50%以呈现圆形*/}
                                    {/*    }}*/}
                                    {/*    srcSet={ImgBaseUrl + `${row.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}*/}
                                    {/*    src={ImgBaseUrl + `${row.url}?w=164&h=164&fit=crop&auto=format`}*/}
                                    {/*    alt={row.apkName} // 使用数据行中的 altText 属性作为 alt 文本*/}
                                    {/*    onError={(e) => {*/}
                                    {/*        const img = e.currentTarget*/}
                                    {/*        img.src = "/photo/apk_logo.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x"*/}
                                    {/*    }}*/}
                                    {/*    loading="lazy"*/}
                                    {/*/>*/}
                                    <img
                                        style={{
                                            width: "50%", // 设置图片宽度为容器宽度的一半
                                            height: "auto", // 自动计算图片高度，保持原始宽高比
                                            borderRadius: "10%", // 设置图片圆角为50%以呈现圆形
                                        }}
                                        srcSet={
                                            envUrls.TVImgBaseUrl +
                                            `${row.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`
                                        }
                                        src={
                                            envUrls.TVImgBaseUrl +
                                            `${row.url}?w=164&h=164&fit=crop&auto=format`
                                        }
                                        alt={"图片失踪了"} // 使用数据行中的 altText 属性作为 alt 文本
                                        // onError={(e) => {
                                        //     const img = e.currentTarget
                                        //     img.src = "/photo/apk_logo.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x"
                                        // }}
                                        loading="lazy"
                                    />
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
                                        编辑桌面背景图片
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    {/*<IconButton aria-label="delete" size="large"*/}
                                    {/*            onClick={() => handldeleteBackground(row)}>*/}
                                    {/*    <DeleteIcon color={"error"}/>*/}
                                    {/*</IconButton>*/}
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handldeleteBackground(row)}
                                    >
                                        删除桌面背景图片
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
                                        {t("It is currently in the Desktop Pictures list")}
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
