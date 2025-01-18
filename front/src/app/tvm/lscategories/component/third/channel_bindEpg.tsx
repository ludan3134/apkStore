import React, {useState} from "react";
import type {SelectProps} from "antd";
import {Button, message, Modal, Select} from "antd";
import {grpcAllepg} from "../../api/third/grpcAllepg";
import {authProxy} from "../../../../auth/store/store";
import {EpgLabel} from "../../../../../api/ks/v1/km_pb";
import {grpcManualBindEpg} from "../../../epg/api/grpcManualBindEpg";
import {IsConfirmDialog} from "../../../../../const/alert/store";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;
const fetch = (
    value: string,
    callback: (data: { value: string; text: string }[]) => void,
) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    async function fake() {
        var res = await grpcAllepg(5, currentValue, authProxy.token);
        const data = res.epgList.map((item: EpgLabel) => ({
            value: item.name,
            // 如果 id 是字符串形式的数字，需要将其转换为数字
            text: item.id,
        }));
        callback(data);
    }

    if (value) {
        timeout = setTimeout(fake, 300);
    } else {
        callback([]);
    }
};

export default function Channel_bindEpg({row}) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [hasPermission, setHasPermission] = useState<Boolean>(true);
    // 分割线
    const [data, setData] = useState<SelectProps["options"]>([]);
    const [value, setValue] = useState<string>();

    const handleSearch = (newValue: string) => {
        fetch(newValue, setData);
    };

    const handleChange = (newValue: string) => {
        setValue(newValue);
    };
    const showModal = () => {
        setOpen(true);
    };
    const handleSubFormSubmit = async () => {
        var channelIds = [row.id];
        var epg = await grpcManualBindEpg(channelIds, value, authProxy.token);
        if (!epg.status) {
            message.error("绑定失败!");
            return;
        }
        message.success("绑定成功!");
        IsConfirmDialog.refleshPage = true;
        setOpen(false);
    };
    const handleCancel = () => {
        console.log("Clicked cancel button");
        setOpen(false);
    };
    return (
        <>
            <Button type="primary" onClick={showModal}>
                绑定预告
            </Button>
            <Modal
                title="绑定预告"
                visible={open}
                onOk={handleSubFormSubmit}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                {hasPermission ? (
                    <Select
                        showSearch
                        value={value}
                        placeholder={"请选择预告"}
                        defaultActiveFirstOption={false}
                        suffixIcon={null}
                        filterOption={false}
                        onSearch={handleSearch}
                        onChange={handleChange}
                        notFoundContent={null}
                        options={(data || []).map((d) => ({
                            value: d.value,
                            label: d.text,
                        }))}
                        style={{width: 200}}
                    />
                ) : (
                    <div>暂无用户绑定权限</div>
                )}
            </Modal>
        </>
    );
}
