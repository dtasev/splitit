import { PropsWithChildren, memo } from 'react';

interface DebtRowPaidInlineIP {
    owner: boolean
    debt: DebtDetail
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
            ratio = 1
            break
        default:
            ratio = (100 - props.debt.ratio) / 100;
    }

    const owed = props.debt.amount * ratio;

    return (<div className='d-flex'>
        <div className='flex-fill'>
            <div className='font-little'>{phraseL} {ratio * 100}% of</div>
            <div className='fw-bold'>£{props.debt.amount}</div>
        </div>
        <div className='flex-fill'>
            <div className='font-little'>{phraseR}</div>
            <div className={className}>£{owed}</div>
        </div>
    </div>
    );
})