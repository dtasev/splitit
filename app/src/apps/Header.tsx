import { memo } from "react";
import Login from "./Login";

export default memo(function Header() {
    const login_elem = <Login />;
    return (
        <header>
            <nav className="navbar navbar-expand-sm">
                <div className="offset-lg-8 col-lg-4">
                    {login_elem}
                </div>
            </nav>
        </header>
    );
})