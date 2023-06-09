import React, { useState, useEffect } from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from '@mui/material';
import { AiOutlineMinus } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";
import { Grid } from "@mui/material"

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

    function reduceFunc(total, num) {
        return total + num;
    }

    const compareCsvData = () => {
        const newRowClasses = [];
        const newRowSticky = [];
        if (csvValues.length === csvTargetValues.length) {
            for (let i = 0; i < csvValues.length; i++) {
                if (csvValues[i].assignments.length !== csvTargetValues[i].assignments.length) {
                    newRowClasses[i] = "red-Color";
                    newRowSticky[i] = "red-Color-sticky";
                } else {
                    let hasMismatch = false; // Initialize flag to check for mismatches in the employee row
                    for (let j = 0; j < csvValues[i].assignments.length; j++) {
                        if (csvValues[i].assignments[j].name !== csvTargetValues[i].assignments[j].name) {
                            newRowClasses[i] = "red-Color";
                            hasMismatch = true;
                        }
                        if (csvValues[i].assignments[j].grossPay !== csvTargetValues[i].assignments[j].grossPay) {
                            newRowClasses[i] = "red-Color";
                            hasMismatch = true;
                        }
                    }
                    if (hasMismatch) {
                        newRowClasses[i] = "red-Color-employee red-stripe"; // Set row class for employee row
                        newRowSticky[i] = "red-Color-sticy"
                        setClassSticky(newRowSticky);
                    }
                }
            }
            setClas(newRowClasses);
        } else {
            console.log("The number of rows in the two files is different");
        }
    };


    useEffect(() => {
        compareCsvData();
    }, [csvValues, csvTargetValues]);



    return (

        <>
            <Grid container spacing={1} padding={1}>
                <Grid item md={6} xs={12} sm={12}>

                    <TableContainer component={Paper}>
                        <Table className='reconcile-table'>
                            {csvValues &&
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell style={{ position: "sticky", left: 0, background: "#f5f5f5", borderLeft: '4px solid #f5f5f5' }}>ID</StyledTableCell>
                                        <StyledTableCell style={{ position: "sticky", left: 48, background: "#f5f5f5" }}>EMPLOYEE NAME</StyledTableCell>
                                        <StyledTableCell style={{ position: "sticky", zIndex: 2, left: 138, background: "#f5f5f5" }}>ASSIGNMENT</StyledTableCell>
                                        <StyledTableCell style={{}}>PAY PERIOD</StyledTableCell>
                                        <StyledTableCell>RATE</StyledTableCell>
                                        <StyledTableCell>HOURS</StyledTableCell>
                                        <StyledTableCell style={{ width: 150 }}>GROSS PAY</StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                    </TableRow>
                                </TableHead>
                            }
                            <TableBody>
                                {csvValues?.map((csvData, index) => (<>
                                    <StyledTableRow style={{ boxShadow: "none" }} key={index + 1} className={(csvValues && csvTargetValues && clas) && clas[index]}>
                                        <StyledTableCell className={classSticky && classSticky[index]} style={{ position: "sticky", zIndex: 2, left: 0 }}>{index + 1}</StyledTableCell>
                                        <StyledTableCell className={classSticky && classSticky[index]} style={{ position: "sticky", zIndex: 2, left: 48 }}>{csvData.employeeName}</StyledTableCell>
                                        <StyledTableCell className={classSticky && classSticky[index]} style={{ position: "sticky", zIndex: 2, left: 138 }}>{csvData.assignments.length} assignments</StyledTableCell>
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
                                        csvData.assignments.map((assign, indexChildren) => {

                                            let rowClass = ''; // Initialize row class
                                            let i = '';
                                            let fixbutton = null;
                                            for (i = 0; i < csvValues.length; i++) {
                                                if (csvTargetValues[index].assignments[indexChildren]) { // Check if target value exists for this assignment
                                                    if (assign.grossPay !== csvTargetValues[index].assignments[indexChildren].grossPay) {
                                                        rowClass = 'red-Color'; // Add class if gross pay does not match
                                                        fixbutton = (
                                                            <button className='fix-button' onClick={() => {
                                                                const newCsvValues = [...csvValues]; // Create a copy of csvValues
                                                                const newGrossPay = csvTargetValues[index].assignments[indexChildren].grossPay
                                                                newCsvValues[index].assignments[indexChildren].grossPay = newGrossPay; // Update the Gross Pay value in the copy
                                                                onUpdateCsvValues(newCsvValues);
                                                                setUpdatedRowIndex(indexChildren);

                                                                console.log(csvValues.assignments, "daca", [index][indexChildren]);

                                                                console.log("I: ", index, "|", "Index: ", indexChildren, "|", "Assignment Source Value: ", assign.grossPay, "|", "Assignment Target Value: ", csvTargetValues[index].assignments[indexChildren].grossPay, "|", "newGrossPay: ", newCsvValues[index].assignments[indexChildren].grossPay);
                                                                console.log('srcData: ', csvValues)
                                                            }}>
                                                                <AiOutlineCheck /> Fix
                                                            </button>
                                                        )
                                                    }

                                                    if (updatedRowIndex === indexChildren) {
                                                        rowClass = "green-Color";
                                                    }

                                                    return (
                                                        <StyledTableRow key={`${index + indexChildren}`} className={rowClass}>
                                                            <StyledTableCell>{indexValue}.{indexChildren + 1}</StyledTableCell>
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

                </Grid>


                <Grid item md={6} xs={12} sm={12}>

                    <TableContainer component={Paper}>
                        <Table className='reconcile-table'>
                            {csvValues &&
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell style={{ position: "sticky", left: 0, background: "#f5f5f5", width: 100, borderLeft: '4px solid #f5f5f5' }}>ID</StyledTableCell>
                                        <StyledTableCell style={{ position: "sticky", left: 48, background: "#f5f5f5", width: 150 }}>EMPLOYEE NAME</StyledTableCell>
                                        <StyledTableCell style={{ position: "sticky", zIndex: 2, left: 138, background: "#f5f5f5" }}>ASSIGNMENT</StyledTableCell>
                                        <StyledTableCell style={{ width: 150 }}>PAY PERIOD</StyledTableCell>
                                        <StyledTableCell>RATE</StyledTableCell>
                                        <StyledTableCell>HOURS</StyledTableCell>
                                        <StyledTableCell style={{ width: 150 }}>GROSS PAY</StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                    </TableRow>
                                </TableHead>
                            }
                            <TableBody>
                                {csvTargetValues?.map((csvData, index) => (<>
                                    <StyledTableRow style={{ boxShadow: "none" }} key={index + 1} className={(csvValues && csvTargetValues && clas) && clas[index]}>
                                        <StyledTableCell className={classSticky && classSticky[index]} style={{ position: "sticky", zIndex: 2, left: 0 }}>{index + 1}</StyledTableCell>
                                        <StyledTableCell className={classSticky && classSticky[index]} style={{ position: "sticky", zIndex: 2, left: 48 }}>{csvData.employeeName}</StyledTableCell>
                                        <StyledTableCell className={classSticky && classSticky[index]} style={{ position: "sticky", zIndex: 2, left: 138 }}>{csvData.assignments.length} assignments</StyledTableCell>
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
                                                setIndexValue(index + 1);
                                            }} className='btn-minus'><AiOutlinePlus /></button></StyledTableCell>
                                        )}

                                    </StyledTableRow>
                                    {expandedField === csvData.employeeName &&
                                        csvData.assignments.map((assign, indexChildren) => {

                                            let rowClass = ''; // Initialize row class
                                            let i = '';
                                            let fixbutton = null;
                                            for (i = 0; i < csvTargetValues.length; i++) {
                                                if (csvTargetValues[index].assignments[indexChildren]) { // Check if target value exists for this assignment
                                                    if (assign.grossPay !== csvValues[index].assignments[indexChildren].grossPay) {
                                                        rowClass = 'red-Color'; // Add class if gross pay does not match
                                                        fixbutton = (
                                                            <button
                                                            className='fix-button' 
                                                            onClick={() => {
                                                                const newCsvValues = [...csvValues]; // Create a copy of csvValues
                                                                const newGrossPay = csvTargetValues[index].assignments[indexChildren].grossPay
                                                                newCsvValues[index].assignments[indexChildren].grossPay = newGrossPay; // Update the Gross Pay value in the copy
                                                                onUpdateCsvValues(newCsvValues);
                                                                setUpdatedRowIndex(indexChildren);
                                                                console.log("I: ", index, "|", "Index: ", indexChildren, "|", "Assignment Source Value: ", assign.grossPay, "|", "Assignment Target Value: ", csvTargetValues[i].assignments[indexChildren].grossPay, "|", "newGrossPay: ", newCsvValues[index].assignments[indexChildren].grossPay);
                                                            }}
                                                            >
                                                                <AiOutlineCheck /> Fix
                                                            </button>
                                                        )
                                                    }

                                                    if (updatedRowIndex === indexChildren) {
                                                        rowClass = "green-Color";
                                                    }

                                                    return (
                                                        <StyledTableRow key={`${index + indexChildren}`} className={rowClass}>
                                                            <StyledTableCell>{indexValue}.{indexChildren + 1}</StyledTableCell>
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

                </Grid>



            </Grid>
        </>
    )
}

export default ConcileTable;