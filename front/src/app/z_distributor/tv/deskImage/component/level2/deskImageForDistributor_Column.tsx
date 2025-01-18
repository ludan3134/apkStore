import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {useTranslation} from "react-i18next";
import {EnhancedTableProps} from "../../../../../../const/pagenation";
import {StyledTableCell} from "../../../../../../const/tablestyle";

export function DeskImageForDistributor_Column(props: EnhancedTableProps) {
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
                {/*<StyledTableCell align="center">{t("model")}</StyledTableCell>*/}
                <StyledTableCell align="center">{t("image")}</StyledTableCell>
                <StyledTableCell align="center">{t("sort")}</StyledTableCell>
                <StyledTableCell align="center">{t("isUse")}</StyledTableCell>
                {/*<StyledTableCell align="center">{t("md5")}</StyledTableCell>*/}
                {/*<StyledTableCell align="center">{t("serialNumber")}</StyledTableCell>*/}
                {/*/!*<StyledTableCell align="center">内容</StyledTableCell>*!/*/}
                {/*<StyledTableCell align="center">{t("fileSize")}</StyledTableCell>*/}
                {/*<StyledTableCell align="center">{t("creationTime")}</StyledTableCell>*/}
                {/*<StyledTableCell align="center">{t("updateTime")}</StyledTableCell>*/}
                {/*<StyledTableCell align="center">{t("image")}</StyledTableCell>*/}
                <StyledTableCell align="center">{t("edit")}</StyledTableCell>
                <StyledTableCell align="center">{t("delete")}</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
