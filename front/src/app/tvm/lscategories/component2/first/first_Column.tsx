import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../../const/pagenation";
import {StyledTableCell} from "../../../../../const/tablestyle";

export function First_Column2(props: EnhancedTableProps) {
    const {onSelectAllClick, numSelected, rowCount} = props;
    return (
        <TableHead>
            <TableRow>
                {/*<StyledTableCell padding="checkbox">*/}
                {/*    <Checkbox*/}
                {/*        color="primary"*/}
                {/*        indeterminate={numSelected > 0 && numSelected < rowCount}*/}
                {/*        checked={rowCount > 0 && numSelected === rowCount}*/}
                {/*        onChange={onSelectAllClick}*/}
                {/*        inputProps={{*/}
                {/*            "aria-label": "select all desserts",*/}
                {/*        }}*/}
                {/*        sx={{*/}
                {/*            // 设置背景颜色*/}
                {/*            color: "white", // 替换为你想要的背景颜色*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</StyledTableCell>*/}
                <StyledTableCell align="center">名称</StyledTableCell>
                <StyledTableCell align="center">绑定XC套餐</StyledTableCell>
                <StyledTableCell align="center">创建时间</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
