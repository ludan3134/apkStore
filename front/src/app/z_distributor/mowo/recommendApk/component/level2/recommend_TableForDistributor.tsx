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
import {Image, message} from "antd";
import {Recommend_ColumnForDistributor} from "./recommend_ColumnForDistributor";

import Recommend_FilterForDistributor from "./recommend_FilterForDistributor";
import {RecommendStoreproxy, useproxy_RecommendFilter, useproxy_RecommendUrl,} from "../../store/level2/store";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../../const/alert/store";
import {authProxy} from "../../../../../auth/store/store";
import {ActionStore} from "../../../../../../const/alert/model";
import {RecommendApk} from "../../../../../../api/ta/v1/tam_pb";
import ConfirmDialog from "../../../../../../const/alert/confirmDialog";
import {StyledTableCell, StyledTableRow,} from "../../../../../../const/tablestyle";
import {grpcRecommendList} from "../../../../../tsv/recommend/api/grpcRecommendList";
import {useTranslation} from "react-i18next";
import envUrls from "../../../../../../const/baseurl";

export default function Recommend_TableForDistributor() {
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    var recommendFilter = useproxy_RecommendFilter();
    const {t} = useTranslation();

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

    // 编辑apk
    const handleditRecommendApk = async (row: RecommendApk) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑分销商下级推荐APK页面",
        );
        if (foundOption) {
            RecommendStoreproxy.RecommendEdit = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("Sem permissão temporária.");
        }
    };
    const handleAddRecommendApk = async () => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "新增分销商下级推荐APK页面",
        );
        if (foundOption) {
            // DesktopImageStoreProxy.DesktopImageEdit = row
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("Sem permissão temporária.");
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
    const handldeleteRecommend = async (row: RecommendApk) => {
        // let foundOption = childrenMenu.find(
        // 	(option) => option.name === "删除APK推荐",
        // );
        // if (foundOption) {
        // 	IsConfirmDialog.IsOpen = true;
        // 	IsConfirmDialog.title = "确认删除选中APK推荐";
        // 	IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
        // 	row.deleted = true;
        // 	setDeleteRow(row);
        // 	setAction(ActionStore.DeleteRecommend);
        // 	return true; // 添加返回 true 停止循环
        // } else {
        // 	message.error("暂无权限");
        // }
        IsConfirmDialog.IsOpen = true;
        IsConfirmDialog.title = "Yes OR No";
        IsConfirmDialog.content = t(
            "This operation cannot be undone, so please proceed with caution",
        );
        row.deleted = true;
        setDeleteRow(row);
        setAction(ActionStore.DeleteRecommend);
        return true; // 添加返回 true 停止循环
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            var res = await grpcRecommendList(
                page,
                rowsPerPage,
                authProxy.token,
                recommendFilter,
            );
            setRows(res.recommendApkList);
            setCount(res.pageMeta?.totalRecords);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, refleshPage, recommendFilter]);

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
    var recommendUrl = useproxy_RecommendUrl();

    const handleReturn = async () => {
        console.log("videoUrl", recommendUrl);
        goto(recommendUrl[1]);
    };
    return (
        <TableContainer component={Paper}>
            <Recommend_FilterForDistributor/>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            <Table sx={{minWidth: 500, marginTop: "10px", marginBottom: "10px"}}>
                <Recommend_ColumnForDistributor
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
                                    {/*<img*/}
                                    {/*	style={{*/}
                                    {/*		width: "50%", // 设置图片宽度为容器宽度的一半*/}
                                    {/*		height: "auto", // 自动计算图片高度，保持原始宽高比*/}
                                    {/*		borderRadius: "10%", // 设置图片圆角为50%以呈现圆形*/}
                                    {/*	}}*/}
                                    {/*	srcSet={*/}
                                    {/*		envUrls.ImgBaseUrl +*/}
                                    {/*		`${row.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`*/}
                                    {/*	}*/}
                                    {/*	src={*/}
                                    {/*		envUrls.ImgBaseUrl + `${row.img}?w=164&h=164&fit=crop&auto=format`*/}
                                    {/*	}*/}
                                    {/*	alt={"图片失踪了"} // 使用数据行中的 altText 属性作为 alt 文本*/}
                                    {/*	// onError={(e) => {*/}
                                    {/*	//     const img = e.currentTarget*/}
                                    {/*	//     img.src = "/photo/apk_logo.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x"*/}
                                    {/*	// }}*/}
                                    {/*	loading="lazy"*/}
                                    {/*/>*/}
                                    <Image
                                        width={300}
                                        src={envUrls.ImgBaseUrl + `${row.img}`}
                                        preview={{scaleStep: 5}}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.packageName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.appName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.sort}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.className}</span>
                                </StyledTableCell>
                                {/*<StyledTableCell style={{ width: 50 }} align="center">*/}
                                {/*	<span>{row.lang}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{ width: 30 }} align="center">*/}
                                {/*	<Autodistributor2model type={3} id={row.id} />*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handleditRecommendApk(row)}
                                    >
                                        {t("edit")}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handldeleteRecommend(row)}
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
                                onClick={() => handleAddRecommendApk()}
                            >
                                {t("add")}
                            </Button>
                        </StyledTableCell>
                        <StyledTableCell style={{width: 30}} align="right">
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
