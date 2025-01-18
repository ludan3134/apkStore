import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../../../const/pagenation";
import {StyledTableCell} from "../../../../../../const/tablestyle";
import {useTranslation} from "react-i18next";

export function Video_ColumnForDistributor(props: EnhancedTableProps) {
    const {onSelectAllClick, numSelected, rowCount} = props;
    const {t} = useTranslation();

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
                <StyledTableCell align="center">{t("name")}</StyledTableCell>
                <StyledTableCell align="center">{t("releaseYear")}</StyledTableCell>
                <StyledTableCell align="center">{t("duration")}</StyledTableCell>
                {/*<StyledTableCell align="center">浏览量</StyledTableCell>*/}
                <StyledTableCell align="center">{t("图片")}</StyledTableCell>
                {/*<StyledTableCell align="center">来源</StyledTableCell>*/}
                <StyledTableCell align="center">YoutubeID</StyledTableCell>
                {/*<StyledTableCell align="center">youtube地址</StyledTableCell>*/}
                <StyledTableCell align="center">{t("排序")}</StyledTableCell>
                {/*<StyledTableCell align="center">推荐排序</StyledTableCell>*/}
                {/*<StyledTableCell align="center">地区</StyledTableCell>*/}
                <StyledTableCell align="center">{t("language")}</StyledTableCell>
                {/*<StyledTableCell align="center">默认语言</StyledTableCell>*/}
                <StyledTableCell align="center">{t("类型")}</StyledTableCell>
                <StyledTableCell align="center">{t("选项")}</StyledTableCell>
                {/*<StyledTableCell align="center">绑定分销商</StyledTableCell>*/}

                <StyledTableCell align="center">{t("edit")}</StyledTableCell>
                <StyledTableCell align="center">{t("delete")}</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
