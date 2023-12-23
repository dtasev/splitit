import { PropsWithChildren, memo } from 'react';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';

interface DebtRowProps {
    debt: DebtApiResponse
}
export default memo(function DebtRow(props: PropsWithChildren<DebtRowProps>) {
    const paid = props.debt.amount * props.debt.ratio / 100;
    const owed = Math.abs(paid - props.debt.amount);
    const date = moment(props.debt.added).format('YYYY-MM-DD');
    return (
        <Row>
            <Col>{date}</Col>
            <Col>{props.debt.title}</Col>
            <Col>amount: {props.debt.amount} ratio: {props.debt.ratio}</Col>
            <Col>
                <Row>you paid</Row>
                <Row>{paid}</Row>
            </Col>
            <Col>
                <Row>you lent</Row>
                <Row>{owed}</Row>
            </Col>
        </Row>
    );
})