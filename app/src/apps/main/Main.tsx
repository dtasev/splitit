import { memo, useContext, useEffect, useState } from 'react';
import { Col, Container, ModalDialog, Row } from 'react-bootstrap';
import DebtRowFactory from './DebtRowFactory';
import ExpenseModal from './Modal';
import { UserContext } from '../../App';



export default memo(function Main() {
    const [debtsJson, setDebtsJson] = useState<DebtApiResponse[]>([]);
    const token = useContext(UserContext);

    useEffect(() => {
        fetch(`/api/debts/`,
            {
                headers: {
                    "Authorization": `Token ${token}`
                }
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
    }, [token]);

    return (
        <Container fluid={true}>
            <Row>
                <Col className='col-lg-2'>
                    <p>Side bar left</p>
                </Col>
                <Col className='col-lg-8'>
                    <Row>
                        <ExpenseModal />
                    </Row>
                    <Row className='border'>
                        <DebtRowFactory debtsJson={debtsJson} />
                    </Row>
                </Col>
                <Col className='col-lg-2'>
                    <p>Side bar Right</p>
                </Col>
            </Row>
        </Container>
    );
})