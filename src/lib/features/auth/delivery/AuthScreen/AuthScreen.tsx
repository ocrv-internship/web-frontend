import React, { useEffect, useMemo, useRef } from "react";
import { useContext } from "react";
import Spinner from "../../../../core/delivery/components/Spinner/Spinner";
import { uiDeps } from "../../../../di";
import { AuthScreenBuilder, AuthScreenContext, AuthScreenProvider, AuthScreenState, AuthType } from "../../domain/state/AuthScreenBloc";
import './AuthScreen.css';
import { Snapshot } from "../../../../core/utils/bloc/BlocBuilderFactory";

function AuthScreenContainer() {
    const create = useMemo(() => uiDeps.authScreenBloc, []);
    const builder = useMemo(() => (state: Snapshot<AuthScreenState>) => {
        console.log(state);
        if (state === null) return <Spinner />; 
        return <AuthScreen />;
    }, []);
    return <AuthScreenProvider create={create}>
        <AuthScreenBuilder builder={builder} />
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

    const getLoginTarget = (t: EventTarget) => {
        return t as typeof t & {
            username: {value: string}, 
            password: {value: string},
        };
    }
    const getRegisterTarget = (t: EventTarget) => {
        return t as typeof t & {
            username: {value: string}, 
            password: {value: string},
            passwordRepeat: {value: string},
        };
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (bloc.state.type === AuthType.registration) {
            const t = getRegisterTarget(e.target);
            bloc.onRegister(t.username.value, t.password.value, t.passwordRepeat.value);
        } else {
            const t = getLoginTarget(e.target);
            bloc.onLogin(t.username.value, t.password.value);
        }
    }

    const usernameRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!bloc.state.failures) return;
        console.log('here2');
        const username = usernameRef.current;
        username?.setCustomValidity("Test Test Test"); 
        username?.reportValidity();
        return () => {
            console.log("clearing validity");
            username?.setCustomValidity('');
        }
    }, [bloc.state.failures]);

    return (
        <form onSubmit={onSubmit}>
            <input onInput={bloc.clearFailures} ref={usernameRef} placeholder="Логин" name="username" required autoComplete="username" autoCorrect="false" />
            <input placeholder="Пароль" name="password" required autoComplete="password" type="password"/>
            { 
                bloc.state.type === AuthType.registration ? 
                <input placeholder="Повтор пароля" name="passwordRepeat" required autoComplete="password" type="password"/>
                : <></>
            }
            <button type="submit" className="highlighted">
                {bloc.state.type === AuthType.login ? "Войти" : "Зарегистрироваться"}
            </button>
        </form>
    );
}


export default AuthScreenContainer;