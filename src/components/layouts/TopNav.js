import React, { useEffect, useState } from 'react';
import { Col, Row, Dropdown } from 'react-bootstrap';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { BiArrowBack } from 'react-icons/bi';
import { RiPencilFill } from 'react-icons/ri';
import { TiTickOutline } from 'react-icons/ti';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { collection, query, addDoc, onSnapshot } from 'firebase/firestore';
import { firebasedb } from '../../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/userAction';

const TopNav = () => {


    const q = query(collection(firebasedb, "reconcilationList"));

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    let [updateName, setUpdateName] = useState(null);
    const [edit, setEdit] = useState(false);
    const [countData, setCountData] = useState();
    const [int, setInt] = useState();

    const { user, isAuthenticated } = useSelector(state => state.authState);

    const handleInput = () => {
        setEdit(true)
    }

    const handleSave = async () => {

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
    }, [q, updateName, id, dispatch]);

    const handleKey = (e) => {
        e.code === 'Enter' && handleUpdate();
    };

    return (
        <>
            {location.pathname === '/login' ? (
                null
            ) : (
                <div className='topNav'>
                    <div className='container-fluid'>
                        {location.pathname === '/' && (
                            <Row className='navBar'>
                                <Col className='navLogo' xs={4} sm={3} md={3} lg={2} xl={2}>
                                    <img src='./img/logo.png' alt='twenty_twenty_logo' className='navLogo-img' />
                                </Col>
                                <Col className='navLinks' xs={4} sm={6} md={5} lg={8} xl={7}>
                                    <div className='navLink'>Reconciliation tool</div>
                                </Col>
                                <Col className='navProfile' xs={4} sm={3} md={4} lg={2} xl={3}>
                                    <div className='align-right'>
                                        {isAuthenticated ? (
                                            <>
                                                <Dropdown className='btn-success-remove'>
                                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                        <div style={{ float: 'left' }}>
                                                            <img src={isAuthenticated ? user?.userImg : './img/profile_img.png'} alt='profile_img' className='navProfile-img' />
                                                            <div className='navProfile-username'>{isAuthenticated ? user?.userName : 'Richard'}<RiArrowDropDownLine className='dropdownIcon' /></div>
                                                        </div>
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="/login" onClick={() => dispatch(logout)}>Logout</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>

                                            </>
                                        ) : (
                                            <>
                                                null
                                            </>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        )}
                        {location.pathname === '/comparisionpage' &&
                            (
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
                                        <button className='btn-save' onClick={handleSave}>Save</button>
                                    </Col>

                                </Row>
                            )}
                    </div>
                </div>
            )}
        </>
    )
}

export default TopNav