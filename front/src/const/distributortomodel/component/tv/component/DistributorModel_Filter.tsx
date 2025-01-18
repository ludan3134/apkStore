import React from "react";
import {Button, Stack} from "@mui/material";
import {DistributorInputStoreProxy} from "../../../store/store";
import {IsConfirmDialog} from "../../../../alert/store";
import Distributor2Model from "../../distributor2model";

const DistributorModel_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const handleSubFormSubmit = () => {
        IsConfirmDialog.refleshPage = true;
    };
    const handleResetForm = () => {
        DistributorInputStoreProxy.DistributorValue = "";
        DistributorInputStoreProxy.ModelValue = "";
    };

    return (
        <Stack direction="row" spacing={1}>
            <Stack sx={{minWidth: "300px"}}>
                <Distributor2Model/>
            </Stack>
            <Button type="button" onClick={handleSubFormSubmit}>
                筛选
            </Button>
            <Button type="button" onClick={handleResetForm}>
                重置
            </Button>
        </Stack>
    );
};

export default DistributorModel_Filter;
