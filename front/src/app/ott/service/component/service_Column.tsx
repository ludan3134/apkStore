import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../const/pagenation";
import {StyledTableCell} from "../../../../const/tablestyle";

export function PortalInfo_Column(props: EnhancedTableProps) {
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
                {/*<StyledTableCell align="center">提供者</StyledTableCell>*/}
                <StyledTableCell align="center">服务类型</StyledTableCell>
                <StyledTableCell align="center">服务地址</StyledTableCell>
                <StyledTableCell align="center">是否服务</StyledTableCell>

                <StyledTableCell align="center">基础URL</StyledTableCell>
                <StyledTableCell align="center">更新时间</StyledTableCell>

                <StyledTableCell align="center">编辑</StyledTableCell>
                <StyledTableCell align="center">删除</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
