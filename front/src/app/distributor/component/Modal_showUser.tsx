import React, {useState} from "react";
import {Button, Modal} from "antd";

export default function Modal_showUser({usernum, rows}) {
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
    // 假设 rows.userList 是一个用户对象的数组
    const userListElements = rows.map((user, index) => {
        // 这里你可以根据 user 对象的结构来渲染每个用户的信息
        return (
            <div key={index}>
                <h3>用户名称: {user.userName}</h3>
                {/*<p>用户年龄: {user.age}</p>*/}
                {/* 其他用户信息 */}
            </div>
        );
    });

    return (
        <>
            <Button type="primary" onClick={showModal}>
                当前绑定用户数量:{usernum}
            </Button>
            <Modal
                title="查看分销商当前用户数量"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {/*{userListElements}*/}

                {userListElements}
            </Modal>
        </>
    );
}
