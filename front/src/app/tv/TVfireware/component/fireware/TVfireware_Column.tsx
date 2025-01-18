import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {StyledTableCell} from "../../../../../const/tablestyle";
import {EnhancedTableProps} from "../../../../../const/pagenation";

export function TVFireware_Column(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">名称</StyledTableCell>
                <StyledTableCell align="center">分销商</StyledTableCell>
                <StyledTableCell align="center">型号</StyledTableCell>
                <StyledTableCell align="center">是否使用</StyledTableCell>
                <StyledTableCell align="center">创建时间</StyledTableCell>
                <StyledTableCell align="center">更新时间</StyledTableCell>
                <StyledTableCell align="center">查看电视固件版本</StyledTableCell>
                <StyledTableCell align="center">编辑电视固件</StyledTableCell>
                <StyledTableCell align="center">删除电视固件</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
