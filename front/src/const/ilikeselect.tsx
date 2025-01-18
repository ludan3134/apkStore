import {SelectProps} from "antd";

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
}

export interface iLikeSelectValue {
    label: string;
    value: number;
    title:string
}
