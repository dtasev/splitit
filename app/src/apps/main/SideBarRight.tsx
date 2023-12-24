import { PropsWithChildren, memo } from 'react';
import { Container } from 'react-bootstrap';

interface SideBarRightIP {
    debtsJson: DebtApiResponse[];

}
export default memo(function SideBarRight(props: PropsWithChildren<SideBarRightIP>) {
    const totalOwed = props.debtsJson.reduce((acc, cv) => { return acc + (cv.amount * cv.ratio / 100) }, 0);
    return (<Container>You owe {totalOwed}</Container>);
})