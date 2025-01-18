import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../../const/pagenation";
import {StyledTableCell} from "../../../../../const/tablestyle";

export function ClassList_Column(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">资源分类</StyledTableCell>
                <StyledTableCell align="center">关键字</StyledTableCell>
                <StyledTableCell align="center">创建时间</StyledTableCell>
                <StyledTableCell align="center">更新时间</StyledTableCell>
                <StyledTableCell align="center">查看</StyledTableCell>
                <StyledTableCell align="center">编辑</StyledTableCell>
                <StyledTableCell align="center">删除</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
