import { PropsWithChildren, memo } from 'react';
import { Col, Row } from 'react-bootstrap';

interface DebtRowPaidInlineIP {
    owner: boolean
    debt: DebtApiResponse
}
export default memo(function DebtRowPaidInline(props: PropsWithChildren<DebtRowPaidInlineIP>) {
    let phraseL: string, phraseR: string;
    if (props.owner) {
        phraseL = "you paid";
        phraseR = `you lent ${props.debt.is_owed_username}`;
    } else {
        phraseL = `${props.debt.owner_username} paid`;
        phraseR = `${props.debt.owner_username} lent you`;
    }
    const owed = props.debt.amount * props.debt.ratio / 100;

    return (<Row className='col-lg-6 col-12'>
        <Col className='col-6'>
            <div className='text-center font-little'>{phraseL}</div>
            <div className='text-center fw-bold'>£{props.debt.amount}</div>
        </Col>
        <Col className='col-6'>
            <div className='text-center font-little'>{phraseR}</div>
            <div className='text-center fw-bold'>£{owed}</div>
        </Col>
    </Row>);
})