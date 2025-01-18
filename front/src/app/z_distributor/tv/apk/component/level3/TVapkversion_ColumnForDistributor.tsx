import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../../../const/pagenation";
import {StyledTableCell} from "../../../../../../const/tablestyle";
import {useTranslation} from "react-i18next";

export function TVapkversion_ColumnForDistributor(props: EnhancedTableProps) {
    const {onSelectAllClick, numSelected, rowCount} = props;
    const {t} = useTranslation();

    return (
        <TableHead>
            <TableRow>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all desserts",
                        }}
                        sx={{
                            // 设置背景颜色
                            color: "white", // 替换为你想要的背景颜色
                        }}
                    />
                </StyledTableCell>
                {/*<StyledTableCell align="center">id</StyledTableCell>*/}
                {/*<StyledTableCell align="center">创建时间</StyledTableCell>*/}
                {/*<StyledTableCell align="center">更新时间</StyledTableCell>*/}
                {/*<StyledTableCell align="center">固件Id</StyledTableCell>*/}
                <StyledTableCell align="center">{t("version")}</StyledTableCell>
                <StyledTableCell align="center">MD5</StyledTableCell>
                {/*<StyledTableCell align="center">存放路径</StyledTableCell>*/}
                <StyledTableCell align="center">{t("content")}</StyledTableCell>
                <StyledTableCell align="center">{t("强制更新")}</StyledTableCell>
                {/*<StyledTableCell align="center">服务器位置</StyledTableCell>*/}
                <StyledTableCell align="center">{t("文件大小")}</StyledTableCell>
                <StyledTableCell align="center">{t("创建时间")}</StyledTableCell>
                <StyledTableCell align="center">{t("更新时间")}</StyledTableCell>
                {/*<StyledTableCell align="center">是否删除</StyledTableCell>*/}
                <StyledTableCell align="center">{t("强制卸载")}</StyledTableCell>
                <StyledTableCell align="center">{t("edit")}</StyledTableCell>
                <StyledTableCell align="center">{t("delete")}</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
