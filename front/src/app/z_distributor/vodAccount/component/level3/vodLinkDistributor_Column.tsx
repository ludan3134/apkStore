import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {useTranslation} from "react-i18next";
import {EnhancedTableProps} from "../../../../../const/pagenation";
import {StyledTableCell} from "../../../../../const/tablestyle";


export function VodLinkLinkDistributor_Column(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">{t("season")}</StyledTableCell>
                <StyledTableCell align="center">{t("episode")}</StyledTableCell>
                <StyledTableCell align="center">{t("keyword")}</StyledTableCell>
                <StyledTableCell align="center">{t("Link")}</StyledTableCell>
                <StyledTableCell align="center">{t("edit")}</StyledTableCell>
                <StyledTableCell align="center">{t("delete")}</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
