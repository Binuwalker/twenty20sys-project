import React from 'react';
import { Col, Row, Dropdown } from 'react-bootstrap';
import { RiArrowDropDownLine } from 'react-icons/ri';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/userAction';
import { useLocation } from 'react-router';

const TopNav = () => {

    const dispatch = useDispatch();
    const location = useLocation();

    const { user, isAuthenticated } = useSelector(state => state.authState);


    return (
        <>
            {location.pathname === '/login' ? (
                null
            ) : (
                <div className='topNav'>
                    <div className='container-fluid'>
                        <Row className='navBar'>
                            <Col className='navLogo' xs={8} sm={9} md={8} lg={10} xl={9}>
                                <div className='navLogo-container'>
                                    <img src='./img/logo.png' alt='twenty_twenty_logo' className='navLogo-img' />
                                </div>
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
                                            <div>Test</div>
                                        </>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            )}
        </>
    )
}

export default TopNav