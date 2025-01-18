import {BackendData, ConvertedData} from "./treedata";

export function convertBackendDataToTree(data: BackendData[]): ConvertedData[] {
    const map: {
        [key: number]: ConvertedData;
    } = {};
    const tree: ConvertedData[] = [];
    data.forEach((item) => {
        map[item.id] = {
            parentId: item.parentId,
            type: item.type,
            url: item.url,
            id: item.id,
            name: item.name,
            path: item.path,
            checked: false,
        };
    });
    console.log("data2", data);
    data.forEach((item) => {
        const convertedItem = map[item.id];
        console.log("converedItem", convertedItem);

        if (item.parentId === 1) {
            // Root node
            tree.push(convertedItem);
        } else {
            // Child node
            const parent = map[item.parentId];
            console.log("parent", convertedItem);

            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(convertedItem);
        }
    });
    return tree;
}
