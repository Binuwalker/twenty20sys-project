import React, { useRef, useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { VscChecklist } from "react-icons/vsc";
import ConcileTable from './ConcileTable';
import Papa from "papaparse";
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';



function Comparision() {

    const sourceRef = useRef();
    const [sourceFileName, setSourceFileName] = useState('');
    const [targetFileName, setTargetFileName] = useState('');
    const [csvSourceData, setcsvSourceData] = useState([]);
    const [csvTargetData, setcsvTargetData] = useState([]);
    const [reconcileSourceUploaded, setReconcileSourceUploaded] = useState(false)
    const [reconcileTargetUploaded, setReconcileTargetUploaded] = useState(false);
    const [classs, setClasss] = useState()
    const [open, setOpen] = useState(false);

    const sourceUploadHandler = (e) => {
        let sourceFileNameValue = e.target.files[0].name;
        let sourceFileNameValueShifted = sourceFileNameValue.split('.').shift();
        setSourceFileName(sourceFileNameValueShifted);
        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const csvDataValues = []
                results.data.map(data => (
                    csvDataValues.push((data))
                ))
                const groupedData = csvDataValues.reduce((acc, curr) => {
                    const { employeeName, ...rest } = curr;
                    const employeeIndex = acc.findIndex(item => item.employeeName === employeeName);
                    if (employeeIndex === -1) {
                        acc.push({ employeeName, assignments: [{ ...rest }] })
                    } else {
                        acc[employeeIndex].assignments.push({ ...rest });
                    }
                    return acc
                }, []);
                setcsvSourceData(groupedData);
                setReconcileSourceUploaded(true);
            }
        })
    }
    const handleCsvValuesUpdate = (newCsvValues) => {
        setcsvSourceData(newCsvValues)
    }

    const uploadHandlerRemove = () => {
        setShowReconcile(false);
        setSourceFileName(null);
        setTargetFileName(null)
        setcsvSourceData(null);
        setcsvTargetData(null);
        setReconcileSourceUploaded(false);
        setReconcileTargetUploaded(false);
    }

    const targetUploadHandler = (e) => {
        let targetFileNameValue = e.target.files[0].name;
        let targetFileNameValueShifted = targetFileNameValue.split('.').shift();
        setTargetFileName(targetFileNameValueShifted)
        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const csvTargetValues = []
                results.data.map(data => (
                    csvTargetValues.push((data))
                ))
                const groupedTargetData = csvTargetValues.reduce((acc, curr) => {
                    const { employeeName, ...rest } = curr;
                    const employeeIndex = acc.findIndex(item => item.employeeName === employeeName);
                    if (employeeIndex === -1) {
                        acc.push({ employeeName, assignments: [{ ...rest }] })
                    } else {
                        acc[employeeIndex].assignments.push({ ...rest });
                    }
                    return acc
                }, []);
                setcsvTargetData(groupedTargetData)
                setReconcileTargetUploaded(true);
            }
        })
    }

    const errormessage = () => {
        if (csvSourceData.length !== csvTargetData.length) {
            setOpen(true)
        }

    }
    useEffect(() => {
        errormessage()
    }, [csvSourceData, csvTargetData])
    const handleClose = () => {
        setOpen(false);
    };


    const compareCsvData = () => {
        const newRowClasses = [];
        if (csvSourceData.length === csvTargetData.length) {
            for (let i = 0; i < csvSourceData.length; i++) {
                if (csvSourceData[i].employeeName !== csvTargetData[i].employeeName) {
                    console.log(`Employee name does not match for row ${i}`);
                    newRowClasses[i] = "red-Color"
                }
                if (csvSourceData[i].assignments.length !== csvTargetData[i].assignments.length) {
                    console.log(`Number of assignments does not match for row ${i}`);
                    newRowClasses[i] = "red-Color"
                } else {
                    for (let j = 0; j < csvSourceData[i].assignments.length; j++) {
                        if (csvSourceData[i].assignments[j].name !== csvTargetData[i].assignments[j].name) {
                            console.log(`Assignment name does not match for row ${i}, assignment ${j}`);
                            newRowClasses[i] = "red-Color"
                        }
                        if (csvSourceData[i].assignments[j].grossPay !== csvTargetData[i].assignments[j].grossPay) {
                            console.log(`Assignment grosspay does not match for row ${i}, assignment ${j}`);
                            newRowClasses[i] = "red-Color"
                        }
                        // Add more property comparisons as needed
                    }
                }
            }
            setClasss(newRowClasses)
        } else {
            console.log("The number of rows in the two files is different");
        }
    }

    useEffect(() => {
        compareCsvData();
    }, [csvSourceData, csvTargetData])

    const [showReconcile, setShowReconcile] = useState((reconcileSourceUploaded && reconcileTargetUploaded) ? true : false);
    return (
        <Container fluid>
            {csvSourceData === null && csvTargetData === null ? null :
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <MuiAlert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        The row of the files are not matching
                    </MuiAlert>
                </Snackbar>}

            <Row>
                <Col xs={12} lg={6} sm={12} md={12}>
                    <div className='csv-card'>
                        <div style={{ height: "47px", marginTop: "15px", marginLeft: "15px" }} className='float-start'>
                            <div className='csv-img float-start'>
                                <img width={"31px"} height={"31px"} style={{ marginLeft: "8px", marginTop: "7px" }} src='./img/image 19.png' alt='csvimg' />
                            </div>
                            <div className='csv-text float-start'>
                                {sourceFileName ? (
                                    <>
                                        <div className='csv-heading-txt'>{sourceFileName}</div>
                                        <div className='csv-sub-text'>.csv file</div>
                                    </>
                                ) : (
                                    <>
                                        <div className='csv-heading-txt'>Source file</div>
                                        <div className='csv-sub-text'>Upload .csv of your source file</div>
                                    </>
                                )}

                            </div>
                        </div>
                        {reconcileSourceUploaded ? (
                            <>
                                <div className='close-icon float-end m-4' onClick={uploadHandlerRemove}><RxCross2 className='cls-icon' /></div>
                            </>
                        ) : (
                            <>
                                <input type='file'
                                    id='csvSourceFileId' accept='.csv' style={{ display: "none" }} ref={sourceRef} onChange={sourceUploadHandler} />
                                <label htmlFor='csvSourceFileId' className='btn-upload float-end m-4'>Upload</label >
                            </>
                        )}
                    </div>
                </Col>
                <Col xs={12} lg={6} sm={12} md={12}>
                    <div className='csv-card2'>
                        <div style={{ height: "47px", marginTop: "15px", marginLeft: "15px" }} className='float-start'>
                            <div className='csv-img float-start'>
                                <img width={"31px"} height={"31px"} style={{ marginLeft: "8px", marginTop: "7px" }} src='./img/image 19.png' alt='csvimg' />
                            </div>
                            <div className='csv-text float-start'>
                                {targetFileName ? (
                                    <>
                                        <div className='csv-heading-txt'>{targetFileName}</div>
                                        <div className='csv-sub-text'>.csv file</div>
                                    </>
                                ) : (
                                    <>
                                        <div className='csv-heading-txt'>Target file</div>
                                        <div className='csv-sub-text'>Upload .csv of your target file</div>
                                    </>
                                )}

                            </div>
                        </div>
                        {reconcileTargetUploaded ? (
                            <>
                                <div className='close-icon float-end m-4' onClick={uploadHandlerRemove}><RxCross2 className='cls-icon' /></div>
                            </>
                        ) : (
                            <>
                                <input type='file'
                                    id='csvTargetFileId' accept='.csv' style={{ display: "none" }} onChange={targetUploadHandler} />
                                <label htmlFor='csvTargetFileId' className='btn-upload float-end m-4'>Upload</label >
                            </>
                        )}
                    </div>
                </Col>
            </Row >
            <Row>
                <Col className='mt-4 mb-4' lg={12} xs={12} sm={12} md={12}>
                    {showReconcile ? (
                        <button
                            disabled={(reconcileSourceUploaded && reconcileTargetUploaded) ? false : true}
                            className={(reconcileSourceUploaded && reconcileTargetUploaded) ? 'reconcile-btn' : 'reconcile-btn-disabled'}
                            onClick={() => setShowReconcile(false)}
                        >
                            <VscChecklist style={{ fontSize: "18px", fontWeight: "50" }} /> Reconcile</button>
                    ) : (
                        <button
                            disabled={(reconcileSourceUploaded && reconcileTargetUploaded) ? false : true}
                            className={(reconcileSourceUploaded && reconcileTargetUploaded) ? 'reconcile-btn' : 'reconcile-btn-disabled'}
                            onClick={() => setShowReconcile(true)}
                        >
                            <VscChecklist style={{ fontSize: "18px", fontWeight: "50" }} /> Reconcile</button>
                    )}

                </Col>

            </Row>
            {
                showReconcile && (
                    <ConcileTable csvValues={csvSourceData} csvTargetValues={csvTargetData} classs={classs} onUpdateCsvValues={handleCsvValuesUpdate} />
                )
            }

        </Container >
    )
}

export default Comparision