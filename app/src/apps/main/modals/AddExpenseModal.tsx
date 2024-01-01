import { PropsWithChildren, memo, useContext, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { UserContext } from '../../../App';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt';

interface AddExpenseModalProps {
    onSuccess: () => void;
    onClose?: () => void;

    debt?: DebtDetailApiResponse;
    otherUser?: string;
    className?: string;
}

export default memo(function ExpenseModal(props: PropsWithChildren<AddExpenseModalProps>) {
    const otherE = useRef<HTMLInputElement>(null);
    const titleE = useRef<HTMLInputElement>(null);
    const amountE = useRef<HTMLInputElement>(null);
    const lentE = useRef<HTMLInputElement>(null);
    const ratioE = useRef<HTMLInputElement>(null);
    const addedE = useRef<HTMLInputElement>(null);

    const [lentValue, setLentField] = useState<number>(props.debt?.lent || 10000);
    const [ratioPerc, setRatioPerc] = useState<string>("50");

    const [cookies, _] = useCookies(["csrftoken", "username"]);
    const userCtx = useContext(UserContext);

    const [show, setShow] = useState<boolean>(props.debt ? true : false);

    const handleClose = () => {
        setShow(false);
        if (props.onClose) { props.onClose(); }
    };
    const handleShow = () => setShow(true);

    const saveDebt = () => {
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
                is_owed: otherE.current?.value,
                title: titleE.current?.value,
                amount: amountE.current?.value,
                lent: lentE.current?.value,
                ratio: ratioE.current?.value,
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
            setRatioPerc(ratioE.current?.value || "50");
            const ratio = parseInt(ratioE.current?.value || "50") / 100;
            const owedByYou = parseInt(amountE.current?.value) * ratio;
            const owedByThem = Math.abs(owedByYou - parseInt(amountE.current?.value));
            setLentField(owedByThem);
        }
    }

    // okay i'll need multiple modals so this button can't be that specific, should take some props name, action etc
    const addExpense = props.debt ? null : <Button variant="warning" onClick={handleShow}>Add expense</Button>;
    // const addExpense = props.debt ? null : <Button variant="dager-outline" onClick={handleSettle}>Add expense</Button>;
    const defaultDate = new Date().toLocaleDateString("en-CA");

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
                        <input ref={otherE} className='form-control' id='is_owed' name='is_owed' type="text" required defaultValue={props.otherUser || ""} />
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
                        <label htmlFor="ratio" className="input-group-text">Ratio</label>
                        <span className='input-group-text'>{ratioPerc}%</span>
                        <div className='mx-2 my-auto mt-2 flex-fill'>
                            <input ref={ratioE} className='form-range' id='ratio' name='ratio' type="range" min={0} max={100} step={5} defaultValue={props.debt?.ratio || 50} onChange={updateRatioNote} />
                        </div>
                    </div>
                    <div className='input-group mb-2'>
                        <span className="input-group-text">They pay £</span>
                        <input ref={lentE} className='form-control' id='lent' name='lent' type="number" value={lentValue.toFixed(2)} readOnly />
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