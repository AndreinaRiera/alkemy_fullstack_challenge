import Modal from 'react-bootstrap/Modal'
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import defaultConfigUseForm from '../../../utils/defaultConfigUseForm';

import requestsOperations from '../../../API/requestsOperations';

import Button from '../../common/Button';
import CustomDatatable from '../../common/CustomDatatable';

import { SwalFireConfirm, SwalFireConfirmDelete, SwalFireError, SwalFireSuccess } from '../../../utils/SwalFire';

import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function Home() {

    const today = new Date();
    const dateInput = today.getFullYear() + '-' + ((today.getMonth() < 10 && '0') + (today.getMonth() + 1)) + '-' + today.getDate() + 'T00:00';

    const [operationsList, setOperationsList] = useState([]);
    const [financialInformationUser, setFinancialInformationUser] = useState({});
    const [infoEditingOperation, setInfoEditingOperation] = useState({});

    const [showModalOperation, setShowModalOperation] = useState(false);

    const [loadingFormOperation, setLoadingFormOperation] = useState(false);
    const [loadingTableOperations, setLoadingTableOperations] = useState(false);

    const [valueTypeOperation, setValueTypeOperation] = useState('income');

    const { register, handleSubmit, setValue: setValueFormOperation, reset: resetFormOperation } = useForm(defaultConfigUseForm);

    const refreshOperationsList = () => {
        setLoadingTableOperations(true);

        const today = new Date();

        requestsOperations.list().then(res => {
            let historyOperationsList = [];
            let financialInformationUser = {
                balance: 0,
                thisMonth: {
                    income: 0,
                    expense: 0,
                    movements: 0
                }
            };

            if (res && res.data && res.data.data) {
                res.data.data.forEach(item => {
                    financialInformationUser.balance += (item.typeName === 'income') ? item.amount : -item.amount;
                    var date = new Date(item.date);

                    if ((today.getFullYear() === date.getFullYear()) && (today.getMonth() === date.getMonth())) {
                        financialInformationUser.thisMonth.movements++;
                        financialInformationUser.thisMonth[item.typeName] += item.amount;
                    }
                    
                    historyOperationsList.push({
                        ...item,
                        date,
                        type: (item.typeName).ToCapitalize(),
                        balance: financialInformationUser.balance,
                    });
                });
            } else if (res.error) {
                SwalFireError(res.error);
            }

            setFinancialInformationUser(financialInformationUser);
            setOperationsList(historyOperationsList.reverse());

            setLoadingTableOperations(false);
        }).catch(err => {
            setLoadingTableOperations(false);
            console.error(err);
        });
    };

    const head = [
        {
            headerName: "Date",
            field: "formatDate",
        },
        {
            headerName: "Type",
            field: "type",
        },
        {
            headerName: "Concept",
            field: "description",
        },
        {
            headerName: "Amount",
            field: "amount",
        },
        {
            headerName: "Balance",
            field: "balance",
        },
        {
            menuActions: {
                actions: [
                    {
                        title: "Edit",
                        onClick: ({ row }) => {
                            let date = new Date(row.date);
                            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

                            setInfoEditingOperation(row);
                            setValueTypeOperation(row.typeName);

                            [
                                ['date', date.toISOString().slice(0, 16)],
                                ['description', row.description],
                                ['amount', row.amount],
                            ].forEach(([key, value]) => {
                                setValueFormOperation(key, value);
                            });

                            setShowModalOperation(true);
                        }
                    },
                    {
                        title: "Delete",
                        onClick: (rowData) => {
                            SwalFireConfirmDelete(
                                'Delete operation',
                                'Are you sure you want to delete the operation?'
                            ).then(async (result) => {
                                if (result.value) {
                                    try {
                                        const deleted = await requestsOperations.delete(rowData.id);

                                        if (deleted && !deleted.error) {
                                            SwalFireSuccess('Deleted operation');
                                            refreshOperationsList();
                                        }

                                    } catch (error) {
                                        SwalFireError();
                                    }
                                }
                            }).catch(err => console.error(err));

                        }
                    }
                ]
            }
        }
    ];

    useEffect(() => {
        refreshOperationsList();
    }, []);


    const onClickCreateOperation = () => {
        resetFormOperation();
        setInfoEditingOperation({});
        setShowModalOperation(true);
    }

    const CloseModalOperation = () => {
        setShowModalOperation(false);
    };

    const handleSubmitOperation = async (data) => {
        if (data.amount < 1) {
            SwalFireError('The amount must be greater than 0');
            return;
        }

        const loading = (_loading = true) => {
            setLoadingFormOperation(_loading);
            if (!_loading) setShowModalOperation(false);
        };

        loading();

        const sendRequest = () => {
            const dataObj = {
                ...data,
                type: valueTypeOperation
            };

            const promiseOperation = infoEditingOperation.id
                ? requestsOperations.update(infoEditingOperation.id, dataObj)
                : requestsOperations.create(dataObj);

            promiseOperation.then(res => {
                loading(false);
                refreshOperationsList();
            }).catch(err => {
                loading(false);
                console.error(err);
            });
        };

        // Calculate balance final
        let balanceNext = Number(financialInformationUser.balance) + Number(valueTypeOperation == 'income' ? data.amount : -data.amount);
        // and return the balance of the edited operation (if it is edited)
        let editedOperationRefund = (infoEditingOperation.id) ? (infoEditingOperation.typeName == 'income' ? -infoEditingOperation.balance : infoEditingOperation.balance) : 0;
        balanceNext += Number(editedOperationRefund);

        //  if the balance will be positive continue
        if (balanceNext > 0) {
            sendRequest();
        } else {
            // Else, ask for confirmation
            SwalFireConfirm({
                title: 'Are you sure to perform this operation?',
                text: 'The current balance is $' + financialInformationUser.balance + '. You will be on a negative balance',
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    sendRequest();
                } else {
                    loading(false);
                }
            });
        }
    };

    return (
        <>
            {/* Cards with general information */}
            <div className="row pb-5">
                {
                    [
                        ['$' + financialInformationUser.balance, 'Current balance'],
                        [financialInformationUser.thisMonth?.movements, 'Movements this month'],
                        ['$' + financialInformationUser.thisMonth?.income, 'earned this month'],
                        ['$' + financialInformationUser.thisMonth?.expense, 'debited this month'],
                    ].map(([quantity, descripcion], index) => (
                        <div className="col my-2" key={index}>
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <h1 style={{
                                        fontSize: '1.2rem',
                                    }}>{quantity || '0'} {descripcion}</h1>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            {/* Operations information table */}
            <div className="row mt-5">
                <div className="col">
                    <CustomDatatable head={head} data={operationsList} loading={loadingTableOperations} rightSection={
                        <Button variant="primary" loading={loadingFormOperation} onClick={onClickCreateOperation}>Create new movement</Button>
                    } />
                </div>
            </div>


            {/* Modal for create and edit operations */}
            <Modal show={showModalOperation} onHide={CloseModalOperation}>
                <form onSubmit={handleSubmit(handleSubmitOperation)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{infoEditingOperation ? "Edit operation" : "Create new operation"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <TextField
                            label="Date and time"
                            type="datetime-local"
                            defaultValue={dateInput}
                            className="w-100"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            {...register("date", { required: true })}
                        />

                        <FormControl fullWidth className='mt-3'>
                            <InputLabel id="type-select-label">Type</InputLabel>
                            <Select
                                labelId="type-select-label"
                                value={valueTypeOperation}
                                defaultValue={valueTypeOperation}
                                label="Type"
                                onChange={e => setValueTypeOperation(e.target.value)}
                            >
                                <MenuItem value="income">Income</MenuItem>
                                <MenuItem value="expense">Expense</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Concept"
                            type="text"
                            className="w-100 mt-3"
                            {...register("description")}
                        />

                        <TextField
                            label="Amount"
                            type="number"
                            className="w-100 mt-3"
                            min="1"
                            {...register("amount", {
                                required: true,
                            })}
                        />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button submit variant="primary" loading={loadingFormOperation}>Save operation</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}
