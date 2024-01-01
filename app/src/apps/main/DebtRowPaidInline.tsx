import { PropsWithChildren, memo } from 'react';
import { Col, Row } from 'react-bootstrap';

interface DebtRowPaidInlineIP {
    owner: boolean
    debt: DebtDetailApiResponse
}

export default memo(function DebtRowPaidInline(props: PropsWithChildren<DebtRowPaidInlineIP>) {
    let phraseL: string, phraseR: string, className: string;

    if (props.owner) {
        phraseL = "you paid";
        phraseR = `you lent ${props.debt.is_owed_username}`;
        className = "text-center fw-bold text-success";
    } else {
        phraseL = `${props.debt.owner_username} paid`;
        phraseR = `${props.debt.owner_username} lent you`;
        className = "text-center fw-bold text-danger";
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

    return (
        <Row className='col-lg-6 col-12'>
            <Col className='col-6'>
                <div className='text-center font-little'>{phraseL} {ratio * 100}% of</div>
                <div className='text-center fw-bold'>£{props.debt.amount}</div>
            </Col>
            <Col className='col-6'>
                <div className='text-center font-little'>{phraseR}</div>
                <div className={className}>£{owed}</div>
            </Col>
        </Row>
    );
})