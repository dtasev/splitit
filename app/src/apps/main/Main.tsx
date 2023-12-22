import { memo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';


export default memo(function Main() {
    return (
        <Container fluid={true}>
            <Row>
                <Col className='col-lg-3'>
                    <p>Side bar left</p>
                </Col>
                <Col className='col-lg-6'>
                    <Row className='border'>
                        Middle
                    </Row>
                </Col>
                <Col className='col-lg-3'>
                    <p>Side bar Right</p>
                </Col>
            </Row>
        </Container>
    );
})