import { PropsWithChildren, memo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useCookies } from 'react-cookie';

import './DebtList.css';
import { Link } from 'react-router-dom';

interface DebtRowProps {
    debt: UserDebtListApiResponse;
}
export default memo(function UserDebtRow(props: PropsWithChildren<DebtRowProps>) {
    const [cookies] = useCookies(["username"]);
    const username = cookies.username === props.debt.owner_username ? props.debt.is_owed_username : props.debt.owner_username;
    const detailId = cookies.username === props.debt.owner_username ? props.debt.is_owed : props.debt.owner;
    return (
        <Container className='border border-collapse'>
            <Link className='text-decoration-none' to={detailId.toString()}>
                <Row className='py-3'>
                    <Col className='my-auto mx-auto col-lg-6 col-6'>User: {username}</Col>
                    <Col className='my-auto text-lg-start col-lg-6 col-6'>Total owed: £{props.debt.total_owed}</Col>
                </Row>
            </Link>
        </Container>
    );
})