import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../const/pagenation";
import {StyledTableCell} from "../../../../const/tablestyle";

export function FailedRecord_Column(props: EnhancedTableProps) {
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
                {/*<StyledTableCell align="center">终端id</StyledTableCell>*/}
                <StyledTableCell align="center">平台类型</StyledTableCell>
                <StyledTableCell align="center">接口</StyledTableCell>

                <StyledTableCell align="center">批次</StyledTableCell>
                <StyledTableCell align="center">参数</StyledTableCell>
                <StyledTableCell align="center">mac</StyledTableCell>
                <StyledTableCell align="center">chip</StyledTableCell>
                <StyledTableCell align="center">sn</StyledTableCell>

                <StyledTableCell align="center">激活码</StyledTableCell>
                <StyledTableCell align="center">创建时间</StyledTableCell>
                <StyledTableCell align="center">总数</StyledTableCell>
                <StyledTableCell align="center">错误</StyledTableCell>
                <StyledTableCell align="center">扩展信息</StyledTableCell>

                {/*<StyledTableCell align="center">编辑</StyledTableCell>*/}
                {/*<StyledTableCell align="center">删除</StyledTableCell>*/}
            </TableRow>
        </TableHead>
    );
}
