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

    let ratio: number;
    switch (props.debt.ratio) {
        case 100:
        case 0:
            ratio = 1
            break
        default:
            ratio = (100 - props.debt.ratio) / 100;
    }

    const owed = props.debt.amount * ratio;

    return (<Row className='col-lg-6 col-12'>
        <Col className='col-6'>
            <div className='text-center font-little'>{phraseL}</div>
            <div className='text-center fw-bold'>£{props.debt.amount} ({props.debt.ratio}%)</div>
        </Col>
        <Col className='col-6'>
            <div className='text-center font-little'>{phraseR}</div>
            <div className='text-center fw-bold'>£{owed}</div>
        </Col>
    </Row>);
})