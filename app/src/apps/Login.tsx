import { PropsWithChildren, memo, useEffect, useRef, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useCookies } from 'react-cookie';

interface LoginProps {
    onSuccess: (arg0: any) => void;
}
export default memo(function Login(props: PropsWithChildren<LoginProps>) {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [cookies, setCookies] = useCookies(["apitoken", "username"]);
    const doLogin = () => {
        if (cookies.username && cookies.apitoken) {
            props.onSuccess({ username: cookies.username, token: cookies.apitoken });
            setLoggedIn(true);
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/token-auth/`,
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
                if (resp.status >= 400) {
                    throw new Error();
                }
                return resp.json();
            }).then((json) => {
                setLoggedIn(true);
                setCookies("username", usernameRef?.current?.value);
                setCookies("apitoken", json.token);
                props.onSuccess({ username: usernameRef?.current?.value, token: json.token });
            });
    };

    const doLogout = () => {
        setLoggedIn(false);
        setCookies("username", "");
        setCookies("apitoken", "");
        props.onSuccess({ username: "", token: "" });
    }

    useEffect(() => doLogin(), []);

    const loginForm = (
        <form>
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
    );

    const logOutForm = <form>
        <div className='d-flex flex-row-reverse'></div>
        <button type='button' className='btn btn-primary' onClick={doLogout}>Logout</button>
    </form>

    return <Container><Row>{loggedIn ? logOutForm : loginForm}</Row></Container>;
})