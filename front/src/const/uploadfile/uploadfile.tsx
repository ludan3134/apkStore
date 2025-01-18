import React, {useState} from "react";
import {FileDoneOutlined, UploadOutlined} from "@ant-design/icons";
import type {GetProp, UploadFile, UploadProps} from "antd";
import {Alert, Button, message, Space, Upload} from "antd";
import {authProxy} from "../../app/auth/store/store";
import {UploadResponse} from "./model";
import {Stack} from "@mui/material";
import {useTranslation} from "react-i18next";
import {IsUploadFileReset, useproxy_IsUploadFileReset} from "./store";
import envUrls from "../baseurl";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function Uploadfile({title, dir, setRes, file_type}) {
    const [file, setFile] = useState<UploadFile | null>(null);
    const [uploading, setUploading] = useState(false);
    var b = useproxy_IsUploadFileReset();
    console.log("我是b", b);
    // const [disableUpload, setDisableUpload] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const {t} = useTranslation();

    const handleUpload = () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file as FileType);
        formData.append("token", authProxy.token);
        formData.append("dir", dir);
        formData.append("file_type", file_type);
        setUploading(true);
        fetch(envUrls.UpdBaseUrl, {
            method: "POST",
            mode: "cors",
            body: formData,
        })
            .then((res) => res.json())
            .then((data: UploadResponse) => {
                setUploadedFileName(file?.name || ""); // Store uploaded file name
                setFile(null);
                setRes(data);
                IsUploadFileReset.IsReset = false;
                message.success("upload successfully.");
            })
            .catch(() => {
                message.error("upload failed.");
            })
            .finally(() => {
                setUploading(false);
            });
    };

    const props: UploadProps<FileType> = {
        onRemove: () => {
            setFile(null);
        },
        beforeUpload: (uploadedFile) => {
            setFile(uploadedFile);

            return false;
        },
        fileList: file ? [file] : [],
        maxCount: 1,
    };

    return (
        <>
            {b ? (
                <Space direction="horizontal" size="middle">
                    <FileDoneOutlined style={{fontSize: "25px", color: "lightgreen"}}/>
                    {uploadedFileName}
                </Space>
            ) : (
                <>
                    <Stack spacing={2} direction="column">
                        <Upload {...props}>
                            <Button icon={<UploadOutlined/>} disabled={b}>
                                {title}
                            </Button>
                        </Upload>
                        <Button
                            type="primary"
                            onClick={handleUpload}
                            disabled={!file || b || uploading}
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
