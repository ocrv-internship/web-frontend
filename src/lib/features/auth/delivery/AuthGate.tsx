import { ErrorScreen } from "../../../core/delivery/components/ErrorScreen/ErrorScreen";
import Spinner from "../../../core/delivery/components/Spinner/Spinner";
import { Failure } from "../../../core/errors/failures";
import { uiDeps } from "../../../di";
import { AuthBuilder, AuthProvider, AuthType } from "../domain/state/AuthBloc";
import AuthScreenContainer from "./AuthScreen/AuthScreen";

function AuthGate({home} : {home: React.ReactElement}) {
    return (
        <AuthProvider create={uiDeps.authBloc} >
            <AuthBuilder builder={(snapshot) => {
                if (snapshot == null || snapshot == AuthType.loading) return <Spinner />; 
                if (snapshot instanceof Failure) return <ErrorScreen err={snapshot} />;
                switch (snapshot) {
                    case AuthType.authenticated: 
                        return home; 
                    case AuthType.unauthenticated: 
                        return <AuthScreenContainer />;
                }
            }} />
        </AuthProvider>
    );
}

export default AuthGate; 