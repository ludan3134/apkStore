import React, {useState} from "react";
import {FormContainer, MultiSelectElement} from "react-hook-form-mui";
import {useForm} from "react-hook-form";
import {grpcDistributorUserBind} from "../api/grpcDistributorUserBind";
import {Button, message, Modal} from "antd";
import {authProxy} from "../../auth/store/store";
import {Stack} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {grpcAllUser} from "../../system/user/api/grpcAllUser";
import {DistributorTreeStoreProxy} from "../store/store";

export default function Button_bindUser(rows) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [hasPermission, setHasPermission] = useState<Boolean>(true);
    const [userlables, setUserlables] = useState([]);

    const formContext = useForm({
        defaultValues: {
            userlable: [],
        },
    });
    const fetchData = async () => {
        var res = await grpcAllUser();
        setUserlables(res.userList);
    };
    React.useEffect(() => {
        fetchData(); // 调用异步函数
    }, []);
    const showModal = () => {
        fetchData();
        setOpen(true);
    };
    console.log("userlables", userlables);
    const handleSubFormSubmit = async (data) => {
        console.log("data.userlable", data.userlable);
        if (!data.userlable) {
            data.userlable = "";
        }
        var res = await grpcDistributorUserBind(
            rows.rows.value,
            data.userlable,
            authProxy.token,
        );
        if (res.status) {
            setOpen(false);
            message.success("绑定成功!");
            DistributorTreeStoreProxy.IsUserChange = true;
        } else {
            setOpen(false);
            handleResetForm();
        }
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
    };
    const handleCancel = () => {
        console.log("Clicked cancel button");
        setOpen(false);
    };
    return (
        <>
            {/*<IconButton aria-label="delete" size="small" onClick={showModal}>*/}
            {/*    <AccessibilityIcon fontSize="inherit"/>*/}
            {/*</IconButton>*/}
            <Button type="primary" onClick={showModal}>
                绑定用户
            </Button>

            <Modal
                title="绑定用户"
                visible={open}
                onOk={handleSubFormSubmit}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={null}
            >
                {hasPermission ? (
                    <FormContainer
                        formContext={formContext}
                        onSuccess={(data) => {
                            handleSubFormSubmit(data);
                        }}
                    >
                        <Stack spacing={2}>
                            {/*<AutocompleteElement multiple={true} name={"userlable"} options={userlables}/>*/}
                            <MultiSelectElement
                                itemKey="id"
                                itemLabel="name"
                                label="用户"
                                name="userlable"
                                options={userlables}
                                showChips={true}
                            />
                            <DialogActions>
                                <Button htmlType={"submit"}>提交</Button>
                                <Button onClick={handleCancel}>关闭</Button>
                            </DialogActions>
                        </Stack>
                    </FormContainer>
                ) : (
                    <div>暂无用户绑定权限</div>
                )}
            </Modal>
        </>
    );
}
