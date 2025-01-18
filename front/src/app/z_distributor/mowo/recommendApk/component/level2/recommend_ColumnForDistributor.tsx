import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {StyledTableCell} from "../../../../../../const/tablestyle";
import {EnhancedTableProps} from "../../../../../../const/pagenation";
import {useTranslation} from "react-i18next";

export function Recommend_ColumnForDistributor(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">{t("图片")}</StyledTableCell>
                <StyledTableCell align="center">{t("包名")}</StyledTableCell>
                <StyledTableCell align="center">{t("name")}</StyledTableCell>
                <StyledTableCell align="center">{t("排序")}</StyledTableCell>
                <StyledTableCell align="center">{t("选项")}</StyledTableCell>
                {/*<StyledTableCell align="center">语言</StyledTableCell>*/}
                {/*<StyledTableCell align="center">绑定分销商型号</StyledTableCell>*/}

                <StyledTableCell align="center">{t("edit")}</StyledTableCell>
                <StyledTableCell align="center">{t("delete")}</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
