import { PropsWithChildren, memo, useContext, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { UserContext } from '../../../App';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt';

interface AddExpenseModalProps {
    onSuccess: () => void;
    onClose?: () => void;

    debt?: DebtDetail;
    otherUser?: string;
    className?: string;
}

export default memo(function ExpenseModal(props: PropsWithChildren<AddExpenseModalProps>) {
    const [cookies, _] = useCookies(["csrftoken", "username"]);
    const userCtx = useContext(UserContext);

    const otherE = useRef<HTMLInputElement>(null);
    const titleE = useRef<HTMLInputElement>(null);
    const amountE = useRef<HTMLInputElement>(null);
    const lentE = useRef<HTMLInputElement>(null);
    const ratioE = useRef<HTMLInputElement>(null);
    const addedE = useRef<HTMLInputElement>(null);
    const debtOwnerE = useRef<HTMLSelectElement>(null);

    const debtOwner = !props.debt ? "equally" :
        props.debt?.amount !== props.debt?.lent ? "equally" :
            (props.debt?.owner_username !== cookies.username ? props.otherUser : cookies.username);

    const [totalValue, setTotalField] = useState<number>(props.debt?.amount || 0);
    // const [lentValue, setLentField] = useState<number>(props.debt?.lent || 0);
    // const [ratioPerc, setRatioPerc] = useState<number>(props.debt?.ratio || 50);

    const [show, setShow] = useState<boolean>(props.debt ? true : false);

    const handleClose = () => {
        setShow(false);
        if (props.onClose) { props.onClose(); }
    };
    const handleShow = () => setShow(true);

    const saveDebt = () => {
        const ownerVal = debtOwnerE.current?.selectedOptions[0].value;

        const owner = ownerVal === "equally" ? cookies.username : ownerVal;
        const isOwed = ownerVal === "equally" ? props.otherUser : (ownerVal === cookies.username ? props.otherUser : cookies.username);
        const lent = ownerVal === "equally" ? totalValue / 2 : totalValue;
        const ratio = ownerVal === "equally" ? 50 : 100;

        console.log(owner, isOwed)
        const url = props.debt ? `${import.meta.env.VITE_API_URL}/api/debts/${props.debt.id}/` : `${import.meta.env.VITE_API_URL}/api/debts/`;
        const method = props.debt ? "PATCH" : "POST";
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "X-CsrfToken": cookies.csrftoken,
                "Authorization": `Token ${userCtx.token}`,
            },
            credentials: "include",

            body: JSON.stringify({
                owner: owner,
                is_owed: isOwed,
                title: titleE.current?.value,
                amount: totalValue,
                lent: lent,
                ratio: ratio,
                added: addedE.current?.value,
            })
        }).then((res) => {
            if (res.status >= 400) {
                throw new Error();
            } else {
                props.onSuccess();
                handleClose();
            }
        });
    }

    const updateRatioNote = () => {
        if (amountE.current?.value) {
            setTotalField(parseFloat(amountE.current?.value));
            // const ratio = parseInt(ratioE.current?.value || "50");
            // setRatioPerc(ratio);
            // const ratioPerc = ratio / 100;
            // const owedByYou = parseInt(amountE.current?.value) * ratioPerc;
            // const owedByThem = Math.abs(owedByYou - parseInt(amountE.current?.value));
            // setLentField(owedByThem);
        }
    }

    // okay i'll need multiple modals so this button can't be that specific, should take some props name, action etc
    const addExpense = props.debt ? null : <Button variant="warning" onClick={handleShow}>Add expense</Button>;
    // const addExpense = props.debt ? null : <Button variant="dager-outline" onClick={handleSettle}>Add expense</Button>;
    const defaultDate = props.debt ? new Date(props.debt?.added).toLocaleDateString("en-CA") : new Date().toLocaleDateString("en-CA");

    return (
        <div className={props.className}>
            {addExpense}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='input-group mb-3'>
                        <label className='input-group-text' htmlFor="is_owed">With you and: </label>
                        <input ref={otherE} className='form-control' id='is_owed' name='is_owed' type="text" required defaultValue={props.otherUser || ""} disabled={true} />
                    </div>
                    <div className='input-group mb-2'>
                        <span className="input-group-text">Description</span>
                        <input ref={titleE} className='form-control' id='title' name='title' type="text" placeholder='Description' required defaultValue={props.debt?.title || ""} />
                    </div>
                    <div className='input-group mb-2'>
                        <span className="input-group-text">£</span>
                        <input ref={amountE} className='form-control' id='amount' name='amount' type="number" min={0} onChange={updateRatioNote} defaultValue={props.debt?.amount || ""} />
                    </div>
                    <div className='input-group mb-2 d-flex flex-row'>
                        <select ref={debtOwnerE} defaultValue={debtOwner} className='form-select text-center'>
                            <option value="equally">Split Equally</option>
                            <option value={props.otherUser}>You owe them {totalValue}</option>
                            <option value={cookies.username}>{props.otherUser} owes you {totalValue}</option>
                        </select>
                        {/* <div className='input-group mb-2 d-flex flex-row'>
                        <label htmlFor="ratio" className="input-group-text">Ratio</label>
                        <span className='input-group-text'>{ratioPerc}%</span>
                        <div className='mx-2 my-auto mt-2 flex-fill'>
                            <input ref={ratioE} className='form-range' id='ratio' name='ratio' type="range" min={0} max={100} step={5} defaultValue={ratioPerc} onChange={updateRatioNote} />
                        </div>
                    </div> */}
                        {/* <span className="input-group-text">They owe you £</span>
                        <input ref={lentE} className='form-control' id='lent' name='lent' type="number" value={lentValue.toFixed(2)} readOnly /> */}
                        <span className="input-group-text"><FontAwesomeIcon icon={faCalendarAlt} /></span>
                        <input ref={addedE} className='form-control' type='date' name="added" id="added" defaultValue={defaultDate}></input>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveDebt}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
})