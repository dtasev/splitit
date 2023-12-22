import { memo, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';


export default memo(function Login() {
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
                console.log(resp, resp.headers);
            })
    };
    return (<>
        <form>
            <input type="hidden" name="csrftoken" value={cookies.csrftoken} />
            <div className="input-group">
                <label htmlFor="username">Username</label>
                <input ref={usernameRef} type="text" name="username" id="username" className='input form-control' />

                <label htmlFor="password">Password</label>
                <input ref={passwordRef} type="text" name="password" id="password" className='input form-control' />
            </div>
            <button type='button' onClick={doLogin}>Login</button>
        </form>
    </>);
})