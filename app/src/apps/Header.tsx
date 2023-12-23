import { PropsWithChildren, memo } from "react";
import Login from "./Login";

interface HeaderProps {
    loginElem: JSX.Element
}
export default memo(function Header(props: PropsWithChildren<HeaderProps>) {
    return (
        <header>
            <nav className="navbar navbar-expand-sm">
                <div className="offset-lg-8 col-lg-4">
                    {props.loginElem}
                </div>
            </nav>
        </header>
    );
})