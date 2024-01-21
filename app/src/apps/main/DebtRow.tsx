import { PropsWithChildren, memo } from 'react';
import { Container, Row } from 'react-bootstrap';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import DebtRowPaidInline from './DebtRowPaidInline';
import { useCookies } from 'react-cookie';

import './DebtList.css';

interface DebtRowProps {
    debt: DebtDetail;
    editDebt: (debt: DebtDetail) => void;
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
            <Row className='my-auto hover'>
                <Row className='col-lg-10 col-12 mb-lg-0 mb-2' role='button' onClick={() => props.editDebt(props.debt)}>
                    <div className='col-3'>{date}</div>
                    <div className='col-3'>{props.debt.title}</div>
                    <div className='col-6'>
                        <DebtRowPaidInline owner={cookies.username === props.debt.owner_username} debt={props.debt} />
                    </div>
                </Row>
                <div className='col-lg-2 col-12 my-auto'>
                    <div className='d-flex border rounded'>
                        <div className='flex-fill border' role='button' onClick={deleteDebt}><FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></div>
                    </div>
                </div>
            </Row>
        </Container>
    );
})