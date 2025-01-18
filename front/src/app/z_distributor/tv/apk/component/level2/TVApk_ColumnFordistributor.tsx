import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../../../const/pagenation";
import {StyledTableCell} from "../../../../../../const/tablestyle";
import {useTranslation} from "react-i18next";

export function TVApk_ColumnFordistributor(props: EnhancedTableProps) {
    const {t} = useTranslation();

    const {onSelectAllClick, numSelected, rowCount} = props;
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
                <StyledTableCell align="center">{t("name")}</StyledTableCell>

                <StyledTableCell align="center">{t("类型")}</StyledTableCell>
                <StyledTableCell align="center">{t("包名")}</StyledTableCell>
                <StyledTableCell align="center">logo</StyledTableCell>
                <StyledTableCell align="center">{t("排序")}</StyledTableCell>
                <StyledTableCell align="center">{t("model")}</StyledTableCell>
                <StyledTableCell align="center">{t("发布市场")}</StyledTableCell>
                {/*<StyledTableCell align="center">滚动</StyledTableCell>*/}
                {/*<StyledTableCell align="center">是否弹框提示</StyledTableCell>*/}
                <StyledTableCell align="center">{t("创建时间")}</StyledTableCell>
                <StyledTableCell align="center">{t("更新时间")}</StyledTableCell>
                <StyledTableCell align="center">{t("version")}</StyledTableCell>
                <StyledTableCell align="center">{t("edit")}</StyledTableCell>
                <StyledTableCell align="center">{t("delete")}</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
