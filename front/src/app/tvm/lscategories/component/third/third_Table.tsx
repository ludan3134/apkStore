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
import {message} from "antd";
import {IsConfirmDialog, IsOpenDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../const/alert/store";
import {authProxy} from "../../../../auth/store/store";
import {ActionStore} from "../../../../../const/alert/model";
import {StyledTableCell, StyledTableRow,} from "../../../../../const/tablestyle";
import ConfirmDialog from "../../../../../const/alert/confirmDialog";
import {Third_Column} from "./third_Column";
import {ThirdCalssStoreProxy, useproxy_ThirdCalssFilter,} from "../../store/third/store";
import {Channel} from "../../../../../api/ks/v1/km_pb";
import {grpcthirdList} from "../../api/third/grpcthirdList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ChannelBindEpg from "./channel_bindEpg";
import Third_Filter from "./third_Filter";
import {grpcThirdEditList} from "../../api/third/grpcThirdEditList";
import Channel_bindplayback from "./channel_bindplayback";
import {grpcThirdSort} from "../../api/third/grpcThirdSort";

export default function Third_Table() {
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取到APkId
    const {menuId, id, mid} = useParams();
    const [isAll, setIsAll] = useState<boolean>(true)
    // mid 是主分类id id是二级分类id
    var channelFilter = useproxy_ThirdCalssFilter(); // 获取权限菜单
    var permissions = authProxy.permissions;
    const SecondTable = permissions.find(
        (option) => option.name === "查看二级分类",
    );
    const FirstTable = permissions.find(
        (option) => option.name === "查看一级分类",
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
    // 型号名称
    const [modelName, setmodelName] = React.useState<any>();
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 编辑版本信息
    const handleEditThirdClass = async (row) => {
        let foundOption = childrenMenu.find((option) => option.name === "编辑频道");
        if (foundOption) {
            ThirdCalssStoreProxy.ThirdCalssEdit = row;
            goto(`${foundOption.url}/${foundOption.id}/${row.id}/${mid}/${id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    const handleShowLink = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "展示频道链接",
        );
        if (foundOption) {
            ThirdCalssStoreProxy.ThirdCalssEdit = row;
            goto(`${foundOption.url}/${foundOption.id}/${row.id}/${mid}/${id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 添加版本信息
    const handleAddThirdClass = async () => {
        let foundOption = childrenMenu.find((option) => option.name === "新增频道");
        if (foundOption) {
            goto(`${foundOption.url}/${foundOption.id}/${mid}/${id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    const handleEcodThirdClass = async () => {
        var channel = new Channel({isAdult: true});
        const mutableSelected = [...selected];
        var res = await grpcThirdEditList(
            mutableSelected,
            channel,
            authProxy.token,
        );
        if (res.status) {
            message.success("加密成功!");
            IsConfirmDialog.refleshPage = true;
        } else {
            message.error("解密失败");
        }
    };

    const handleSortChannel = async () => {
        var res = await grpcThirdSort(parseInt(mid), authProxy.token);
        if (res.status) {
            message.success("重新排序成功!");
            IsConfirmDialog.refleshPage = true;
        } else {
            message.error("重新排序失败");
        }
    };
    const handleDecdThirdClass = async () => {
        var channel = new Channel({isAdult: false});
        const mutableSelected = [...selected];
        var res = await grpcThirdEditList(
            mutableSelected,
            channel,
            authProxy.token,
        );
        if (res.status) {
            message.success("解密成功!");
            IsConfirmDialog.refleshPage = true;
        } else {
            message.error("解密失败");
        }
    };
    const handleFindAll = async () => {
        setIsAll(!isAll)
        return
        // const foundOption1 = childrenMenu.find(option => option.name === "查看二级分类");
        // const childrenMenu1 = permissions.filter(option => option.parentId === Number(foundOption1?.id));
        // const foundOption = childrenMenu1.find(option => option.name === "查看三级分类");
        // if (foundOption) {
        //     goto(`${foundOption.url}/${foundOption.id}/${mid}/${mid}/${2}`);
        //     return true;
        // }
        // message.error("暂无权限");
    };
    // 删除版本信息
    const [DeleteRow, setDeleteRow] = useState();

    const handldeleteThirdClass = async (row: Channel) => {
        let foundOption = childrenMenu.find((option) => option.name === "删除频道");
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中频道列表";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            var ids = [];
            ids = [row.id];
            setDeleteRow(ids);
            setAction(ActionStore.DeleteChannel);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    const handldeletethirdclasslist = async (selected) => {
        let foundOption = childrenMenu.find((option) => option.name === "删除频道");
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中频道列表";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            setDeleteRow(selected);
            setAction(ActionStore.DeleteChannel);
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
            // await grpcDistributorToModel();
            var res = await grpcthirdList(
                page,
                rowsPerPage,
                authProxy.token,
                channelFilter,
                parseInt(mid),
                isAll
            );
            setRows(res.channelList);
            setCount(res.pageMeta?.totalRecords);
            setmodelName(res.channelList);
        };
        fetchData(); // 调用异步函数
        IsConfirmDialog.refleshPage = false;
    }, [page, rowsPerPage, refleshPage, channelFilter, isAll]);

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
        goto(`${FirstTable?.url}/${FirstTable?.id}`);
    };

    return (
        <TableContainer component={Paper}>
            <Third_Filter mainClassId={parseInt(mid)}/>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            <Table sx={{minWidth: 500}}>
                <Third_Column
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
                                    <span>{row.subClassName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.name}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <img
                                        style={{
                                            width: "50%", // 设置图片宽度为容器宽度的一半
                                            height: "auto", // 自动计算图片高度，保持原始宽高比
                                            borderRadius: "10%", // 设置图片圆角为50%以呈现圆形
                                        }}
                                        srcSet={`${row.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        src={`${row.image}?w=164&h=164&fit=crop&auto=format`}
                                        alt={row.apkName} // 使用数据行中的 altText 属性作为 alt 文本
                                        // onError={(e) => {
                                        //     const img = e.currentTarget
                                        //     img.src = "/photo/apkBannerimg_notfound.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x"
                                        // }}
                                        loading="lazy"
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.channelNumber}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.playbackName}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.sort}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {row.rebroadcastUseFlag === 1 ||
                                    row.rebroadcastUseFlag === 2 ? (
                                        <span>{row.aliasName}</span>
                                    ) : (
                                        <span>暂无预告</span>
                                    )}
                                </StyledTableCell>

                                <StyledTableCell style={{width: 50}} align="center">
                                    {row.isUse ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {row.isAdult ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.recommendSort}</span>

                                    {/*<span>*/}
                                    {/*  {(() => {*/}
                                    {/*      switch (row.rebroadcastUseFlag) {*/}
                                    {/*          case 0:*/}
                                    {/*              return '不可用';*/}
                                    {/*          case 1:*/}
                                    {/*              return '有预告无回播';*/}
                                    {/*          case 2:*/}
                                    {/*              return '有预告有回播';*/}
                                    {/*          case 3:*/}
                                    {/*              return '无预告有回播';*/}
                                    {/*          default:*/}
                                    {/*              return '未知类型';*/}
                                    {/*      }*/}
                                    {/*  })()}*/}
                                    {/*</span>*/}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {row.isRecommend ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 25}} align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleShowLink(row)}
                                    >
                                        链接
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <ChannelBindEpg row={row}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Channel_bindplayback row={row}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleEditThirdClass(row)}
                                    >
                                        编辑频道
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 30}} align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handldeleteThirdClass(row)}
                                    >
                                        删除频道
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
                                onClick={() => handldeletethirdclasslist(selected)}
                            >
                                删除频道
                            </Button>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleAddThirdClass()}
                            >
                                添加频道
                            </Button>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleEcodThirdClass()}
                            >
                                加密
                            </Button>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleSortChannel()}
                            >
                                重新排列频道号
                            </Button>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleDecdThirdClass()}
                            >
                                解密
                            </Button>
                        </StyledTableCell>
                        {isAll ? <StyledTableCell>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleFindAll()}
                            >
                                查看更多
                            </Button>
                        </StyledTableCell> : null}

                        <StyledTableCell>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                    return isAll ? handleReturn() : handleFindAll()
                                }}
                            >
                                返回上一级
                            </Button>
                        </StyledTableCell>
                        <StyledTableCell>
                            <IconButton aria-label="delete" size="small">
                                <LocationOnIcon color={"disabled"}/>
                                <Typography variant="caption" gutterBottom display="block">
                                    当前在 频道 列表
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
