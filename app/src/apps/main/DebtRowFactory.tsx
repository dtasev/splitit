import React, { PropsWithChildren, memo, useState } from 'react';
import DebtRow from './DebtRow';

interface DebtRowFactory {
    debtsJson: DebtApiResponse[]
}
export default memo(function DebtRowFactory(props: PropsWithChildren<DebtRowFactory>) {
    const renderedRows = props.debtsJson.map((debt) => { return <DebtRow debt={debt} /> });
    return (<>{renderedRows}</>);
})