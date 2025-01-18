import {EnhancedTableProps} from "../../../../const/pagenation";
import {Checkbox, TableHead} from "@mui/material";
import React from "react";
import {StyledTableCell} from "../../../../const/tablestyle";
import TableRow from "@mui/material/TableRow";

export function User_Column(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">用户名</StyledTableCell>
                {/*<StyledTableCell align="center">创建时间</StyledTableCell>*/}
                {/*<StyledTableCell align="center">更新时间</StyledTableCell>*/}
                <StyledTableCell align="center">角色</StyledTableCell>
                <StyledTableCell align="center">分销商</StyledTableCell>
                <StyledTableCell align="center">状态</StyledTableCell>
                <StyledTableCell align="center">编辑用户</StyledTableCell>
                <StyledTableCell align="center">删除用户</StyledTableCell>
                <StyledTableCell align="center">重置密码</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
