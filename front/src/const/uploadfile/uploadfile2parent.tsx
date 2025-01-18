import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";
import Typography from "@mui/material/Typography";
import {green, pink} from "@mui/material/colors";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {FileObject, VisuallyHiddenInput} from "./model";
import React, {useEffect, useState} from "react";
import {IsUploadFileReset, useproxy_IsUploadFileReset} from "./store";
import {FirewareverdetailStoreProxy} from "../../app/ott/fireware/store/firewareversion/store";
import {ApkverdetailStoreProxy} from "../../app/ott/apk/store/apkversion/store";

export default function Uploadfile2parent({onFileUpload, fileName}) {
    const [file, setFile] = useState<FileObject | null>(null); // 文件状态
    const [isUploading, setIsUploading] = useState(false); // 上传中状态
    const [uploadError, setUploadError] = useState(false); // 上传错误状态
    var shouldReset = useproxy_IsUploadFileReset();

    useEffect(() => {
        if (shouldReset) {
            setFile(null);
            setIsUploading(false);
            setUploadError(false);
        }
    }, [shouldReset]);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files[0];
        const fileObject: FileObject = {
            name: selectedFile.name,
            upload: false,
            uploadError: false,
            content: selectedFile,
        };
        setFile(fileObject); // 设置文件对象
    };

    const handleUpload = () => {
        IsUploadFileReset.IsReset = false;
        onFileUpload(file!.content);

        setFile((prevFile) => ({...prevFile!, upload: true})); // 设置上传完成状态为 true
        ApkverdetailStoreProxy.IsApkFileUpload = true;
        FirewareverdetailStoreProxy.IsFirewareFileUpload = true;
        // 其他处理逻辑
    };

    const handleCancel = () => {
        setFile(null); // 取消上传并重置文件状态
        setUploadError(false); // 重置上传错误状态
    };

    return (
        <Stack spacing={2}>
            <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon/>}
            >
                {fileName}
                <VisuallyHiddenInput type="file" onChange={handleFileChange}/>
            </Button>
            {file && (
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>
                        <FolderIcon/>
                    </Avatar>
                    <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                        {file.name}
                    </Typography>
                    {isUploading ? (
                        <>
                            <Avatar sx={{bgcolor: green[50]}}>
                                <CircularProgress size={24} thickness={4}/>
                            </Avatar>
                        </>
                    ) : file.upload ? (
                        <>
                            <Avatar sx={{bgcolor: green[50]}}>
                                <IconButton>
                                    <CheckCircleIcon color="success"/>
                                </IconButton>
                            </Avatar>
                        </>
                    ) : uploadError ? (
                        <>
                            <Avatar sx={{bgcolor: pink[50]}}>
                                <IconButton>
                                    <CancelIcon color="error"/>
                                </IconButton>
                            </Avatar>
                            <Avatar sx={{bgcolor: pink[50]}}>
                                <IconButton>
                                    <RefreshIcon onClick={handleUpload}/>
                                </IconButton>
                            </Avatar>
                        </>
                    ) : (
                        <>
                            <Avatar sx={{bgcolor: green[50]}}>
                                <IconButton onClick={handleUpload}>
                                    <FileUploadIcon color="info"/>
                                </IconButton>
                            </Avatar>
                            <Avatar sx={{bgcolor: green[50]}}>
                                <IconButton onClick={handleCancel}>
                                    <CancelIcon color="error"/>
                                </IconButton>
                            </Avatar>
                        </>
                    )}
                </Stack>
            )}
        </Stack>
    );
}
