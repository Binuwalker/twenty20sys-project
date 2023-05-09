import React, { useRef, useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { VscChecklist } from "react-icons/vsc";
import ConcileTable from './ConcileTable';
import Papa from "papaparse";
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { RxCross2 } from 'react-icons/rx';
import { BiArrowBack } from 'react-icons/bi';
import { RiPencilFill } from 'react-icons/ri';
import { useNavigate } from 'react-router';
import { collection, query, addDoc, onSnapshot } from 'firebase/firestore';
import { firebasedb } from '../firebase/config';

function Comparision() {

    const q = query(collection(firebasedb, "reconcilationList"));

    const sourceRef = useRef();
    const [sourceFileName, setSourceFileName] = useState('');
    const [targetFileName, setTargetFileName] = useState('');
    const [csvSourceData, setcsvSourceData] = useState([]);
    const [csvTargetData, setcsvTargetData] = useState([]);
    const [reconcileSourceUploaded, setReconcileSourceUploaded] = useState(false)
    const [reconcileTargetUploaded, setReconcileTargetUploaded] = useState(false);
    const classs = useState();
    const [open, setOpen] = useState(false);
    const [loaderSave, setLoaderSave] = useState(false);

    const navigate = useNavigate();

    let [updateName, setUpdateName] = useState(null);
    const [edit, setEdit] = useState(false);
    const [countData, setCountData] = useState();
    const [int, setInt] = useState();

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
                    <div key={data.id}>
                        {csvDataValues.push((data))}
                    </div>
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
        setcsvTargetData(newCsvValues);
        console.log(newCsvValues);
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
                    <div key={data.id}>
                        {csvTargetValues.push((data))}
                    </div>
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

    const handleClose = () => {
        setOpen(false);
    };

    const handleInput = () => {
        setEdit(true)
    }

    const handleSave = async () => {

        setLoaderSave(true);

        let month = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]

        let getDateValue = new Date();
        let getMonth = month[getDateValue.getMonth()]
        let getHours = getDateValue.getHours();
        let getMinutes = getDateValue.getMinutes();
        let getAMPM = getHours > 12 ? "PM" : "AM"
        getHours = getHours % 12;
        getHours = getHours ? getHours : 12;
        getMinutes = getMinutes < 10 ? '0' + getMinutes : getMinutes;
        let createdOn = getMonth + " " + getDateValue.getDate() + ',' + getDateValue.getFullYear() + " " + getHours + ":" + getMinutes + " " + getAMPM;

        if (updateName) {
            await addDoc(collection(firebasedb, 'reconcilationList'),
                {
                    _id: "R" + int + id,
                    name: updateName,
                    createdOn,
                    createdBy: "Test"
                }
            );
            navigate('/');
            setUpdateName(null);
            setEdit(false);
            setLoaderSave(false);
        } else {
            setLoaderSave(false);
        }
    }

    const handleUpdate = () => {
        setEdit(false);
    }

    let id = countData ? countData?.length + 1 : 0;

    useEffect(() => {
        if (updateName) {
            onSnapshot(q, (snapshot) => {
                setCountData(snapshot.docs.map(doc => ({
                    id: doc.id,
                    item: doc.data()
                })));
            })

            if (id < 10) {
                setInt("00");
            } else if (id < 100) {
                setInt("0")
            }
        }
    }, [q, updateName, id]);

    const handleKey = (e) => {
        e.code === 'Enter' && handleUpdate();
    };

    const [showReconcile, setShowReconcile] = useState((reconcileSourceUploaded && reconcileTargetUploaded) ? true : false);
    return (
        <>
            <div className='comparison_border_bottom'>
                <Container fluid>
                    <Row className='navBar' style={{ display: "block" }}>
                        <Col className='navBack' xs={6} sm={6} md={6} lg={6}>
                            {edit ? (
                                <>
                                    <BiArrowBack style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => {
                                        navigate('/');
                                        setEdit(false);
                                    }} />
                                    <span style={{ fontSize: "16px" }}>
                                        <div className='editInput-container-handler'><input className='editInput' placeholder='Enter the file name' onChange={(e) => setUpdateName(e.target.value)} type='text' onKeyDown={handleKey} /></div>
                                    </span>
                                </>
                            ) : (
                                <>

                                    <BiArrowBack style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => {
                                        navigate('/');
                                        setUpdateName(null);
                                    }} /> <span style={{ fontSize: "15px" }}> <div className='editInput-container' onClick={handleInput}>{updateName ? updateName : 'New-Payroll-Reconcilation'} <RiPencilFill style={{ marginLeft: '5px', fontSize: "16px" }} /></div></span>

                                </>
                            )}
                        </Col>
                        <Col className='navBtn' xs={6} sm={6} md={6} lg={6}>
                            {loaderSave ? (
                                <button className='button-loader' onClick={handleSave} disabled>
                                    <div className='btn-loader'></div>
                                </button>
                            ) : (
                                <button className='btn-save' onClick={handleSave}>Save</button>
                            )}
                        </Col>

                    </Row>
                </Container>
            </div>
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
        </>
    )
}

export default Comparision;