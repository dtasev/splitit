import { PropsWithChildren, memo, useContext, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { UserContext } from '../../App';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

interface ModalProps {

}

export default memo(function ExpenseModal(props: PropsWithChildren<ModalProps>) {
    const other = useRef<HTMLInputElement>(null);
    const title = useRef<HTMLInputElement>(null);
    const amount = useRef<HTMLInputElement>(null);
    const ratio = useRef<HTMLInputElement>(null);

    const [ratioNote, setRatioNote] = useState<string>("");

    const [cookies, _] = useCookies(["csrftoken"]);
    const token = useContext(UserContext);

    const [show, setShow] = useState<boolean>(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const saveDebt = () => {
        fetch(`/api/debts/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CsrfToken": cookies.csrftoken,
                "Authorization": `Token ${token}`,
            },
            body: JSON.stringify({
                is_owed: other.current?.value,
                title: title.current?.value,
                amount: amount.current?.value,
                ratio: ratio.current?.value,
            })
        }).then((res) => {
            if (res.status >= 400 && res.status < 500) { throw new Error() }
            handleClose();
        })
    }

    const updateRatioNote = () => {
        if (other.current?.value && amount.current?.value) {
            const owedByYou = parseInt(amount.current?.value) * parseInt(ratio.current?.value) / 100;
            const owedByThem = Math.abs(owedByYou - parseInt(amount.current?.value));
            setRatioNote(`You pay £${owedByYou} and they pay £${owedByThem}.`);
        }
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add expense
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='input-group'>
                        <label className='form-label' htmlFor="is_owed">With you and: </label>
                        <input ref={other} className='form-control' id='is_owed' name='is_owed' type="text" required />
                    </div>
                    <div className='input-group'>
                        <span className="input-group-text">Description</span>
                        <input ref={title} className='form-control' id='title' name='title' type="text" placeholder='Description' required />
                    </div>
                    <div className='input-group'>
                        <span className="input-group-text">£</span>
                        <input ref={amount} className='form-control' id='amount' name='amount' type="number" min={0} onChange={updateRatioNote} />
                        <span className="input-group-text">Ratio</span>
                        <input ref={ratio} className='form-control' id='ratio' name='ratio' type="number" min={1} max={100} step={1} defaultValue={50} onChange={updateRatioNote} />
                    </div>

                    <div className='text-center'>
                        <span>{ratioNote}</span>
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
        </>
    );
})