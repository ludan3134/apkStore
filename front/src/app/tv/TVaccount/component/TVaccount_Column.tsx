import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../const/pagenation";
import {StyledTableCell} from "../../../../const/tablestyle";

export function TVAccount_Column(props: EnhancedTableProps) {
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
                {/*<StyledTableCell align="center">账户id</StyledTableCell>*/}
                <StyledTableCell align="center">批次号</StyledTableCell>
                <StyledTableCell align="center">盒子Id</StyledTableCell>
                {/*<StyledTableCell align="center">盒子id</StyledTableCell>*/}
                <StyledTableCell align="center">分销商</StyledTableCell>
                <StyledTableCell align="center">型号</StyledTableCell>
                <StyledTableCell align="center">mac地址</StyledTableCell>
                <StyledTableCell align="center">chipIdentity</StyledTableCell>
                <StyledTableCell align="center">是否授权</StyledTableCell>
                <StyledTableCell align="center">是否激活(isActive)</StyledTableCell>
                <StyledTableCell align="center">
                    是否处于服务期(isService)
                </StyledTableCell>
                <StyledTableCell align="center">是否过期</StyledTableCell>
                {/*<StyledTableCell align="center">注册时间</StyledTableCell>*/}
                {/*<StyledTableCell align="center">激活时间</StyledTableCell>*/}
                {/*<StyledTableCell align="center">过期日志</StyledTableCell>*/}
                <StyledTableCell align="center">激活时间</StyledTableCell>
                {/*<StyledTableCell align="center">更新时间</StyledTableCell>*/}
                <StyledTableCell align="center">编辑</StyledTableCell>
                <StyledTableCell align="center">删除</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
