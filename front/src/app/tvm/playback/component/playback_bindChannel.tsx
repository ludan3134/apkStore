import React, {useMemo, useRef, useState} from "react";
import {Button, message, Modal, Select, Spin} from "antd";
import {DebounceSelectProps, iLikeSelectValue,} from "../../../../const/ilikeselect";
import debounce from "lodash/debounce";
import {authProxy} from "../../../auth/store/store";
import {grpcManualBindPlayback} from "../api/grpcManualBindPlayback";
import {ChannelLabel} from "../../../../api/ks/v1/km_pb";
import {grpcAllchannel} from "../../epg/api/grpcAllchannel";
import {IsConfirmDialog} from "../../../../const/alert/store";

function DebounceSelect<
    ValueType extends {
        key?: string;
        label: React.ReactNode;
        value: string | number;
    } = any,
>({
      fetchOptions,
      debounceTimeout = 800,
      ...props
  }: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);
    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);
            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small"/> : null}
            {...props}
            options={options}
        />
    );
}

async function fetchChannelList(
    channelname: string,
): Promise<iLikeSelectValue[]> {
    try {
        var res = await grpcAllchannel(5, channelname, authProxy.token);
        // 确保 res.priceLabelList 是 AllPricePlanLabel 类型的数组
        return res.channelList.map((item: ChannelLabel) => ({
            label: item.name,
            // 如果 id 是字符串形式的数字，需要将其转换为数字
            value: item.id,
        }));
    } catch (error) {
        console.error("Fetching channel list failed:", error);
        return [];
    }
}

export default function Playback_bindChannel({row}) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [hasPermission, setHasPermission] = useState<Boolean>(true);
    const [selectValue, setSelectValue] = useState<iLikeSelectValue[]>([]);
    const showModal = () => {
        setOpen(true);
    };
    const handleSubFormSubmit = async (data) => {
        // 这个是PlaybackId
        console.log("row", row);
        // var name = row.channelName;
        var channelIds: number[] = []; // 用于存储收集到的ids

        // 遍历selectValue数组，收集每个元素的value
        selectValue.map((item) => {
            // 假设每个item都有一个value属性，且该属性是一个数字
            channelIds.push(item.value);
        });
        var Playback = await grpcManualBindPlayback(
            channelIds,
            row.streamId,
            authProxy.token,
        );
        if (!Playback.status) {
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
                绑定回放
            </Button>
            <Modal
                title="绑定回放"
                visible={open}
                onOk={handleSubFormSubmit}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                {hasPermission ? (
                    <DebounceSelect
                        mode="multiple"
                        value={selectValue}
                        placeholder="Select users"
                        fetchOptions={fetchChannelList}
                        onChange={(newValue) => {
                            setSelectValue(newValue as iLikeSelectValue[]);
                        }}
                        style={{width: "100%"}}
                    />
                ) : (
                    <div>暂无用户绑定权限</div>
                )}
            </Modal>
        </>
    );
}
