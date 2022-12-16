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
            return <AuthScreen />;
        }} />
    </AuthScreenProvider>
}

function AuthScreen() {
    const bloc = useContext(AuthScreenContext)!; 
    return (
        <div id="authSectionWrapper">
            <section id="authSection">
                <h2>{bloc.state.type == AuthType.login ? "Вход" : "Регистрация"}</h2>
                <AuthForm />
                <p>Или</p>
                <button className="simple" onClick={bloc.toggleType}>
                    {bloc.state.type == AuthType.login ? "Создать аккаунт" : "Войти"}
                </button>
            </section>
        </div>
    )
}

function AuthForm() {
    const bloc = useContext(AuthScreenContext)!; 
    return (
        <form>
            <input placeholder="Логин" name="username" required autoComplete="username" autoCorrect="false" />
            <input placeholder="Пароль" name="password" required autoComplete="password" type="password"/>
            { 
                bloc.state.type == AuthType.registration ? 
                <input placeholder="Повтор пароля" name="passwordRepeat" required autoComplete="password" type="password"/>
                : <></>
            }
            <button type="submit" className="highlighted">
                {bloc.state.type == AuthType.login ? "Войти" : "Зарегистрироваться"}
            </button>
        </form>
    );
}


export default AuthScreenContainer;