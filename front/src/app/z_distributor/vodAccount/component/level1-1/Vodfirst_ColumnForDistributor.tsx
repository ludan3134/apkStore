import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../../const/pagenation";
import {StyledTableCell} from "../../../../../const/tablestyle";
import {useTranslation} from "react-i18next";

export function Vodfirst_ColumnForDistributor(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">{t("name")}</StyledTableCell>
                <StyledTableCell align="center">{t("List")}</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
