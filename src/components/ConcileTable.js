import React, { useState, useEffect } from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from '@mui/material';
import { AiOutlineCheck } from "react-icons/ai";
import { GoPrimitiveDot } from 'react-icons/go';
import { RxCross2 } from 'react-icons/rx';
import { SlEye } from 'react-icons/sl'
import { Grid } from "@mui/material"
import { Modal } from 'react-bootstrap';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.common.black,
        height: 40,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        width: "300px",
        overflow: "hidden"
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        height: 56,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        width: "300px",
        overflow: "hidden"
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
    const [classStripe, setClassStripe] = useState();
    const [updatedRowIndex, setUpdatedRowIndex] = useState(null);
    const [handleView, setHandleView] = useState(false);


    function reduceFunc(total, num) {
        return total + num;
    }

    const compareCsvData = () => {
        const newRowClasses = [];
        const newRowSticky = [];
        const newRowStripe = [];
        if (csvValues.length === csvTargetValues.length) {
            for (let i = 0; i < csvValues.length; i++) {
                if (csvValues[i].assignments.length !== csvTargetValues[i].assignments.length) {
                    newRowClasses[i] = "red-Color";
                    newRowSticky[i] = "red-Color-sticky";
                    newRowStripe[i] = "red-Color-stripe";
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
                        newRowClasses[i] = "red-Color-employee"; // Set row class for employee row
                        newRowSticky[i] = "red-Color-sticy"
                        newRowStripe[i] = "red-Color-stripe"
                        setClassSticky(newRowSticky);
                        setClassStripe(newRowStripe)
                        console.log(classSticky);
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
    }, [compareCsvData]);

    return (

        <>

            <Grid container spacing={1} padding={1}>
                <Grid item md={6} xs={12} sm={12}>

                    <TableContainer component={Paper}>
                        <Table className='reconcile-table'>
                            {csvValues &&
                                <TableHead className='tableHead'>
                                    <TableRow>
                                        <StyledTableCell>ID</StyledTableCell>
                                        <StyledTableCell>EMPLOYEE NAME</StyledTableCell>
                                        <StyledTableCell>ASSIGNMENT</StyledTableCell>
                                        <StyledTableCell>PAY PERIOD</StyledTableCell>
                                        <StyledTableCell>RATE</StyledTableCell>
                                        <StyledTableCell>HOURS</StyledTableCell>
                                        <StyledTableCell style={{ width: 150 }}>GROSS PAY</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                            }
                            <TableBody>
                                {csvValues?.map((csvData, index) => (<>
                                    <StyledTableRow style={{ boxShadow: "none" }} key={index + 1} className={(csvValues && csvTargetValues && clas) && clas[index]}>
                                        <StyledTableCell><div className={classStripe && classStripe[index]}></div><div className='csvId'>{index + 1}</div></StyledTableCell>
                                        <StyledTableCell>{csvData.employeeName}</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments.length} assignments</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments[0]?.payPeriod.split('-').splice(0, 1)} - {csvData.assignments[csvData.assignments.length - 1]?.payPeriod.split('-').splice(1, 2)}</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments.map(ave => parseInt(ave.rate)).reduce(reduceFunc, 0) / csvData.assignments.map(ave => parseInt(ave.rate)).length}</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments.map(hour => parseInt(hour.hours)).reduce(reduceFunc, 0)}</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments.map(pay => parseInt(pay.grossPay)).reduce(reduceFunc, 0)}</StyledTableCell>
                                    </StyledTableRow>


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
                                        <StyledTableCell>ID</StyledTableCell>
                                        <StyledTableCell
                                        //  style={{ position: "sticky", background: "#f5f5f5" }}
                                        >EMPLOYEE NAME</StyledTableCell>
                                        <StyledTableCell>ASSIGNMENT</StyledTableCell>
                                        <StyledTableCell style={{}}>PAY PERIOD</StyledTableCell>
                                        <StyledTableCell>RATE</StyledTableCell>
                                        <StyledTableCell>HOURS</StyledTableCell>
                                        <StyledTableCell style={{}}>GROSS PAY</StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                    </TableRow>
                                </TableHead>
                            }
                            <TableBody>
                                {csvTargetValues?.map((csvData, index) => (<>
                                    <StyledTableRow style={{ boxShadow: "none" }} key={index + 1} className={(csvValues && csvTargetValues && clas) && clas[index]}>
                                        <StyledTableCell
                                        // style={{ position: "sticky", zIndex: 2, left: 0, width: '1000px' }}
                                        ><div className={classStripe && classStripe[index]}></div>{index + 1}</StyledTableCell>
                                        <StyledTableCell>{csvData.employeeName}</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments.length} assignments</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments[0]?.payPeriod.split('-').splice(0, 1)} - {csvData.assignments[csvData.assignments.length - 1]?.payPeriod.split('-').splice(1, 2)}</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments.map(ave => parseInt(ave.rate)).reduce(reduceFunc, 0) / csvData.assignments.map(ave => parseInt(ave.rate)).length}</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments.map(hour => parseInt(hour.hours)).reduce(reduceFunc, 0)}</StyledTableCell>
                                        <StyledTableCell>{csvData.assignments.map(pay => parseInt(pay.grossPay)).reduce(reduceFunc, 0)}</StyledTableCell>
                                        <StyledTableCell>
                                            <button onClick={() => {
                                                setExpandedField(csvData.employeeName);
                                                setHandleView(true)
                                            }} className='btn-view'><SlEye style={{ fontSize: '16px', position: 'relative', top: '1px' }} />View</button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>

                </Grid>

            </Grid>

            {
                /*
    
     Modal View 
     
     */
            }

            <Modal
                show={handleView}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <div className='container'>
                        <div style={{ float: 'left' }} className='explandedFeild_name'>{expandedField}</div>
                        <div style={{ float: 'left', paddingLeft: '7px', paddingRight: '7px' }}><GoPrimitiveDot style={{ color: '#D9D9D9', position: 'relative', bottom: '3px' }} /></div>
                        <div style={{ float: 'left' }} className='expandedFeild_date'>Jan 1 - Feb 12</div>
                        <div style={{ fontSize: '20px', float: 'right', cursor: 'pointer', color: "rgb(141, 138, 138)" }}><RxCross2 className='cls-icon' onClick={() => setHandleView(false)} /></div>
                    </div>
                    <Grid container spacing={1} padding={1}>
                        <Grid item md={6} xs={12} sm={12}>

                            <TableContainer component={Paper}>
                                <Table className='reconcile-table'>
                                    {csvValues &&
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>ID</StyledTableCell>
                                                <StyledTableCell>ASSIGNMENT</StyledTableCell>
                                                <StyledTableCell >PAY PERIOD</StyledTableCell>
                                                <StyledTableCell>RATE</StyledTableCell>
                                                <StyledTableCell>HOURS</StyledTableCell>
                                                <StyledTableCell>GROSS PAY</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                    }
                                    <TableBody>
                                        {csvValues?.map((csvData, index) => (
                                            <>
                                                {expandedField === csvData.employeeName &&
                                                    csvData.assignments.map((assign, indexChildren) => {

                                                        let rowClass = ''; // Initialize row class
                                                        let rowStripe = '';
                                                        let i = '';
                                                        for (i = 0; i < csvValues.length; i++) {
                                                            if (csvTargetValues[index].assignments[indexChildren]) { // Check if target value exists for this assignment
                                                                if (assign.grossPay !== csvTargetValues[index].assignments[indexChildren].grossPay) {
                                                                    rowClass = 'red-Color'; // Add class if gross pay does not match
                                                                }
                                                                if (updatedRowIndex === indexChildren) {
                                                                    rowClass = "green-Color";
                                                                    rowStripe = "green-Color-stripe"
                                                                }

                                                                return (
                                                                    <StyledTableRow key={`${index + indexChildren}`} className={rowClass}>
                                                                        <StyledTableCell><div className={rowStripe && rowStripe}></div>{indexChildren + 1}</StyledTableCell>
                                                                        <StyledTableCell>{assign.assignment}</StyledTableCell>
                                                                        <StyledTableCell>{assign.payPeriod}</StyledTableCell>
                                                                        <StyledTableCell>{assign.rate}</StyledTableCell>
                                                                        <StyledTableCell>{assign.hours}</StyledTableCell>
                                                                        <StyledTableCell>{assign.grossPay}</StyledTableCell>
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
                                                <StyledTableCell>ID</StyledTableCell>
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
                                        {csvTargetValues?.map((csvData, index) => (
                                            <>
                                                {expandedField === csvData.employeeName &&
                                                    csvData.assignments.map((assign, indexChildren) => {

                                                        let rowClass = ''; // Initialize row class
                                                        let rowStripe = '';
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
                                                                                const newCsvValues = [...csvTargetValues]; // Create a copy of csvValues
                                                                                const newGrossPay = csvValues[index].assignments[indexChildren].grossPay;
                                                                                newCsvValues[index].assignments[indexChildren].grossPay = newGrossPay; // Update the Gross Pay value in the copy
                                                                                onUpdateCsvValues(newCsvValues);
                                                                                setUpdatedRowIndex(indexChildren);
                                                                                console.log("I: ", index, ",", "svins: ", newCsvValues[index], "wvidnv: ", csvTargetValues[index], "Index: ", indexChildren, "|", "Assignment Source Value: ", assign.grossPay, "|", "Assignment Target Value: ", csvTargetValues[index].assignments[indexChildren].grossPay, "|", "newGrossPay: ", newCsvValues[index].assignments[indexChildren].grossPay);
                                                                            }}
                                                                        >
                                                                            <AiOutlineCheck /> Fix
                                                                        </button>
                                                                    )
                                                                }

                                                                if (updatedRowIndex === indexChildren) {
                                                                    rowClass = "green-Color";
                                                                    rowStripe = "green-Color-stripe"
                                                                }

                                                                return (
                                                                    <StyledTableRow key={`${index + indexChildren}`} className={rowClass}>
                                                                        <StyledTableCell><div className={rowStripe && rowStripe}></div>{indexChildren + 1}</StyledTableCell>
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
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ConcileTable;