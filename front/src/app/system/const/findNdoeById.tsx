import {ConvertedData} from "./treedata";

export function findNodeById(
    node: ConvertedData[],
    id: string,
): ConvertedData | undefined {
    console.log("id", id);
    console.log("node", node);
    for (const currentNode of node) {
        if (currentNode.id.toString() === id) {
            console.log("node.id==id");
            return currentNode;
        }

        if (Array.isArray(currentNode.children)) {
            const foundNode = findNodeById(currentNode.children, id);
            if (foundNode) {
                return foundNode;
            }
        }
    }

    return undefined;
}
