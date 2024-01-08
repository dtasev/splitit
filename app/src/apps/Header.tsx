import { PropsWithChildren, memo } from "react";
import Login from "./Login";

interface HeaderProps {
    onSuccessLogin: (json: UserContextI) => void
}

export default memo(function Header(props: PropsWithChildren<HeaderProps>) {
    return (
        <header className="mb-5">
            <div className="d-flex bg-body-tertiary" id="navbarSupportedContent">
                <div className="flex-grow-1">
                    <nav className="navbar navbar-expand-md bg-body-tertiary">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="my-auto">
                    <Login onSuccess={props.onSuccessLogin} />
                </div>
            </div>
        </header>
    );
})