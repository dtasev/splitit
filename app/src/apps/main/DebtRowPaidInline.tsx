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

    return (<>
        <Col>
            <Row className='font-little'>{phraseL}</Row>
            <Row className='fw-bold'>£{props.debt.amount}</Row>
        </Col>
        <Col>
            <Row className='font-little'>{phraseR}</Row>
            <Row className='fw-bold'>£{owed}</Row>
        </Col>
    </>);
})