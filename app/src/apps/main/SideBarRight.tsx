import { PropsWithChildren, memo, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { UserContext } from '../../App';

interface SideBarRightIP {
    debtsJson: DebtApiResponse[];

}
export default memo(function SideBarRight(props: PropsWithChildren<SideBarRightIP>) {
    const userCtx = useContext(UserContext);

    const totalOwed = props.debtsJson.reduce((acc, cv) => {
        // if the user is not the owner then they owe the ratio of the debt
        // e.g. if user1 paid £50 for user2 with a ratio of 100 (i.e. user1 paid 100% of the £50) -> user2 owes the full amount
        // if user1 paid £50 for user2 with a ratio of 75 (i.e. user1 paid 75% of the £50) -> user2 owes the remaining 25% of 50

        let ratio: number;
        switch (cv.ratio) {
            case 100:
            case 0:
                ratio = 1
                break
            default:
                ratio = (100 - cv.ratio) / 100;
        }
        if (cv.owner_username === userCtx.username) {
            return acc + (cv.amount * ratio);
        } else {
            return acc - (cv.amount * ratio);
        }
    }, 0);

    let msg = "";
    if (totalOwed === 0) {
        msg = "owe nothing to no one."
    } else if (totalOwed > 0) {
        msg = `are owed £${totalOwed}`
    } else {
        msg = `owe £${Math.abs(totalOwed)}`
    }
    return (<Container>You {msg}</Container>);
})