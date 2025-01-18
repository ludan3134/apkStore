import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../const/pagenation";
import {StyledTableCell} from "../../../../const/tablestyle";

export function MacDevice_Column(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">mac地址</StyledTableCell>
                <StyledTableCell align="center">时间戳</StyledTableCell>

                <StyledTableCell align="center">型号</StyledTableCell>
                <StyledTableCell align="center">版本</StyledTableCell>
                <StyledTableCell align="center">build_Id</StyledTableCell>

                {/*<StyledTableCell align="center">编辑</StyledTableCell>*/}
                {/*<StyledTableCell align="center">删除</StyledTableCell>*/}
            </TableRow>
        </TableHead>
    );
}
