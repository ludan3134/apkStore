import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../const/pagenation";
import {StyledTableCell} from "../../../../const/tablestyle";

export function Playback_Column(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">回放名称</StyledTableCell>
                {/*<StyledTableCell align="center">频道ID</StyledTableCell>*/}
                {/*<StyledTableCell align="center">预告名</StyledTableCell>*/}
                {/*<StyledTableCell align="center">是否有回放</StyledTableCell>*/}
                {/*<StyledTableCell align="center">XC真实分类ID</StyledTableCell>*/}
                <StyledTableCell align="center">频道列表</StyledTableCell>
                <StyledTableCell align="center">绑定回放</StyledTableCell>
                <StyledTableCell align="center">删除</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
