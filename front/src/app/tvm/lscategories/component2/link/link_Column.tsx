import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../../const/pagenation";
import {StyledTableCell} from "../../../../../const/tablestyle";

export function Link_Column2(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">关键字</StyledTableCell>
                <StyledTableCell align="center">频道ID</StyledTableCell>
                <StyledTableCell align="center">链接</StyledTableCell>
                <StyledTableCell align="center">来源</StyledTableCell>
                <StyledTableCell align="center">排序</StyledTableCell>
                <StyledTableCell align="center">是否使用</StyledTableCell>
                <StyledTableCell align="center">分辨率/码率</StyledTableCell>
                <StyledTableCell align="center">视频/音频/帧率</StyledTableCell>
                {/*<StyledTableCell align="center">编辑</StyledTableCell>*/}
                {/*<StyledTableCell align="center">删除</StyledTableCell>*/}
            </TableRow>
        </TableHead>
    );
}
