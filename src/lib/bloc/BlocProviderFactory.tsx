import React, { useEffect, useState } from "react";
import { Bloc } from "./Bloc";



interface BlocProviderProps<S, B extends Bloc<S>> {
    create: () => B,
    children: React.ReactNode[] | React.ReactNode,
}

function BlocProviderFactory<S, B extends Bloc<S>>(context: React.Context<B | null>) {
    return ({ create, children }: BlocProviderProps<S, B>) => {
        const [bloc, setBloc] = useState<B | null>(null);
        useEffect(() => {
            const createdBloc = create();
            setBloc(createdBloc);
            return createdBloc.dispose;
        }, []);
        if (bloc == null) return <p>Loading...</p>;

        return (
            <context.Provider value={bloc}>
                {children}
            </context.Provider>
        );
    }
}

export default BlocProviderFactory;