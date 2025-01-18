import * as React from "react";
import Box from "@mui/material/Box";
import {TreeView} from "@mui/x-tree-view/TreeView";
import {TreeItem} from "@mui/x-tree-view/TreeItem";
import {Checkbox, FormControlLabel, MenuItem, Select, SelectChangeEvent,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {PermissionStoreProxy, usePermissionIselectNull, usePermissions,} from "../../store/store";
import {ConvertedData} from "../../../const/treedata";
import {convertBackendDataToTree} from "../../../const/convertBackendDataToTree";
import {findNodeById} from "../../../const/findNdoeById";

export default function Parentid_Add({setSelectedValue}) {
    var menus = usePermissions();
    const convertedData = convertBackendDataToTree(menus);
    const [treeData, setTreeData] = React.useState(convertedData);
    const [selectedId, setSelectedId] = React.useState<string>("");
    const [expanded, setExpanded] = React.useState<string[]>([]);
    const [open, setOpen] = React.useState(false);
    const DEFAULT_OPTION_VALUE = "无上级菜单"; // 设置默认值为空字符串
    var iselectNull = usePermissionIselectNull();

    const handleToggle = (
        event: React.ChangeEvent<HTMLInputElement>,
        nodes: ConvertedData,
    ) => {
        if (event.target.checked) {
            setSelectedId(nodes.id.toString());
            setExpanded((prevExpanded) => [...prevExpanded, nodes.id.toString()]);
            if (nodes.name === DEFAULT_OPTION_VALUE) {
                setSelectedValue(""); // 设置 setSelectedValue 的值为空字符串
            } else {
                setSelectedValue(nodes.id);
            }
        } else {
            setSelectedId("");
            setExpanded((prevExpanded) =>
                prevExpanded.filter((id) => id !== nodes.id.toString()),
            );
        }
    };
    const handleChoose = (event: React.SyntheticEvent, nodes: string[]) => {
        if (!selectedId) {
            // 如果当前没有选中的节点，则不更新expanded的值
            return;
        }
        setExpanded(nodes);
    };
    const handleClickSelect = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    React.useEffect(() => {
        if (PermissionStoreProxy.isSelectNull) {
            setSelectedId(""); // 当reset为true时，将选中的值重置为空字符串
            PermissionStoreProxy.isSelectNull = false;
        }
    }, [iselectNull]);

    const ConvertedData = (nodes: ConvertedData) => (
        <TreeItem
            key={nodes.id}
            nodeId={nodes.id.toString()}
            label={
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={selectedId == nodes.id.toString()}
                            onChange={(event) => handleToggle(event, nodes)}
                        />
                    }
                    label={nodes.name}
                />
            }
        >
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => ConvertedData(node))
                : null}
        </TreeItem>
    );

    // const handleChange = (event: React.ChangeEvent<{
    //     value: unknown
    // }>) => {
    //     const selectedValue = event.target.value as string;
    //     console.log("selectedValue", selectedValue)
    //     setSelectedId(selectedValue);
    // };
    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        setSelectedId(selectedValue);
    };

    return (
        <Box sx={{minHeight: 60, flexGrow: 1, maxWidth: 300}}>
            <Select
                fullWidth={true}
                value={selectedId || DEFAULT_OPTION_VALUE} // 如果selectedId为空，则使用默认值
                onChange={handleChange}
                open={open}
                onOpen={handleClickSelect}
                onClose={handleClickSelect}
                renderValue={(selected) => (
                    <div>
                        {selectedId ? (
                            <span>{findNodeById(convertedData, selectedId)?.name}</span>
                        ) : (
                            <span>无上级菜单</span> // 默认值
                        )}
                    </div>
                )}
            >
                <MenuItem value="">
                    <em>无上级菜单</em>
                </MenuItem>
                <TreeView
                    aria-label="rich object"
                    defaultCollapseIcon={<ExpandMoreIcon/>}
                    defaultExpanded={["root"]}
                    defaultExpandIcon={<ChevronRightIcon/>}
                    multiSelect
                    selected={selectedId}
                    expanded={expanded}
                    onNodeToggle={handleChoose}
                >
                    {treeData.map((node) => ConvertedData(node))}
                </TreeView>
            </Select>
        </Box>
    );
}
