import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import "./recon.css";
import { AiOutlinePlus } from "react-icons/ai";
import { FaSort } from "react-icons/fa";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from '@mui/material';
import { useNavigate } from 'react-router';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { firebasedb } from '../firebase/config';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.common.black,
        height: 40,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        height: 56,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


function Reconcilation() {

    const q = query(collection(firebasedb, "reconcilationList"));
    const [loader, setLoader] = useState(true)

    const [dataList, setDataList] = useState([]);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/comparisionpage')
    }

    useEffect(() => {
        onSnapshot(q, (snapshot) => {
            setDataList(snapshot.docs.map(doc => ({
                id: doc.id,
                item: doc.data()
            })).sort((a, b) => {
                const idA = parseInt(a.item?._id.substring(1));
                const idB = parseInt(b.item?._id.substring(1));
                return idA - idB;
            }));
            setLoader(false)
        })
    }, [q, loader]);

    return (
        <>
            {loader ? (
                <div className="loader" style={{height: '100vh'}}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            ) : (
                <Container fluid>
                    <Row>
                        <div className='recon-title col-lg-6 col-md-6 col-sm-6 col-6 float-start'>
                            Reconcilation
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6 float-end col-6 button-div'>
                            <button className=' btn btn-primary button-new' onClick={handleClick}>
                                <AiOutlinePlus style={{ fontSize: "20px" }} />
                                New
                            </button>
                        </div>
                    </Row>
                    <div className='recon-table'>
                        <TableContainer component={Paper} className='recon-table'>
                            <Table>
                                <TableHead>
                                    <TableRow className='table-row'>
                                        <StyledTableCell>ID <FaSort className='sort-icon' /></StyledTableCell>
                                        <StyledTableCell>NAME <FaSort className='sort-icon' /></StyledTableCell>
                                        <StyledTableCell>CREATED ON <FaSort className='sort-icon' /></StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataList && dataList.map(data => (
                                        <StyledTableRow key={data.item._id}>
                                            <StyledTableCell>{data.item._id}</StyledTableCell>
                                            <StyledTableCell>{data.item.name}</StyledTableCell>
                                            <StyledTableCell>{data.item.createdOn}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </div>
                </Container>
            )}


        </>
    )
}

export default Reconcilation