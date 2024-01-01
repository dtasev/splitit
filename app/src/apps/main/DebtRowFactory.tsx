import { PropsWithChildren, memo, } from 'react';
import DebtRow from './DebtRow';

interface DebtRowFactory {
    debtsJson: DebtDetailApiResponse[];
    editDebt: (debt: DebtDetailApiResponse) => void;
    onDelete: () => void;
}
export default memo(function DebtRowFactory(props: PropsWithChildren<DebtRowFactory>) {
    const renderedRows = props.debtsJson.map((debt) => { return <DebtRow key={debt.id} debt={debt} onDelete={props.onDelete} editDebt={props.editDebt} /> });
    return (<>{renderedRows}</>);
})
