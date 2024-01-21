import { PropsWithChildren, memo } from 'react';

interface DebtRowPaidInlineIP {
    owner: boolean
    debt: DebtDetail
}

export default memo(function DebtRowPaidInline(props: PropsWithChildren<DebtRowPaidInlineIP>) {
    let phraseL: string, phraseR: string, className: string;

    if (props.debt.ratio === 0) {
        phraseL = `${props.debt.is_owed_username} paid`;
        phraseR = `${props.debt.is_owed_username} lent you`;
        className = "text-center fw-bold text-danger";
    }
    else if (!props.owner) {
        phraseL = `${props.debt.owner_username} paid`;
        phraseR = `${props.debt.owner_username} lent you`;
        className = "text-center fw-bold text-danger";
    } else {
        phraseL = "you paid";
        phraseR = `you lent ${props.debt.is_owed_username}`;
        className = "text-center fw-bold text-success";
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

    return (<div className='d-flex'>
        <div className='flex-fill'>
            <div className='font-little'>{phraseL}</div>
            <div className='fw-bold'>£{props.debt.amount}</div>
        </div>
        <div className='flex-fill'>
            <div className='font-little'>{phraseR}</div>
            <div className={className}>£{owed}</div>
        </div>
    </div>
    );
})