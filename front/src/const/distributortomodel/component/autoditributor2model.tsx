import React, {useState} from "react";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Form, message, Modal, Space, TreeSelect} from "antd";
import {grpcQueryBindDistributorModelList} from "../api/grpcQueryBindDistributorModelList";
import {authProxy} from "../../../app/auth/store/store";
import {useproxy_AllDistributor} from "../../../app/distributor/store/store";
import {TreeNode} from "../../../api/ax/v1/axm_pb";
import {grpcBindDistributorModelList} from "../api/grpcBindDistributorModelList";
import {grpcAllModel} from "../../../app/distributor/api/grpcAllModel";

const Autodistributor2model: React.FC<{ type: number; id: number }> = ({
                                                                           type,
                                                                           id,
                                                                       }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    var treeNodes = useproxy_AllDistributor();
    const [modelData, setModelData] = useState<{ [key: string]: TreeNode[] }>({});
    const [initialValues, setInitialValues] = useState({users: []});
    const showModal = async () => {
        var res = await grpcQueryBindDistributorModelList(
            type,
            id,
            authProxy.token,
        );
        console.log("treeNodes", treeNodes);
        console.log("res.list", res.list);
        form.setFieldsValue({users: res.list});
        for (const distributor of res.list) {
            if (distributor.distributorId) {
                modelData[distributor.distributorId] = await getTreeDataForDistributor(
                    distributor.distributorId,
                );
            }
        }
        setIsModalOpen(true);
    };
    // useEffect(() => {
    // 	const loadData = async () => {
    // 		try {
    // 			var res = await grpcQueryBindDistributorModelList(
    // 				type,
    // 				id,
    // 				authProxy.token,
    // 			);// 获取数据
    // 			setInitialValues({ users: res.list}); // 设置状态为期望的格式
    // 		} catch (error) {
    // 			console.error('Failed to fetch data:', error);
    // 		}
    // 	};
    // 	loadData();
    // }, []); // 空依赖数组确保只在组件挂载时执行一次
    const getTreeDataForDistributor = async (
        distributorId,
    ): Promise<TreeNode[]> => {
        var res = await grpcAllModel(distributorId, authProxy.token);
        return res.tree;
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values: any) => {
        console.log("Received values of form:", values);
        var res = await grpcBindDistributorModelList(
            type,
            id,
            authProxy.token,
            values.users,
        );
        if (res.status) {
            message.success("绑定成功!");
            var res1 = await grpcQueryBindDistributorModelList(
                type,
                id,
                authProxy.token,
            );
            if (res1.status) {
                message.success("数据刷新成功!");
                setInitialValues({users: res1.list});
            }
            setIsModalOpen(false);
        } else {
            message.error("绑定失败!");
        }
    };
    const onDistributorChange = async (name, value) => {
        // 获取当前表单中所有的 distributorId
        // 获取当前表单中所有的 distributorId，排除当前正在编辑的项
        const currentDistributorIds = form
            .getFieldValue("users")
            .reduce((acc, user, index) => {
                if (index !== name) acc.push(user.distributorId);
                return acc;
            }, []);
        // 检查当前选择的 distributorId 是否已经存在于其他项中
        if (currentDistributorIds.includes(value)) {
            // 如果有重复的 distributorId，显示错误信息并重置当前字段
            message.error("分销商 ID 不能重复，请重新选择。");
            form.setFieldsValue({
                users: form.getFieldValue("users").map((user, index) => {
                    if (index === name) {
                        return {...user, distributorId: null}; // 重置当前字段为 null
                    }
                    return user;
                }),
            });
            return;
        }
        const models = await getTreeDataForDistributor(value);
        // 更新状态，以分销商ID为键存储型号数据
        setModelData((prevData) => ({...prevData, [value]: models}));
        // 重置当前分销商对应的型号字段
        form.setFieldsValue({
            users: form.getFieldValue("users").map((user, index) => {
                if (index === name) {
                    return {...user, modelId: []}; // 重置为空数组
                }
                return user;
            }),
        });
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                绑定分销商型号
            </Button>
            <Modal
                title={"绑定分销商型号"}
                open={isModalOpen}
                footer={null}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    name="dynamic_form_nest_item"
                    onFinish={onFinish}
                    style={{maxWidth: 600}}
                    autoComplete="off"
                    initialValues={initialValues}
                >
                    <Form.List name="users">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name, ...restField}) => (
                                    <Space
                                        key={key}
                                        style={{display: "flex", marginBottom: 8}}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, "distributorId"]}
                                            rules={[
                                                {required: true, message: "Missing first name"},
                                            ]}
                                        >
                                            <TreeSelect
                                                treeData={treeNodes}
                                                style={{width: "200px"}} // Set the width to 300px
                                                onChange={(value) => onDistributorChange(name, value)}
                                                placeholder="请选择分销商!"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "modelId"]}
                                            style={{width: "200px"}} // Set the width to 300px
                                            rules={[{required: true, message: "Missing last name"}]}
                                            dependencies={[["users", 0, "distributorId"]]} // 正确设置依赖项
                                        >
                                            <TreeSelect
                                                multiple={true}
                                                style={{width: "100%"}}
                                                placeholder="请选择型号!"
                                                treeData={
                                                    modelData[
                                                        form.getFieldValue(["users", name, "distributorId"])
                                                        ] || []
                                                }
                                            />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)}/>
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined/>}
                                    >
                                        Add field
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item style={{textAlign: "right"}}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Autodistributor2model;
