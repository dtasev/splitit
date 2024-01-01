import { PropsWithChildren, memo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import DebtRowPaidInline from './DebtRowPaidInline';
import { useCookies } from 'react-cookie';

import './DebtList.css';

interface DebtRowProps {
    debt: DebtDetailApiResponse;
    editDebt: (debt: DebtDetailApiResponse) => void;
    onDelete: () => void;
}
export default memo(function DebtRow(props: PropsWithChildren<DebtRowProps>) {
    const date = moment(props.debt.added).format('YYYY-MM-DD');
    const [cookies] = useCookies(["csrftoken", "apitoken", "username"]);

    const deleteUrl = `${import.meta.env.VITE_API_URL}/api/debts/${props.debt.id}/`
    const deleteDebt = () => {
        if (window.confirm(`Delete the entry for ${props.debt.title} on ${date}?`)) {
            fetch(deleteUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${cookies.apitoken}`,
                    "X-CsrfToken": cookies.csrftoken,
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
                <DebtRowPaidInline owner={cookies.username === props.debt.owner_username} debt={props.debt} />
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