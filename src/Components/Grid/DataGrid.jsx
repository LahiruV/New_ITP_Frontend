import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const DataGridTable = (props) => {
    return (
        <div>
            <DataGrid
                rows={props.data}
                columns={props.columns}
                paginationModel={{ pageSize: props.pageSize, page: 0 }}
                style={{ color: 'black', backgroundColor: 'white' }}
                getRowId={(row) => row._id}
            />
        </div>
    );
};

export default DataGridTable;
