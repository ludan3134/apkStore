export interface BackendData {
    id: number;
    name: string;
    type: number;
    parentId: number;
    url: string;
    path: string;
}

export interface ConvertedData {
    id: number;
    name: string;
    url: string;
    children?: ConvertedData[];
    checked?: boolean;
    parentId: number;
    type: number;
    path: string;
}
