import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../const/pagenation";
import {StyledTableCell} from "../../../../const/tablestyle";

export function Domaingroup_Column(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">id</StyledTableCell>
                <StyledTableCell align="center">name</StyledTableCell>
                <StyledTableCell align="center">startMac</StyledTableCell>
                <StyledTableCell align="center">endMac</StyledTableCell>
                <StyledTableCell align="center">count</StyledTableCell>
                <StyledTableCell align="center">updatedAt</StyledTableCell>
                <StyledTableCell align="center">deleted</StyledTableCell>
                <StyledTableCell align="center">isUse</StyledTableCell>
                <StyledTableCell align="center">serverList</StyledTableCell>
                <StyledTableCell align="center">编辑</StyledTableCell>
                <StyledTableCell align="center">删除</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
