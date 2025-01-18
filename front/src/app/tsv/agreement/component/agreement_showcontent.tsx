import React, {useState} from "react";
import {Button, Modal} from "antd";
import ReactQuill from "react-quill";

const ShowAgreementText: React.FC<{ title: string; content: string }> = ({
                                                                             title,
                                                                             content,
                                                                         }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                {title}
            </Button>
            <Modal
                title={title}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <ReactQuill theme="snow" value={content} readOnly={true}/>
            </Modal>
        </>
    );
};

export default ShowAgreementText;
