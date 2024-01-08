import { memo, useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { UserContext } from '../../App';
import UserDebtRowFactory from './UserDebtRowFactory';


export default memo(function UserDebtsList() {
    const [debtsJson, setDebtsJson] = useState<UserDebtListApiResponse[]>([]);
    const userCtx = useContext<UserContextI>(UserContext);

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

    useEffect(fetchDebts, [userCtx]);

    return (
        <Container fluid={true}>
            <Row>
                <Col className='col-lg-2 col-md-12 col-sm-12 col-12'>
                    <p>Side bar left</p>
                </Col>
                <Col className='col-lg-8 col-md-12 col-sm-12 col-12'>
                    <Row className='border'>
                        <UserDebtRowFactory debtsJson={debtsJson} />
                    </Row>
                </Col>
                <Col className='col-lg-2 col-md-12 col-sm-12 col-12'>
                    {/* <SideBarRight debtsJson={debtsJson} /> */}
                </Col>
            </Row>
        </Container>
    );
})