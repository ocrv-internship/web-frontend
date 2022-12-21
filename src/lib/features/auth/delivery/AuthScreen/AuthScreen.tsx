import React, { useEffect, useMemo, useRef, useState } from "react";
import { useContext } from "react";
import Spinner from "../../../../core/delivery/components/Spinner/Spinner";
import { uiDeps } from "../../../../di";
import { AuthScreenBuilder, AuthScreenContext, AuthScreenProvider, AuthScreenState, AuthType } from "../../domain/state/AuthScreenBloc";
import './AuthScreen.css';
import { Snapshot } from "../../../../core/utils/bloc/BlocBuilderFactory";
import onSubmit from "./utils";
import useFieldValidation from "./hooks";
import ErrorNotification from "../../../../core/delivery/components/ErrorNotification/ErrorNotification";

function AuthScreenContainer() {
    const create = useMemo(() => uiDeps.authScreenBloc, []);
    const builder = useMemo(() => (state: Snapshot<AuthScreenState>) => {
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
            {
                bloc.state.failures?.nonField ? 
                    <ErrorNotification message={bloc.state.failures.nonField[0]} />
                : <></>
            }
        </div>
    )
}

function AuthForm() {
    const bloc = useContext(AuthScreenContext)!; 

    const submitText = bloc.state.type === AuthType.login ? "Войти" : "Зарегистрироваться";
    const submitClassName = "highlighted " + (bloc.state.isLoading ? "button-loading" : "");

    const usernameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const passwordRepeatRef = useRef<HTMLInputElement | null>(null);
    
    const fieldFailures = bloc.state.failures?.fields;
    useFieldValidation(usernameRef, fieldFailures?.username);
    useFieldValidation(passwordRef, fieldFailures?.password);
    useFieldValidation(passwordRepeatRef, fieldFailures?.passwordRepeat);

    return (
        <form onSubmit={onSubmit(bloc)}>
            <input 
                onInput={bloc.clearFailures} 
                ref={usernameRef} 
                name="username" 
                required 
                autoComplete="username" 
                autoCorrect="false" 
                placeholder="Логин" 
            />
            <input 
                onInput={bloc.clearFailures} 
                ref={passwordRef}
                name="password" 
                required 
                autoComplete="password" 
                type="password"
                placeholder="Пароль" 
            />
            { 
                bloc.state.type === AuthType.registration ? 
                <input 
                    onInput={bloc.clearFailures}
                    ref={passwordRepeatRef}
                    name="passwordRepeat" 
                    required 
                    autoComplete="password" 
                    type="password"
                    placeholder="Повтор пароля" 
                />
                : <></>
            }
            <button type="submit" className={submitClassName}>
                {bloc.state.isLoading ? <Spinner /> : <></> }
                <p>{submitText}</p>
            </button>
        </form>
    );
}

export default AuthScreenContainer;