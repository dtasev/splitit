import { PropsWithChildren, memo, useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import moment from 'moment';
import { UserContext } from '../../App';

import './Main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import DebtRowPaidInline from './DebtRowPaidInline';


interface DebtRowProps {
    debt: DebtApiResponse;
    editDebt: (debt: DebtApiResponse) => void;
    onDelete: () => void;
}
export default memo(function DebtRow(props: PropsWithChildren<DebtRowProps>) {
    const userCtx = useContext<UserContextI>(UserContext);
    const date = moment(props.debt.added).format('YYYY-MM-DD');

    const deleteUrl = `${import.meta.env.VITE_API_URL}/api/debts/${props.debt.id}/`
    const deleteDebt = () => {
        if (window.confirm(`Delete the entry for ${props.debt.title} on ${date}?`)) {
            fetch(deleteUrl, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${userCtx.token}`
                },
                credentials: "include"

            }).then(() => {
                props.onDelete();
            });
        }
    }

    return (
        <Container className='border border-collapse'>
            <Row>
                <Col className='my-auto mx-auto col-lg-2 col-5'>{date}</Col>
                <Col className='my-auto text-lg-start col-lg-2 col-7'>{props.debt.title}</Col>
                {/* <Col>amount: {props.debt.amount} ratio: {props.debt.ratio}</Col> */}
                <DebtRowPaidInline owner={userCtx.username === props.debt.owner_username} debt={props.debt} />
                <Col className='my-auto col-lg-2 col-12'>
                    <Row>
                        <Col className='px-lg-2 col-6'><a className="icon-link" href="#" onClick={() => props.editDebt(props.debt)}><FontAwesomeIcon icon={faPencil}></FontAwesomeIcon></a></Col>
                        <Col className='px-lg-2 col-6'><a className="icon-link" href="#" onClick={deleteDebt}><FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></a></Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
})