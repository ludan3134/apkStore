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
import {Button, Checkbox, Chip, Stack} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import {message} from "antd";
import {IsConfirmDialog, IsOpenDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../const/alert/store";
import {authProxy} from "../../../../auth/store/store";
import {ActionStore} from "../../../../../const/alert/model";
import {StyledTableCell, StyledTableRow,} from "../../../../../const/tablestyle";
import ConfirmDialog from "../../../../../const/alert/confirmDialog";
import {Link} from "../../../../../api/ks/v1/km_pb";
import {grpclinkList} from "../../api/link/grpclinkList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import {LinkCalssStoreProxy} from "../../store/link/store";
import {Link_Column2} from "./link_Column";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import EightteenMpIcon from "@mui/icons-material/EightteenMp";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import Paragraph from "antd/es/typography/Paragraph";

export default function Link_Table2() {
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取到APkId
    const {menuId, id, mid, fid,isAll} = useParams();
    // 获取权限菜单
    var permissions = authProxy.permissions;
    const ThirdTable = permissions.find(
        (option) => option.name === "运维查看二级分类",
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
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 编辑版本信息
    const handleEditLink = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "编辑频道链接",
        );
        if (foundOption) {
            LinkCalssStoreProxy.LinkCalssEdit = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 添加版本信息
    const handleAddLink = async () => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "新增频道链接",
        );
        if (foundOption) {
            goto(`${foundOption.url}/${foundOption.id}/${mid}/${fid}/${id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 删除版本信息
    const [DeleteRow, setDeleteRow] = useState();

    const handldeleteLink = async (row: Link) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除频道链接",
        );
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中Apk版本列表";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            var ids = [];
            ids = [row.id];
            setDeleteRow(ids);
            setAction(ActionStore.DeleteLink);
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
            // await grpcDistributorToModel();
            var res = await grpclinkList(authProxy.token, parseInt(id));
            setRows(res.linkList);
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
    const handldeleteLinklist = async (selected) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "删除频道链接",
        );
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
    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    const handleReturn = () => {
        goto(`${ThirdTable?.url}/${ThirdTable?.id}/${fid}/${mid}/${isAll}`);
    };

    return (
        <TableContainer component={Paper}>
            <ConfirmDialog action={Action} row={DeleteRow}/>
            <Table sx={{minWidth: 500}}>
                <Link_Column2
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
                                {/*<StyledTableCell padding="checkbox">*/}
                                {/*    <Checkbox*/}
                                {/*        onClick={(event) => console.log("aaa", row)}*/}
                                {/*        color="primary"*/}
                                {/*        checked={isItemSelected}*/}
                                {/*    />*/}
                                {/*</StyledTableCell>*/}
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.keyword}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.channelId}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: "10%"}} align="center">
                                    <span>{row.link}</span>
                                    {/*<Paragraph copyable ellipsis={true}>*/}
                                    {/*    {row.link}*/}
                                    {/*</Paragraph>*/}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.source}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <span>{row.sort}</span>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    {row.isUse ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Chip label={row.resolution} color="primary" variant="outlined" icon={<EightteenMpIcon/>}/>
                                    <Chip label={row.framerate} color="primary" variant="outlined" icon={<GraphicEqIcon/>}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: 50}} align="center">
                                    <Chip label={row.audioCodec} color="primary" variant="outlined" icon={<AudiotrackIcon/>}/>
                                    <Chip label={row.videoCodec} color="primary" variant="outlined" icon={<OndemandVideoIcon/>}/>
                                    <Chip label={row.bitrate} color="primary" variant="outlined" icon={<LocalMoviesIcon/>}/>
                                </StyledTableCell>
                                {/*<StyledTableCell style={{width: 25}} align="center">*/}
                                {/*    <Button*/}
                                {/*        variant="contained"*/}
                                {/*        size="small"*/}
                                {/*        onClick={() => handleEditLink(row)}*/}
                                {/*    >*/}
                                {/*        编辑*/}
                                {/*    </Button>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 30}} align="center">*/}
                                {/*    <Button*/}
                                {/*        variant="contained"*/}
                                {/*        size="small"*/}
                                {/*        onClick={() => handldeleteLink(row)}*/}
                                {/*    >*/}
                                {/*        删除链接*/}
                                {/*    </Button>*/}
                                {/*</StyledTableCell>*/}
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                {/*        <StyledTableCell style={{width: 30}} align="center">*/}
                {/*            <Stack spacing={2} direction={"row"}>*/}
                {/*                <Button*/}
                {/*                    variant="contained"*/}
                {/*                    size="small"*/}
                {/*                    onClick={() => handleAddLink()}*/}
                {/*                >*/}
                {/*                    添加频道链接*/}
                {/*                </Button>*/}
                {/*                <Button*/}
                {/*                    variant="contained"*/}
                {/*                    size="small"*/}
                {/*                    onClick={() => handldeleteLinklist(selected)}*/}
                {/*                >*/}
                {/*                    删除频道链接*/}
                {/*                </Button>*/}
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => handleReturn()}
                                >
                                    返回上一级
                                </Button>
                {/*                <IconButton aria-label="delete" size="large">*/}
                {/*                    <LocationOnIcon color={"disabled"}/>*/}
                {/*                    <Typography*/}
                {/*                        variant="caption"*/}
                {/*                        gutterBottom*/}
                {/*                        display="block"*/}
                {/*                        marginTop={2}*/}
                {/*                    >*/}
                {/*                        当前在 频道链接 列表*/}
                {/*                    </Typography>*/}
                {/*                </IconButton>*/}
                {/*            </Stack>*/}
                {/*        </StyledTableCell>*/}
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
