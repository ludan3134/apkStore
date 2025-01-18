import {styled} from "@mui/material/styles";

export const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

export interface FileObject {
    name: string;
    upload: boolean;
    uploadError: boolean;
    content: File;
    index: number;
}

export interface MultiFileObject {
    name: string;
    upload: number; //1代表未上传 2代表正在上传 3代表已经上传
    uploadError: boolean;
    content: File;
    index: number;
}

export interface MultiFileObject {
    name: string;
    upload: number; //1代表未上传 2代表正在上传 3代表已经上传
    uploadError: boolean;
    content: File;
    index: number;
}

export interface UploadResponse {
    tid: number;
    file_size: bigint;
    raw_file: string;
    media_uri: string;
    storage_location: string;
    md5: string;
    r2_key: string;
}


