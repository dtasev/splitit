import React, { memo, useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DebtRowFactory from './DebtRowFactory';
import ExpenseModal from './Modal';
import { UserContext } from '../../App';
import SideBarRight from './SideBarRight';


export default memo(function Main() {
    const [debtsJson, setDebtsJson] = useState<DebtApiResponse[]>([]);
    const userCtx = useContext<UserContextI>(UserContext);
    const [editModal, setEditModal] = useState<React.JSX.Element>();

    const fetchDebts = () => {
        if (!userCtx.token) { return }
        fetch(`${import.meta.env.VITE_API_URL}/api/debts/`,
            {
                headers: {
                    "Authorization": `Token ${userCtx.token}`
                },
                credentials: "include"
            }
        ).then((res) => {
            if (res.status >= 400 && res.status < 500) { throw new Error }
            return res.json();
        }).then((json) => {
            setDebtsJson(json);
        }).catch((err) => {
            console.error(err);
            setDebtsJson([]);
        })
    }

    const clearEditDebt = () => {
        setEditModal(undefined);
    }

    const editDebt = (debt: DebtApiResponse) => {
        setEditModal(<ExpenseModal onSuccess={fetchDebts} onClose={clearEditDebt} debt={debt} />);
    };

    useEffect(fetchDebts, [userCtx]);

    return (
        <Container fluid={true}>
            <Row>
                <Col className='col-lg-2 col-md-12 col-sm-12 col-12'>
                    <p>Side bar left</p>
                </Col>
                <Col className='col-lg-8 col-md-12 col-sm-12 col-12'>
                    <Row>
                        {editModal}
                        <ExpenseModal onSuccess={fetchDebts} />
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