import React, {useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import type {DragEndEvent} from '@dnd-kit/core';
import {DndContext, PointerSensor, useSensor} from '@dnd-kit/core';
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy,} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import type {UploadFile, UploadProps} from 'antd';
import {Alert, Button, Upload} from 'antd';
import envUrls from "../baseurl";
import {authProxy} from "../../app/auth/store/store";
import {useTranslation} from "react-i18next";
import {Stack} from "@mui/material";

interface DraggableUploadListItemProps {
    originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    file: UploadFile<any>;
}

export const convertToUploadFile = (imageUrl: string, index: number): UploadFile => ({
    uid: `${Date.now()}-${index}`, // 使用时间戳和索引生成唯一的uid
    name: imageUrl.substring(imageUrl.lastIndexOf('/') + 1), // 从URL中提取文件名
    status: 'done', // 假设图片已经上传完成
    response: {media_uri: imageUrl}, // 将图片 URL 放入 response 属性
});
const DraggableUploadListItem = ({originNode, file}: DraggableUploadListItemProps) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: file.uid,
    });

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: 'move',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            // prevent preview event when drag end
            className={isDragging ? 'is-dragging' : ''}
            {...attributes}
            {...listeners}
        >
            {/* hide error tooltip when dragging */}
            {file.status === 'error' && isDragging ? originNode.props.children : originNode}
        </div>
    );
};

export default function BulkUploadImage({title, dir, setRes, file_type, ApkImage}) {
    const {t} = useTranslation();

    const [fileList, setFileList] = useState<UploadFile[]>(ApkImage);

    const sensor = useSensor(PointerSensor, {
        activationConstraint: {distance: 10},
    });

    const onDragEnd = ({active, over}: DragEndEvent) => {
        if (active.id !== over?.id) {
            setFileList((prev) => {
                const activeIndex = prev.findIndex((i) => i.uid === active.id);
                const overIndex = prev.findIndex((i) => i.uid === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
            setRes((prev) => {
                const activeIndex = prev.findIndex((i) => i.uid === active.id);
                const overIndex = prev.findIndex((i) => i.uid === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const onChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
        setFileList(newFileList);
        setRes(newFileList)
    };
    return (
        <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
            <Stack spacing={2} direction={"column"}>

            <SortableContext items={fileList.map((i) => i.uid)} strategy={verticalListSortingStrategy}>
                    <Upload
                        action={envUrls.UpdBaseUrl}
                        fileList={fileList}
                        onChange={onChange}
                        itemRender={(originNode, file) => (
                            <DraggableUploadListItem originNode={originNode} file={file}/>
                        )}
                        listType="picture"
                        headers={{
                            'X-Requested-With': null,
                            "Token": authProxy.token
                        }}
                        data={{
                            token: authProxy.token,
                            dir: dir
                        }}
                        multiple={true}
                    >
                        <Button icon={<UploadOutlined/>}>
                            {title}
                        </Button>
                    </Upload>

            </SortableContext>
                <Alert message={t("fileNameMustBeInEnglish")+"("+`${title}`+")"} type="error"/>
            </Stack>
        </DndContext>
);
};

