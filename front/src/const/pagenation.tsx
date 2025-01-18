import Box from "@mui/system/Box";
import IconButton from "@mui/material/IconButton";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import * as React from "react";
import {useTheme} from "@mui/material/styles";
import {TextField} from "@mui/material";
import {values} from "lodash";

export interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

export interface EnhancedTableProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;
}

// 分页组件
export function MyTablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const {count, page, rowsPerPage, onPageChange} = props;
    console.log("count",count)
    console.log("rowperpage",rowsPerPage)
    console.log(" Math.ceil(count / rowsPerPage)", Math.ceil(count / rowsPerPage))


    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPage = event.target.value ? parseInt(event.target.value, 10) - 1 : 0;
        if (newPage >= 0 && newPage < Math.ceil(count / rowsPerPage)) {
            onPageChange(null, newPage);
        }
    };

    return (
        <Box sx={{flexShrink: 0, ml: 2.5}}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === "rtl" ? <LastPageIcon/> : <FirstPageIcon/>}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowRight/>
                ) : (
                    <KeyboardArrowLeft/>
                )}
            </IconButton>
            <TextField id="standard-basic"
                       hiddenLabel
                       variant="outlined"
                       value={page+1}
                       type={"number"}
                       size={"small"}
                       color="primary"
                       inputProps={{
                           min: 1,
                           max: Math.ceil(count / rowsPerPage),
                           style: { textAlign: 'center' }
                       }}
                       onChange={handleTextFieldChange}
            />
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft/>
                ) : (
                    <KeyboardArrowRight/>
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === "rtl" ? <FirstPageIcon/> : <LastPageIcon/>}
            </IconButton>
        </Box>
    );
}
