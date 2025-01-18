import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../const/pagenation";
import {StyledTableCell} from "../../../../const/tablestyle";

export function Xcaccount_Column(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">MAC</StyledTableCell>
                <StyledTableCell align="center">用户名</StyledTableCell>
                <StyledTableCell align="center">密码</StyledTableCell>
                <StyledTableCell align="center">XC类型</StyledTableCell>
                <StyledTableCell align="center">用途</StyledTableCell>
                <StyledTableCell align="center">平台类型</StyledTableCell>
                <StyledTableCell align="center">套餐</StyledTableCell>
                <StyledTableCell align="center">用户状态</StyledTableCell>
                <StyledTableCell align="center">创建时间</StyledTableCell>
                <StyledTableCell align="center">激活时间</StyledTableCell>
                <StyledTableCell align="center">到期时间</StyledTableCell>
                <StyledTableCell align="center">AppName</StyledTableCell>
                <StyledTableCell align="center">编辑</StyledTableCell>
                <StyledTableCell align="center">删除</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
