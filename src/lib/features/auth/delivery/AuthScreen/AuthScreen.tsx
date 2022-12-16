import { useContext } from "react";
import Spinner from "../../../../core/delivery/components/Spinner/Spinner";
import { uiDeps } from "../../../../di";
import { AuthScreenBuilder, AuthScreenContext, AuthScreenProvider, AuthScreenState, AuthType } from "../../domain/state/AuthScreenBloc";
import './AuthScreen.css';

function AuthScreenContainer() {
    return <AuthScreenProvider create={uiDeps.authScreenBloc}>
        <AuthScreenBuilder builder={(state) => {
            console.log(state);
            if (state === null) return <Spinner />; 
            return <AuthScreen state={state} />;
        }} />
    </AuthScreenProvider>
}

function AuthScreen({state} : {state: AuthScreenState}) {
    const bloc = useContext(AuthScreenContext)!; 
    return (
        <section id="authSection">
            <h2>{state.type == AuthType.login ? "Вход" : "Регистрация"}</h2>
            <p>{state.type == AuthType.login ? "Нет аккаунта?" : "Уже есть аккаунт?"}</p>
            <button onClick={bloc.toggleType} className="simple">
                {state.type == AuthType.login ? "Создать аккаунт" : "Войти в существующий аккаунт"}
            </button>
        </section>
    )
}

export default AuthScreenContainer;