import AuthScreenBloc, { AuthType } from "../../domain/state/AuthScreenBloc";

function getLoginTarget(t: EventTarget) {
    return t as typeof t & {
        username: {value: string}, 
        password: {value: string},
    };
}
function getRegisterTarget(t: EventTarget) {
    return t as typeof t & {
        username: {value: string}, 
        password: {value: string},
        passwordRepeat: {value: string},
    };
};

const onSubmit = (bloc: AuthScreenBloc) =>
    (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (bloc.state.type === AuthType.registration) {
            const t = getRegisterTarget(e.target);
            bloc.onRegister(t.username.value, t.password.value, t.passwordRepeat.value);
        } else {
            const t = getLoginTarget(e.target);
            bloc.onLogin(t.username.value, t.password.value);
        }
    };

export default onSubmit;