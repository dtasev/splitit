import { PropsWithChildren, memo, useContext, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { UserContext } from '../../../App';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

interface ModalProps {
    onSuccess: () => void;
    onClose?: () => void;

    debt?: DebtApiResponse;
    className?: string;
}

export default memo(function SettleUpModal(props: PropsWithChildren<ModalProps>) {
    const other = useRef<HTMLInputElement>(null);
    const title = useRef<HTMLInputElement>(null);
    const amount = useRef<HTMLInputElement>(null);
    const ratio = useRef<HTMLInputElement>(null);
    const added = useRef<HTMLInputElement>(null);

    const [ratioNote, setRatioNote] = useState<string>("");

    const [cookies, _] = useCookies(["csrftoken"]);
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
                is_owed: other.current?.value,
                title: title.current?.value,
                amount: amount.current?.value,
                ratio: ratio.current?.value,
                added: added.current?.value,
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
        if (other.current?.value && amount.current?.value) {
            const owedByYou = parseInt(amount.current?.value) * parseInt(ratio.current?.value || "50") / 100;
            const owedByThem = Math.abs(owedByYou - parseInt(amount.current?.value));
            setRatioNote(`You pay £${owedByYou} and they pay £${owedByThem.toFixed(2)}`);
        }
    }

    // okay i'll need multiple modals so this button can't be that specific, should take some props name, action etc
    const addExpense = props.debt ? null : <Button variant="outline-success" disabled={true} onClick={handleShow}>Settle Up</Button>;
    // const addExpense = props.debt ? null : <Button variant="dager-outline" onClick={handleSettle}>Add expense</Button>;
    const defaultDate = new Date().toLocaleDateString("en-CA");

    return (
        <div className={props.className}>
            {addExpense}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Settle Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='input-group'>
                        <label className='form-label' htmlFor="is_owed">With you and: </label>
                        <input ref={other} className='form-control' id='is_owed' name='is_owed' type="text" required defaultValue={props.debt?.is_owed_username || ""} />
                    </div>
                    <div className='input-group'>
                        <span className="input-group-text">Description</span>
                        <input ref={title} className='form-control' id='title' name='title' type="text" placeholder='Description' required defaultValue={props.debt?.title || ""} />
                    </div>
                    <div className='input-group'>
                        <span className="input-group-text">£</span>
                        <input ref={amount} className='form-control' id='amount' name='amount' type="number" min={0} onChange={updateRatioNote} defaultValue={props.debt?.amount || ""} />
                    </div>
                    <div className='border rounded'>
                        <label htmlFor="ratio" className="form-label input-group-text">Ratio</label>
                        <input ref={ratio} className='form-range' id='ratio' name='ratio' type="range" min={0} max={100} step={5} defaultValue={props.debt?.ratio || 50} onChange={updateRatioNote} />
                    </div>

                    <div className='text-center'>
                        <span>{ratioNote}</span>
                    </div>

                    <div className='input-group'>
                        <span className="input-group-text">Date</span>
                        <input ref={added} className='form-control' type='date' name="added" id="added" defaultValue={defaultDate}></input>
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