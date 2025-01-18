import * as React from "react";
import {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import {Button, Checkbox, Chip, Divider, Stack} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {InputNumber, message, Switch} from "antd";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../../const/alert/store";
import {authProxy} from "../../../../auth/store/store";
import {ActionStore} from "../../../../../const/alert/model";
import {StyledTableCell, StyledTableRow,} from "../../../../../const/tablestyle";
import {Third_Column2} from "./third_Column";
import {ThirdCalssStoreProxy, useproxy_ThirdCalssFilter,} from "../../store/third/store";
import {Channel, LabelResp} from "../../../../../api/ks/v1/km_pb";
import {grpcthirdList} from "../../api/third/grpcthirdList";
import {grpcThirdEdit} from "../../api/third/grpcThirdEdit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import EightteenMpIcon from '@mui/icons-material/EightteenMp';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import {useForm} from "react-hook-form";
import {grpcAllSubClass} from "../../api/third/grpcAllSubClass";
import {FormContainer, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {IsBitrateOption, IsStringOption} from "../../../../../const/option";


export default function Third_Table2() {
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 获取到APkId
    const {menuId, id, mid, All} = useParams();
    const [isAll, setIsAll] = useState<boolean>(JSON.parse(All))
    const formContext = useForm<Channel>({
        defaultValues: {name: ""},
    });
    const [dataSource, setDataSource] = useState<LabelResp[]>([])
    const handleSubFormSubmit = (data: Channel) => {
        ThirdCalssStoreProxy.ThirdCalssFilter = data;
    };
    React.useEffect(() => {
        formContext.reset()
        ThirdCalssStoreProxy.ThirdCalssFilter = {} as Channel;
        const fetchData = async () => {
            var res = await grpcAllSubClass(authProxy.token, parseInt(mid));
            setDataSource(res.subClassList)
        };
        fetchData(); // 调用异步函数
    }, []);
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        ThirdCalssStoreProxy.ThirdCalssFilter = {} as Channel;
    };
    var channelFilter = useproxy_ThirdCalssFilter(); // 获取权限菜单
    var permissions = authProxy.permissions;
    const FirstTable = permissions.find(
        (option) => option.name === "运维查看直播分类",
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

    const handleShowLink = async (row) => {
        let foundOption = childrenMenu.find(
            (option) => option.name === "运营商查看频道链接",
        );
        if (foundOption) {
            ThirdCalssStoreProxy.ThirdCalssEdit = row;
            goto(`${foundOption.url}/${foundOption.id}/${row.id}/${mid}/${id}/${isAll}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };

    const handleFindAll = () => {
        return setIsAll(!isAll)
    };
    const handleisUse = async (row: Channel, checked: boolean) => {
        row.isUse = checked;
        var res = await grpcThirdEdit(row, authProxy.token);
        if (res.status) {
            message.success("更新发布市场状态成功!");
            IsConfirmDialog.refleshPage = true;
        } else {
            message.error("更新发布市场状态失败!");
            IsConfirmDialog.refleshPage = true;
        }
    };
    const handleisAdult = async (row: Channel, checked: boolean) => {
        row.isAdult = checked;
        var res = await grpcThirdEdit(row, authProxy.token);
        if (res.status) {
            message.success("更新滚动状态成功!");
            IsConfirmDialog.refleshPage = true;
        } else {
            message.error("更新发滚动状态失败!");
            IsConfirmDialog.refleshPage = true;
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
            <FormContainer
                formContext={formContext}
                // 表单提交成功时的回调函数
                onSuccess={(data) => {
                    handleSubFormSubmit(data);
                }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <TextFieldElement name="name" label="频道名称"/>
                    <TextFieldElement name="framerate" label="帧率" />
                    <TextFieldElement name="resolution" label="分辨率" />
                    <TextFieldElement name="videoCodec" label="视频格式" />
                    <TextFieldElement name="audioCodec" label="音频格式" />
                    <TextFieldElement name="channelNumber" label="频道号" type={"number"}/>
                    <SelectElement
                        label="码率"
                        name="bitrate"
                        options={IsBitrateOption}
                        sx={{
                            minWidth: "150px",
                        }}
                    />

                    <SelectElement
                        label="二级分类"
                        value={"id"}
                        name="subClassId"
                        options={dataSource}
                        sx={{
                            minWidth: "150px",
                        }}
                    />
                    <SelectElement
                        label="是否回放"
                        name="playbackFilter"
                        options={IsStringOption}
                        sx={{
                            minWidth: "150px",
                        }}
                    />
                    <SelectElement
                        label="是否推荐"
                        name="recommendFilter"
                        options={IsStringOption}
                        sx={{
                            minWidth: "150px",
                        }}
                    />
                    <SelectElement
                        label="是否加密"
                        name="adultFilter"
                        options={IsStringOption}
                        sx={{
                            minWidth: "150px",
                        }}
                    />
                    <Button type="submit">筛选</Button>
                    <Button type="button" onClick={handleResetForm}>
                        重置
                    </Button>
                    {isAll ? <Button type="button" onClick={handleFindAll}>
                        查看更多
                    </Button> : null}
                </Stack>
            </FormContainer>
            <Table sx={{minWidth: 500}}>
                <Third_Column2
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
                                <StyledTableCell style={{width: "5%"}} align="center" size={'small'}>
                                    <InputNumber
                                        width={5}
                                        min={1}
                                        max={100000}
                                        size={"small"}
                                        // defaultValue={row.sort}
                                        value={row.sort}
                                        onPressEnter={async (event) => {
                                            console.log("value", event.target?.value)
                                            row.sort = parseInt(event?.target?.value)
                                            var res = await grpcThirdEdit(row, authProxy.token);
                                            if (res.status) {
                                                message.success("更新数字状态成功!");
                                            } else {
                                                message.error("更新发数字状态失败!");
                                            }
                                            IsConfirmDialog.refleshPage = true;
                                        }}/>

                                </StyledTableCell>
                                <StyledTableCell style={{width: "25%"}} align="center">
                                    {/*<Button variant="text" onClick={() => {*/}
                                    {/*    isAll ? setIsAll(false) : handleShowLink(row)*/}
                                    {/*}}>*/}
                                    <Button variant="text" onClick={() => {
                                        handleShowLink(row)
                                    }}>
                                        {row.name}
                                    </Button><br/>
                                    <Button variant="contained" size={"small"} disabled={true} color={"success"}>
                                        {row.subClassName}
                                    </Button>
                                    {/*<span>{row.subClassName}</span>*/}
                                </StyledTableCell>
                                <StyledTableCell style={{width: "25%"}} align="center">
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
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.subClassName}</span>*/}
                                {/*</StyledTableCell>*/}

                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.channelNumber}</span>*/}
                                {/*</StyledTableCell>*/}
                                {/*<StyledTableCell style={{width: 50}} align="center">*/}
                                {/*    <span>{row.playbackName}</span>*/}
                                {/*</StyledTableCell>*/}

                                <StyledTableCell style={{width: "5%"}} align="center">
                                    {row.playbackName === null ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: "5%"}}align="center">
                                    {row.rebroadcastUseFlag === 2 ? (
                                        <CheckCircleIcon color="success"/>
                                    ) : (
                                        <CancelIcon color="warning"/>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell style={{width: "5%"}} align="center">
                                    {/*{row.isUse ? (*/}
                                    {/*    <CheckCircleIcon color="success"/>*/}
                                    {/*) : (*/}
                                    {/*    <CancelIcon color="warning"/>*/}
                                    {/*)}*/}
                                    <Switch
                                        checkedChildren="开启"
                                        unCheckedChildren="关闭"
                                        value={row.isUse}
                                        onChange={(checked) => handleisUse(row, checked)}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: "5%"}} align="center">
                                    {/*{row.isAdult ? (*/}
                                    {/*    <CheckCircleIcon color="success"/>*/}
                                    {/*) : (*/}
                                    {/*    <CancelIcon color="warning"/>*/}
                                    {/*)}*/}
                                    <Switch
                                        checkedChildren="开启"
                                        unCheckedChildren="关闭"
                                        value={row.isAdult}
                                        onChange={(checked) => handleisAdult(row, checked)}
                                    />
                                </StyledTableCell>
                                <StyledTableCell style={{width: "5%"}} align="center">
                                    <Chip label={row.resolution} color="primary" variant="outlined"
                                          icon={<EightteenMpIcon/>}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: "5%"}} align="center">
                                    <Chip label={row.framerate} color="primary" variant="outlined"
                                          icon={<GraphicEqIcon/>}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: "5%"}} align="center">
                                    <Chip label={row.audioCodec} color="primary" variant="outlined"
                                          icon={<AudiotrackIcon/>}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: "5%"}} align="center">
                                    <Chip label={row.videoCodec} color="primary" variant="outlined"
                                          icon={<OndemandVideoIcon/>}/>
                                </StyledTableCell>
                                <StyledTableCell style={{width: "5%"}} align="center">
                                    <Chip label={row.bitrate} color="primary" variant="outlined"
                                          icon={<LocalMoviesIcon/>}/>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <StyledTableCell style={{width: "5%"}} align="center">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                return isAll ? handleReturn() : handleFindAll()
                            }}
                        >
                            上一级
                        </Button>
                    </StyledTableCell>

                    {isAll ? <StyledTableCell style={{width: 10}} align="center">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleFindAll()}
                        >
                            更多
                        </Button>
                    </StyledTableCell> : null}

                    <TablePagination
                        count={count} //必填
                        rowsPerPage={rowsPerPage} //必填
                        page={page} //必填
                        onPageChange={handleChangePage} //必填
                        ActionsComponent={TablePaginationActions}
                        rowsPerPageOptions={[]}
                    />
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

