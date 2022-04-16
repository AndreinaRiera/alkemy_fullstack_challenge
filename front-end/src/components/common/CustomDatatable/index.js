import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';

import IconButton from '@mui/material/IconButton';

import { DataGrid, esES } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import './styles.scss';

//https://mui.com/api/data-grid/data-grid/
//https://smartdevpreneur.com/add-buttons-links-and-other-custom-cells-in-material-ui-datagrid/

export default function CustomDatatable({ data, head, inputFilter = true, className, loading, small, striped, rightSection, leftSection, ...rest }) {
    const [dataFiltered, setDataFiltered] = useState([]);
    const [filterDatatable, setFilterDatatable] = useState('');

    const [dataRowMenu, setDataRowMenu] = useState(null);

    const [anchorElMenuActions, setAnchorElMenuActions] = useState(null);
    const openMenuActions = anchorElMenuActions ? true : false;

    const [newLoading, setNewLoading] = useState(loading);

    useEffect(() => {
        setNewLoading(loading);
    }, [loading]);

    const defaultHead = {
        headerName: "",
        flex: 1,
    };

    head = head.map(item => {
        var newDefaultHead = { ...defaultHead };

        if (!item.hasOwnProperty('renderCell')) {
            var showTooltip = item.hasOwnProperty('showTooltip') ? item.showTooltip : true;
            var changeForCheckIcon = item.hasOwnProperty('changeForCheckIcon') ? item.changeForCheckIcon : false;
            var menuActions = item.hasOwnProperty('menuActions') ? item.menuActions : false;

            var renderCell = false;

            if (showTooltip) {
                renderCell = "showTooltip";
            }

            if (changeForCheckIcon) {
                renderCell = "changeForCheckIcon";
            }

            if (menuActions) {
                renderCell = "menuActions";
            }

            if (renderCell) {
                switch (renderCell) {
                    case "showTooltip":
                        newDefaultHead.renderCell = (row) => {
                            return  row.value ? <Tooltip title={row.value} >
                                <span className="csutable-cell-trucate">{row.value}</span>
                            </ Tooltip> : '';
                        }
                        break;

                    case "changeForCheckIcon":
                        newDefaultHead.renderCell = (row) => {
                            return row.value ? <FontAwesomeIcon icon="fa-check" /> : "";
                        }

                        newDefaultHead = {
                            ...newDefaultHead,
                            align: "center",
                            headerAlign: "center",
                            field: "actions",
                            maxWidth: 90,
                            filterable: false,
                            disableColumnFilter: true,
                        };
                        break;

                    case "menuActions":
                        newDefaultHead.renderCell = (params) => {
                            const onClick = (e) => {
                                setDataRowMenu(params);
                                setAnchorElMenuActions(e.currentTarget);
                            };

                            const handleClose = () => {
                                setAnchorElMenuActions(null);
                            };

                            const clickOption = action => {
                                action.onClick(dataRowMenu);
                                handleClose();
                            };

                            return (
                                <>
                                    < IconButton
                                        aria-controls={openMenuActions ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={openMenuActions ? 'true' : undefined}
                                        onClick={onClick}
                                        size="small"
                                    >
                                        {menuActions.title || <FontAwesomeIcon icon="fa-bars" />}
                                    </ IconButton >
                                    <Menu
                                        anchorEl={anchorElMenuActions}
                                        open={openMenuActions}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                        elevation={1}
                                    >
                                        {menuActions.actions.map((action, index) => {
                                            return <MenuItem key={index} onClick={() => clickOption(action)}>{action.title}</MenuItem>
                                        })}
                                    </Menu>
                                </>
                            );
                        };

                        newDefaultHead = {
                            ...newDefaultHead,
                            align: "center",
                            headerAlign: "center",
                            field: "actions",
                            maxWidth: 45,
                            sortable: false,
                            filterable: false,
                            disableColumnMenu: true,
                            disableColumnFilter: true,
                            disableColumnSelector: true,
                        };
                        break;
                };
            };
        }

        return {
            ...newDefaultHead,
            ...item,
        };
    });

    useEffect(() => {
        const filter = filterDatatable.toLowerCase();

        const newData = filterDatatable ?
            data.filter(row => {
                for (const property in row) {
                    var value = row[property].toString().toLowerCase();

                    if (value.includes(filter)) {
                        return true;
                    }
                }
            })
            : data;

        setDataFiltered(newData);
    }, [filterDatatable, data]);


    return (
        <div className={` custom-datatable ${striped && 'striped'} ${className || ''}`}>
            {inputFilter && (
                <div className="row justify-content-end mb-4">
                    {
                        leftSection && (
                            <div className="col-auto">
                                {leftSection}
                            </div>
                        )
                    }
                    <div className=" col">
                        <div className="relative p-0">
                            <input type="text" value={filterDatatable} onChange={e => setFilterDatatable(e.target.value)} className="form-control" placeholder="Buscar" aria-label="Buscar" />
                            {filterDatatable && (<span className="pointer absolute top right p-2 m-1 small" onClick={e => setFilterDatatable("")}><FontAwesomeIcon icon="xmark" className=' text-muted fw-bold' /></span>)}
                        </div>
                    </div>

                    {
                        rightSection && (
                            <div className="col-auto">
                                {rightSection}
                            </div>
                        )
                    }
                </div>
            )}

            <DataGrid
                {...rest}
                style={{ width: '100%' }}
                rows={dataFiltered}
                columns={head}
                rowsPerPageOptions={[5]}
                autoHeight={true}
                density={small ? 'compact' : 'standard'}
                disableSelectionOnClick
                loading={newLoading}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
        </div>
    )
}
