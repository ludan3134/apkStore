import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {StyledTableCell} from "../../../../const/tablestyle";
import {EnhancedTableProps} from "../../../../const/pagenation";

export function TVterminal_Column(props: EnhancedTableProps) {
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
                {/*<StyledTableCell align="center">电视终端id</StyledTableCell>*/}
                <StyledTableCell align="center">mac地址</StyledTableCell>
                <StyledTableCell align="center">chipIdentity</StyledTableCell>
                <StyledTableCell align="center">SN码</StyledTableCell>
                <StyledTableCell align="center">批次号</StyledTableCell>
                <StyledTableCell align="center">箱号</StyledTableCell>
                <StyledTableCell align="center">用户id</StyledTableCell>
                <StyledTableCell align="center">是否使用</StyledTableCell>
                <StyledTableCell align="center">激活码</StyledTableCell>
                <StyledTableCell align="center">分销商</StyledTableCell>
                <StyledTableCell align="center">型号</StyledTableCell>
                <StyledTableCell align="center">是否授权</StyledTableCell>

                <StyledTableCell align="center">更新时间</StyledTableCell>
                <StyledTableCell align="center">设置激活状态</StyledTableCell>
                <StyledTableCell align="center">设置服务状态</StyledTableCell>
                <StyledTableCell align="center">更新时间</StyledTableCell>

                <StyledTableCell align="center">编辑</StyledTableCell>
                <StyledTableCell align="center">删除</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
