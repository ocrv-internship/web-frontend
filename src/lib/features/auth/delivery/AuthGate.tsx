import Spinner from "../../../core/delivery/components/Spinner/Spinner";
import { uiDeps } from "../../../di";
import { AuthBuilder, AuthProvider, AuthState } from "../domain/state/AuthBloc";

function AuthGate({home} : {home: React.ReactElement}) {
    return (
        <AuthProvider create={uiDeps.authBloc} >
            <AuthBuilder builder={(snapshot) => {
                if (snapshot == null) return <Spinner />; 
                else if (snapshot != AuthState.authenticated) return <p>Login</p>; 
                return home;
            }} />
        </AuthProvider>
    );
}

export default AuthGate; 