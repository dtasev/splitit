import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropsWithChildren, memo, useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useCookies } from 'react-cookie';

interface LoginProps {
    onSuccess: (arg0: any) => void;
}
export default memo(function Login(props: PropsWithChildren<LoginProps>) {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const [cookies, setCookies, removeCookie] = useCookies(["csrftoken", "apitoken", "username"]);

    // const doBasicLogin = () => {
    //     if (cookies.username && cookies.apitoken) {
    //         props.onSuccess({ username: cookies.username, token: cookies.apitoken });
    //         setLoggedIn(true);
    //         return;
    //     }

    //     fetch(`${import.meta.env.VITE_API_URL}/api/token-auth/`,
    //         {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "X-CsrfToken": cookies.csrftoken,
    //             },
    //             body: JSON.stringify({
    //                 "username": usernameRef?.current?.value,
    //                 "password": passwordRef?.current?.value
    //             }),
    //         }).then((resp) => {
    //             if (resp.status >= 400) {
    //                 throw new Error();
    //             }
    //             return resp.json();
    //         }).then((json) => {
    //             setLoggedIn(true);
    //             setCookies("username", usernameRef?.current?.value);
    //             setCookies("apitoken", json.token);
    //             props.onSuccess({ username: usernameRef?.current?.value, token: json.token });
    //         });
    // };

    const doGOAuth = () => {
        if (!cookies.csrftoken) { return; }

        fetch(`${import.meta.env.VITE_API_URL}/api/ud/me/`,
            {
                method: "GET",
            }).then((resp) => {
                if (resp.status >= 400) {
                    throw new Error();
                }
                return resp.json();
            }).then((json: UserDetailApiResponse) => {
                setLoggedIn(true);
                setCookies("username", json.username);
                // sets the api token anyway for fun
                setCookies("apitoken", json.token);
                props.onSuccess({ username: json.username, token: json.token });
            });
    };

    const doLogout = () => {
        setLoggedIn(false);
        removeCookie("username");
        removeCookie("apitoken");
        fetch(`${import.meta.env.VITE_API_URL}/api/logout/`,
            {
                method: "GET"
            }).then((resp) => {
                if (resp.status >= 400) {
                    throw new Error();
                }
                props.onSuccess({ username: "", token: "" });
            });

    }

    useEffect(() => doGOAuth(), []);

    // const loginForm = (
    //     <form>
    //         <div className="input-group">
    //             <span className='input-group-text'>Username</span>
    //             <input ref={usernameRef} type="text" name="username" id="username" className='input form-control' />
    //         </div>

    //         <div className="input-group">
    //             <span className='input-group-text'>Password</span>
    //             <input ref={passwordRef} type="text" name="password" id="password" className='input form-control' />
    //             <button type='button' className='btn btn-primary' onClick={doLogin}>Login</button>
    //         </div>
    //     </form>
    // );
    const loginForm = (
        <a className='btn btn-primary' href="/api/login/google-oauth2/?next=/">Log in with <FontAwesomeIcon icon={faGoogle} /></a>
    )
    const logOutForm = <div className='input-group'>
        <div className='input-group-text'>Hello {cookies.username}!</div>
        <button type='button' className='btn btn-outline-primary' onClick={doLogout}>Logout</button>
    </div>

    return <Container fluid={true}>{loggedIn ? logOutForm : loginForm}</Container>;
})
