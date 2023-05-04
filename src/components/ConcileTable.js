import React, { useState, useEffect } from 'react'
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from '@mui/material';
import { AiOutlineMinus } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.common.black,
        height: 40
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        height: 56
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.white,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


function ConcileTable({ csvValues, csvTargetValues, onUpdateCsvValues }) {

    const [expandedField, setExpandedField] = useState(null);
    const [clas, setClas] = useState();
    const [classSticky, setClassSticky] = useState();
    const [updatedRowIndex, setUpdatedRowIndex] = useState(null);
    const [indexValue, setIndexValue] = useState(null);
    const [mismatch, setMismatch] = useState(false)
    console.log(indexValue);

    function reduceFunc(total, num) {
        return total + num;
    }

    console.log(csvValues);

    const compareCsvData = () => {
        const newRowClasses = [];
        const newRowSticky = [];
        if (csvValues.length === csvTargetValues.length) {
            for (let i = 0; i < csvValues.length; i++) {
                if (csvValues[i].assignments.length !== csvTargetValues[i].assignments.length) {
                    console.log(`Number of assignments does not match for row ${i}`);
                    newRowClasses[i] = "red-Color";
                    newRowSticky[i] = "red-color-sticky";
                } else {
                    let hasMismatch = false; // Initialize flag to check for mismatches in the employee row
                    for (let j = 0; j < csvValues[i].assignments.length; j++) {
                        if (csvValues[i].assignments[j].name !== csvTargetValues[i].assignments[j].name) {
                            console.log(`Assignment name does not match for row ${i}, assignment ${j}`);
                            newRowClasses[i] = "red-Color";
                            hasMismatch = true;
                        }
                        if (csvValues[i].assignments[j].grossPay !== csvTargetValues[i].assignments[j].grossPay) {
                            console.log(`Assignment grosspay does not match for row ${i}, assignment ${j}`);
                            newRowClasses[i] = "red-Color";
                            hasMismatch = true;
                        }
                        // Add more property comparisons as needed
                    }
                    if (hasMismatch) {
                        newRowClasses[i] = "red-Color-employee red-stripe"; // Set row class for employee row
                        newRowSticky[i] = "red-color-sticky"
                        setClassSticky(newRowSticky);
                    } else 
                }
            }
            setClas(newRowClasses);
            console.log(clas);
        } else {
            console.log("The number of rows in the two files is different");
        }
    };

    useEffect(() => {
        compareCsvData();
    }, [csvValues, csvTargetValues]);


    return (

        <>
            <Row>

                <Col xs={6} lg={6} md={6} sm={6}>
                    <TableContainer component={Paper}>
                        <Table className='reconcile-table'>
                            {csvValues &&
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell style={{ position: "sticky", left: 0, background: "#f5f5f5", width: 100, borderLeft: '4px solid #f5f5f5' }}>ID</StyledTableCell>
                                        <StyledTableCell style={{ position: "sticky", left: 48, background: "#f5f5f5", width: 150 }}>EMPLOYEE NAME</StyledTableCell>
                                        <StyledTableCell>ASSIGNMENT</StyledTableCell>
                                        <StyledTableCell style={{width: 150}}>PAY PERIOD</StyledTableCell>
                                        <StyledTableCell>RATE</StyledTableCell>
                                        <StyledTableCell>HOURS</StyledTableCell>
                                        <StyledTableCell style={{width: 150}}>GROSS PAY</StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                    </TableRow>
                                </TableHead>
                            }
                            <TableBody>
                                {csvValues?.map((csvData, index) => (<>
                                    <StyledTableRow style={{ boxShadow: "none" }} key={csvData.id} className={(csvValues && csvTargetValues && clas) && clas[index]}>
                                        <StyledTableCell style={{ position: "sticky", zIndex: 2, left: 0}}>{console.log(classSticky)}{index + 1}</StyledTableCell>
                                        <StyledTableCell style={{ position: "sticky", zIndex: 2, left: 48 }}>{csvData.employeeName}</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments.length} assignments</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments[0]?.payPeriod.split('-').splice(0, 1)} - {csvData.assignments[csvData.assignments.length - 1]?.payPeriod.split('-').splice(1, 2)}</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments.map(ave => parseInt(ave.rate)).reduce(reduceFunc, 0) / csvData.assignments.map(ave => parseInt(ave.rate)).length}</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments.map(hour => parseInt(hour.hours)).reduce(reduceFunc, 0)}</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments.map(pay => parseInt(pay.grossPay)).reduce(reduceFunc, 0)}</StyledTableCell>
                                        {expandedField === csvData.employeeName ? (
                                            <StyledTableCell><button onClick={() => {
                                                setExpandedField(null);
                                            }} className='btn-plus'><AiOutlineMinus /></button></StyledTableCell>
                                        ) : (
                                            <StyledTableCell><button onClick={() => {
                                                setExpandedField(csvData.employeeName);
                                                setIndexValue(index + 1)
                                            }} className='btn-minus'><AiOutlinePlus /></button></StyledTableCell>
                                        )}

                                    </StyledTableRow>
                                    {expandedField === csvData.employeeName &&
                                        csvData.assignments.map((assign, index) => {
                                            let rowClass = ''; // Initialize row class
                                            let i = '';
                                            let fixbutton = null;
                                            for (i = 0; i < csvValues.length; i++) {
                                                if (csvTargetValues[i].assignments[index]) { // Check if target value exists for this assignment
                                                    if (assign.grossPay !== csvTargetValues[i].assignments[index].grossPay) {
                                                        rowClass = 'red-Color'; // Add class if gross pay does not match
                                                        fixbutton = (
                                                            <button className='fix-button' onClick={() => {
                                                                const newCsvValues = [...csvValues]; // Create a copy of csvValues
                                                                const newGrossPay = csvTargetValues[i].assignments[index].grossPay
                                                                newCsvValues[i].assignments[index].grossPay = newGrossPay; // Update the Gross Pay value in the copy
                                                                onUpdateCsvValues(newCsvValues);
                                                                setUpdatedRowIndex(index);
                                                            }}>
                                                                <AiOutlineCheck /> Fix
                                                            </button>
                                                        )
                                                    }

                                                    if (updatedRowIndex === index) {
                                                        rowClass = "green-Color";
                                                    }
                                                    // Add more property comparisons as needed

                                                    return (
                                                        <StyledTableRow key={`${csvData.employeeName}-${index}`} className={rowClass}>
                                                            <StyledTableCell>{indexValue}.{index + 1}</StyledTableCell>
                                                            <StyledTableCell>{csvData.employeeName}</StyledTableCell>
                                                            <StyledTableCell>{assign.assignment}</StyledTableCell>
                                                            <StyledTableCell>{assign.payPeriod}</StyledTableCell>
                                                            <StyledTableCell>{assign.rate}</StyledTableCell>
                                                            <StyledTableCell>{assign.hours}</StyledTableCell>
                                                            <StyledTableCell>{assign.grossPay}</StyledTableCell>
                                                            <StyledTableCell>{fixbutton}</StyledTableCell>
                                                        </StyledTableRow>
                                                    );
                                                } else {
                                                    return null; // If target value does not exist for this assignment, skip rendering row
                                                }
                                            }
                                        })
                                    }
                                </>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>
                <Col xs={6} lg={6} md={6} sm={6}>
                    <TableContainer component={Paper}>
                        <Table className='reconcile-table'>
                            {csvTargetValues &&
                                <TableHead>
                                    <TableRow >
                                        <StyledTableCell style={{ position: "sticky", left: 0, background: "#f5f5f5", width: 100, borderLeft: '4px solid #f5f5f5' }}>ID</StyledTableCell>
                                        <StyledTableCell style={{ position: "sticky", left: 48, background: "#f5f5f5" }}>EMPLOYEE NAME</StyledTableCell>
                                        <StyledTableCell>ASSIGNMENT</StyledTableCell>
                                        <StyledTableCell>PAY PERIOD</StyledTableCell>
                                        <StyledTableCell>RATE</StyledTableCell>
                                        <StyledTableCell>HOURS</StyledTableCell>
                                        <StyledTableCell>GROSS PAY</StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                    </TableRow>
                                </TableHead>
                            }
                            <TableBody>
                                {csvTargetValues?.map((csvTarData, index) => (<>
                                    <StyledTableRow key={csvTarData.id} className={(csvValues && csvTargetValues && clas) && clas[index]}>
                                        <StyledTableCell className={mismatch ? 'stickyNav-mismatch' : 'stickyNav-normal'} style={{ position: "sticky", left: 0 }}>{index + 1}</StyledTableCell>
                                        <StyledTableCell style={{ position: "sticky", left: 48 }}>{csvTarData.employeeName}</StyledTableCell>
                                        <StyledTableCell>{csvTarData.assignments.length} assignments</StyledTableCell>
                                        <StyledTableCell>{csvTarData.assignments[0]?.payPeriod.split('-').splice(0, 1)} - {csvTarData.assignments[csvTarData.assignments.length - 1]?.payPeriod.split('-').splice(1, 2)}</StyledTableCell>
                                        <StyledTableCell>{csvTarData.assignments.map(ave => parseInt(ave.rate)).reduce(reduceFunc, 0) / csvTarData.assignments.map(ave => parseInt(ave.rate)).length}</StyledTableCell>
                                        <StyledTableCell>{csvTarData.assignments.map(hour => parseInt(hour.hours)).reduce(reduceFunc, 0)}</StyledTableCell>
                                        <StyledTableCell>{csvTarData.assignments.map(pay => parseInt(pay.grossPay)).reduce(reduceFunc, 0)}</StyledTableCell>
                                        {expandedField === csvTarData.employeeName ? (
                                            <StyledTableCell><button onClick={() => setExpandedField(null)} className='btn-plus'><AiOutlineMinus /></button></StyledTableCell>
                                        ) : (
                                            <StyledTableCell><button onClick={() => {
                                                setExpandedField(csvTarData.employeeName);
                                                setIndexValue(index + 1)
                                            }} className='btn-minus'><AiOutlinePlus /></button></StyledTableCell>
                                        )
                                        }

                                    </StyledTableRow>
                                    {expandedField === csvTarData.employeeName &&
                                        csvTarData.assignments.map((assign, index) => {
                                            let rowClass = ''; // Initialize row class
                                            let j = '';
                                            let fixbutton = null;
                                            for (j = 0; j < csvTargetValues.length; j++) {
                                                if (csvValues[j].assignments[index]) { // Check if target value exists for this assignment
                                                    if (assign.grossPay !== csvValues[j].assignments[index].grossPay) {
                                                        rowClass = 'red-Color'; // Add class if gross pay does not match
                                                        fixbutton = (<button className='fix-button'
                                                            onClick={() => {
                                                                 const newCsvValues = [...csvValues]; // Create a copy of csvValues
                                                                const newGrossPay = csvTargetValues[j].assignments[index].grossPay
                                                                newCsvValues[j].assignments[index].grossPay = newGrossPay; // Update the Gross Pay value in the copy
                                                                onUpdateCsvValues(newCsvValues);
                                                                setUpdatedRowIndex(index);
                                                            }}><AiOutlineCheck /> Fix</button>
                                                        )
                                                    }
                                                    if (updatedRowIndex === index) {
                                                        rowClass = "green-Color"
                                                    }
                                                    // Add more property comparisons as needed

                                                    return (
                                                        <StyledTableRow key={`${csvTarData.employeeName}-${index}`} className={rowClass}>
                                                            <StyledTableCell>{indexValue}.{index + 1}</StyledTableCell>
                                                            <StyledTableCell>{csvTarData.employeeName}</StyledTableCell>
                                                            <StyledTableCell>{assign.assignment}</StyledTableCell>
                                                            <StyledTableCell>{assign.payPeriod}</StyledTableCell>
                                                            <StyledTableCell>{assign.rate}</StyledTableCell>
                                                            <StyledTableCell>{assign.hours}</StyledTableCell>
                                                            <StyledTableCell>{assign.grossPay}</StyledTableCell>
                                                            <StyledTableCell>{fixbutton}</StyledTableCell>
                                                        </StyledTableRow>
                                                    );
                                                } else {
                                                    return null; // If target value does not exist for this assignment, skip rendering row
                                                }
                                            }
                                        })
                                    }

                                </>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>
            </Row>
        </>
    )
}

export default ConcileTable;