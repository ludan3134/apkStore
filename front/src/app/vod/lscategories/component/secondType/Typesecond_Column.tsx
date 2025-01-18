import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../../const/pagenation";
import {StyledTableCell} from "../../../../../const/tablestyle";

export function Typesecond_Column(props: EnhancedTableProps) {
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
                            color: "white", // 替换为你想要的背景颜色
                        }}
                    />
                </StyledTableCell>
                <StyledTableCell align="center">名称</StyledTableCell>
                <StyledTableCell align="center">中文名称</StyledTableCell>
                <StyledTableCell align="center">是否显示</StyledTableCell>
                <StyledTableCell align="center">排序</StyledTableCell>
                <StyledTableCell align="center">查看子分类选项</StyledTableCell>
                <StyledTableCell align="center">编辑</StyledTableCell>
                <StyledTableCell align="center">删除</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
