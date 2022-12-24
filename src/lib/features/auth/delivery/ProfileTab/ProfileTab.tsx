import { useContext } from "react";
import { AuthContext } from "../../domain/state/AuthBloc";
import "./ProfileTab.css";

function ProfileTab() {
    const authBloc = useContext(AuthContext);
    return (
        <section id="profileTab">
            <button onClick={authBloc?.logout} className="simple">
                Выйти
            </button> 
        </section>
    );
}

export default ProfileTab;