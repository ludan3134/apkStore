import {TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../../const/pagenation";
import {StyledTableCell} from "../../../../../const/tablestyle";

export function Third_Column2(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">排序</StyledTableCell>
                <StyledTableCell align="center">名称</StyledTableCell>


                <StyledTableCell align="center">图片</StyledTableCell>

                {/*<StyledTableCell align="center">分类</StyledTableCell>*/}
                {/*<StyledTableCell align="center">频道号</StyledTableCell>*/}
                {/*<StyledTableCell align="center">回放频道名</StyledTableCell>*/}
                <StyledTableCell align="center">回放</StyledTableCell>
                <StyledTableCell align="center">预告</StyledTableCell>
                <StyledTableCell align="center">是否使用</StyledTableCell>
                <StyledTableCell align="center">是否加密</StyledTableCell>
                <StyledTableCell align="center">分辨率</StyledTableCell>
                <StyledTableCell align="center">码率</StyledTableCell>
                <StyledTableCell align="center">视频</StyledTableCell>
                <StyledTableCell align="center">音频</StyledTableCell>
                <StyledTableCell align="center">帧率</StyledTableCell>


                {/*<StyledTableCell align="center">推荐排序</StyledTableCell>*/}
                {/*<StyledTableCell align="center">是否推荐</StyledTableCell>*/}
            </TableRow>
        </TableHead>
    );
}
