import { PropsWithChildren, memo } from "react";
import Login from "./Login";

interface HeaderProps {
    onSuccessLogin: (json: UserContextI) => void
}

export default memo(function Header(props: PropsWithChildren<HeaderProps>) {
    return (
        <header className="mb-5">
            <nav className="navbar navbar-expand-md bg-body-tertiary">
                <div className="" id="navbarSupportedContent">
                    {/* todo fix collapse */}
                    {/* <div className="collapse navbar-collapse" id="navbarSupportedContent"> */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        {/* <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                        </li> */}
                    </ul>
                    <form className='d-flex'>
                        <Login onSuccess={props.onSuccessLogin} />
                    </form>
                </div>
            </nav>
        </header>
    );
})