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
        <Container className='border border-collapse justify-content-center'>
            <Row className='my-auto'>
                <div className='col-lg-2 col-6'>{date}</div>
                <div className='text-lg-start col-lg-2 col-6'>{props.debt.title}</div>
                <div className='col-lg-6 col-12'>
                    <DebtRowPaidInline owner={cookies.username === props.debt.owner_username} debt={props.debt} />
                </div>
                <div className='col-lg-2 col-12 my-auto'>
                    <div className='d-flex border rounded'>
                        <div className='flex-fill border' role='button' onClick={() => props.editDebt(props.debt)}><FontAwesomeIcon icon={faPencil}></FontAwesomeIcon></div>
                        <div className='flex-fill border' role='button' onClick={deleteDebt}><FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></div>
                    </div>
                </div >
            </Row >
        </Container >
    );
})