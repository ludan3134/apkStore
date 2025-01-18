import React, {useState} from "react";
import {FileDoneOutlined, UploadOutlined} from "@ant-design/icons";
import type {GetProp, UploadFile, UploadProps} from "antd";
import {Alert, Button, message, Space, Upload} from "antd";
import {authProxy} from "../../app/auth/store/store";
import {Stack} from "@mui/material";
import {UploadResponse} from "./model";
import {useTranslation} from "react-i18next";
import {useproxy_IsUploadFileReset} from "./store";
import envUrls from "../baseurl";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
export default function Multyuploadfile({title, dir, setRes, file_type}) {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    var b = useproxy_IsUploadFileReset();
    const [uploadedFileNames, setUploadedFileNames] = useState([]);
    const {t} = useTranslation();
    const handleUpload = () => {
        const formData = new FormData();
        formData.append("token", authProxy.token);
        formData.append("dir", dir);
        formData.append("file_type", file_type);
        fileList.forEach((file) => {
            formData.append("files[]", file as FileType);
        });
        setUploading(true);
        // You can use any AJAX library you like
        fetch(envUrls.MulitpleUpdBaseUrl, {
            method: "POST",
            mode: "cors",
            body: formData,
        })
            .then((res) => res.json())
            .then((data: UploadResponse) => {
                setFileList([]);
                const newUploadedFileNames = fileList.map((file) => file.name);
                setUploadedFileNames(newUploadedFileNames);
                setRes(data);
                message.success("upload successfully.");
            })
            .catch(() => {
                message.error("upload failed.");
            })
            .finally(() => {
                setUploading(false);
            });
    };

    const props: UploadProps = {
        onRemove: (file) => {
            setFileList((prevFileList) => {
                const index = prevFileList.indexOf(file);
                const newFileList = prevFileList.slice();
                newFileList.splice(index, 1);
                return newFileList;
            });
        },
        beforeUpload: (file) => {
            setFileList((prevFileList) => [...prevFileList, file]); // 使用函数式更新来确保状态是最新的
            return false;
        },
        maxCount: 5,
        fileList,
        multiple:true
    };

    return (
        <>
            {b ? (
                <Space direction="horizontal" size="middle">
                    <FileDoneOutlined style={{fontSize: "25px", color: "lightgreen"}}/>
                    {uploadedFileNames.map((fileName, index) => (
                        <div key={index}>{fileName}</div>
                    ))}
                </Space>
            ) : (
                <>
                    <Stack spacing={2} direction="column">
                        <Upload {...props} fileList={fileList}>
                            <Button icon={<UploadOutlined/>} disabled={b}>
                                {t(title)}
                            </Button>
                        </Upload>
                        <Button
                            type="primary"
                            onClick={handleUpload}
                            disabled={!fileList.length || b || uploading}
                            loading={uploading}
                            style={{marginTop: 16}}
                        >
                            {uploading ? "Uploading" : "Start Upload"}
                        </Button>
                        <Alert message={t("fileNameMustBeInEnglish")} type="error"/>
                    </Stack>
                </>
            )}
        </>
    );
}
