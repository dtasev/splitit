import { PropsWithChildren, memo, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';

interface LoginProps {
    onSuccess: (arg0: any) => void;
}
export default memo(function Login(props: PropsWithChildren<LoginProps>) {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [cookies, _] = useCookies(["csrftoken"]);
    const doLogin = () => {
        fetch("http://localhost:5555/api/token-auth/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "username": usernameRef?.current?.value,
                    "password": passwordRef?.current?.value
                }),
            }).then((resp) => {
                return resp.json();
            }).then((json) => {
                props.onSuccess(json)
            });
    };
    return (<>
        <form>
            <input type="hidden" name="csrftoken" value={cookies.csrftoken} />
            <div className="input-group">
                <span className='input-group-text'>Username</span>
                <input ref={usernameRef} type="text" name="username" id="username" className='input form-control' />
            </div>

            <div className="input-group">
                <span className='input-group-text'>Password</span>
                <input ref={passwordRef} type="text" name="password" id="password" className='input form-control' />
                <button type='button' className='btn btn-primary' onClick={doLogin}>Login</button>
            </div>
        </form>
    </>);
})