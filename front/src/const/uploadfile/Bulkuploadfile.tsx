import React, {useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import type {GetProp, UploadFile, UploadProps} from 'antd';
import {Alert, Button, message, Upload} from 'antd';
import envUrls from "../baseurl";
import {authProxy} from "../../app/auth/store/store";
import {Stack} from "@mui/material";
import {useTranslation} from "react-i18next";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function UploadFileList({title, dir, setRes, file_type}) {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const {t} = useTranslation();

    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files', file as FileType);
        });
        formData.append("token", authProxy.token);
        formData.append("dir", dir);


        setUploading(true);
        // You can use any AJAX library you like
        fetch(envUrls.MulitpleUpdBaseUrl, {
            method: 'POST',
            mode: "cors",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("data", data)
                setFileList([]);
                setRes(data);
                message.success('upload successfully.');
            })
            .catch(() => {
                message.error('upload failed.');
            })
            .finally(() => {
                setUploading(false);
            });
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            // 使用函数式更新来确保状态是最新的
            setFileList((prevFileList) => [...prevFileList, file]);
            return false;
        },
        fileList,
        multiple: true
    };

    return (
        <>
            <Stack spacing={2} direction="column">
                <Upload {...props}>
                    <Button icon={<UploadOutlined/>}>{title}</Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{marginTop: 16}}
                >
                    {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
                <Alert message={t("fileNameMustBeInEnglish")} type="error"/>

            </Stack>

        </>
    );
};

