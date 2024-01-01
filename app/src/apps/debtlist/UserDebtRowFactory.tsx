import { PropsWithChildren, memo, } from 'react';
import UserDebtRow from './UserDebtRow';

interface DebtRowFactory {
    debtsJson: UserDebtListApiResponse[];
}
export default memo(function UserDebtRowFactory(props: PropsWithChildren<DebtRowFactory>) {
    const renderedRows = props.debtsJson.map((debt) => { return <UserDebtRow debt={debt} /> });
    return (<>{renderedRows}</>);
})
