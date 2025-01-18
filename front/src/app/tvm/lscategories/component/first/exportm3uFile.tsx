import * as React from "react";
import {useState} from "react";
import {message, Modal, Select} from "antd";
import {grpcAllMainClass} from "../../api/first/grpcAllMainClass";
import {Button, IconButton, ImageListItem, ImageListItemBar, Stack} from "@mui/material";
import Uploadfile2parent from "../../../../../const/uploadfile/uploadfile2parent";
import {authProxy} from "../../../../auth/store/store";
import envUrls from "../../../../../const/baseurl";
import {IsConfirmDialog} from "../../../../../const/alert/store";
import {InfoIcon} from "../../../../wstore/appUser/component/AppUser_BulkInsert";
import {IsIdOption, IsM3UOption, IsWSTOption} from "../../../../../const/option";


export default function Exportm3uFile({}) {

    const [open, setOpen] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectOption, setSelectOption] = useState([])

    const [selectValue, setSelectValue] = useState<string>()
    const [selectValue1, setSelectValue1] = useState<string>()

    // 开启对话框
    const handleClickOpen = async () => {
        setOpen(true);
    };

    // 回调数据给父组件
    const handleCancel = () => {
        setOpen(false);
    };
    const [terminalFile, setTerminalFile] = useState<File>();
    const handleterminalFileUpload = (file: File) => {
        setTerminalFile(file);
    };
    React.useEffect(() => {
        const fetchData = async () => {
            var res = await grpcAllMainClass();
            setSelectOption(res.mainClassList)
        };
        fetchData(); // 调用异步函数
    }, []);
    const onChange = (value: string) => {
        setSelectValue(value)
    };

    const onChange1 = (value: string) => {
        setSelectValue1(value)
    };
    const handleOk = async () => {
        if (!terminalFile) {
            message.error("请重新上传M3U文件");
            return;
        }
        if (!selectValue) {
            message.error("请选择一级分类");
            return;
        }
        // 如果其中一个文件存在，则执行新增操作
        try {
            const formData = new FormData();
            formData.append("excel", terminalFile);
            formData.append("token", authProxy.token);
            formData.append("main_class_id", selectValue);
            formData.append("update_method", selectValue1);

            const response = await fetch(envUrls.BulkImportM3UBaseUrl, {
                method: "POST",
                body: formData,
                mode: "cors",
            });
            console.log("response", response);
            if (response.ok) {
                var res = await response.json();
                console.log("res", res);
                message.success(res.message);
            }
            // 执行数据新增操作
        } catch (error) {
            message.error("调用接口发生错误");
            setOpen(false)
            return;
        }
        setOpen(false)
        IsConfirmDialog.refleshPage = true


    };
    return (
        <React.Fragment>
            <Button
                variant="contained"
                size="small"
                onClick={() => handleClickOpen()}
            >
                导入M3U文件
            </Button>
            <Modal
                title="导出M3U文件"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText={"导入"}
                cancelText={"取消"}
                width={"750px"}
            >
                <Stack direction={"column"} spacing={2}>
                    <Select
                        showSearch
                        placeholder="选择一级分类"
                        onChange={onChange}
                        options={selectOption}
                        fieldNames={{
                            value: 'id',      // 对应选项中的值字段
                        }}
                        allowClear={true}
                    />
                    <Select
                        showSearch
                        placeholder="增/全量"
                        onChange={onChange1}
                        options={IsM3UOption}
                        fieldNames={{
                            value: 'id',      // 对应选项中的值字段
                        }}
                        allowClear={true}
                    />
                    <Stack style={{width: "558px", height: "296px"}}>
                        <ImageListItem>
                            <img
                                // srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`http://upd.rja3.xyz/images/Apps/20241217163553.png`}
                                alt={"图片找不到"} // 使用数据行中的 altText 属性作为 alt 文本
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={"上传格式要求示例"}
                                subtitle={"文件名不能含有中文"}
                                actionIcon={
                                    <IconButton
                                        sx={{color: "rgba(255, 255, 255, 0.54)"}}
                                        aria-label={`上传格式要求`}
                                    >
                                        <InfoIcon/>
                                    </IconButton>
                                }
                            />
                        </ImageListItem>
                        <Uploadfile2parent
                            onFileUpload={handleterminalFileUpload}
                            fileName={"批量导入M3U文件"}
                        />
                    </Stack>

                </Stack>
            </Modal>
        </React.Fragment>
    );
}
