import React, { memo, useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import DebtRowFactory from './DebtRowFactory';
import ExpenseModal from './modals/AddExpenseModal';
import { UserContext } from '../../App';
import SideBarRight from './SideBarRight';
import SettleUpModal from './modals/SettleUpModal';
import { Link, useParams } from 'react-router-dom';


export default memo(function DebtList() {
    const [debtsJson, setDebtsJson] = useState<DebtDetailApiResponse[]>([]);
    const userCtx = useContext<UserContextI>(UserContext);
    const [editModal, setEditModal] = useState<React.JSX.Element>();

    const [otherUser, setOtherUser] = useState<string>("");


    const { userId } = useParams();

    const fetchDebts = () => {
        if (!userCtx.token) { return }
        fetch(`${import.meta.env.VITE_API_URL}/api/debts/${userId}/`,
            {
                headers: {
                    "Authorization": `Token ${userCtx.token}`
                },
                credentials: "include"
            }
        ).then((res) => {
            if (res.status >= 400 && res.status < 500) { throw new Error }
            return res.json();
        }).then((json: DebtDetailApiResponse[]) => {
            setDebtsJson(json);
            setOtherUser(json[0].is_owed_username);
        }).catch((err) => {
            console.error(err);
            setDebtsJson([]);
        })
    }

    const clearEditDebt = () => {
        setEditModal(undefined);
    }

    const editDebt = (debt: DebtDetailApiResponse) => {
        setEditModal(<ExpenseModal onSuccess={fetchDebts} onClose={clearEditDebt} debt={debt} otherUser={otherUser} />);
    };

    useEffect(fetchDebts, [userCtx]);

    return (
        <Container fluid={true}>
            <Row>
                <Col className='col-lg-2 col-md-12 col-sm-12 col-12'>
                    <p></p>
                </Col>
                <Col className='col-lg-8 col-md-12 col-sm-12 col-12'>
                    {editModal}
                    <Row>
                        <div className='d-flex flex-row mb-3'>
                            <Link to=".."><Button variant='secondary'>Return</Button></Link>
                            <div className='flex-fill'></div>
                            <ExpenseModal className="mx-2" onSuccess={fetchDebts} otherUser={otherUser} />
                            <SettleUpModal className="" onSuccess={fetchDebts} otherUser={otherUser} />
                        </div>
                    </Row>
                    <Row className='border'>
                        <DebtRowFactory debtsJson={debtsJson} onDelete={fetchDebts} editDebt={editDebt} />
                    </Row>
                </Col>
                <Col className='col-lg-2 col-md-12 col-sm-12 col-12'>
                    <SideBarRight debtsJson={debtsJson} />
                </Col>
            </Row>
        </Container>
    );
})