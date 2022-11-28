import { Bloc } from "./Bloc";
import BlocBuilderFactory from "./BlocBuilderFactory";
import { createContext } from "react";
import BlocProviderFactory from "./BlocProviderFactory";


function BlocComponentsFactory<S, B extends Bloc<S>>() {
    const context = createContext<B | null>(null);
    return {
        Provider: BlocProviderFactory<S, B>(context),
        Builder: BlocBuilderFactory<S, B>(context), 
    }
}

export default BlocComponentsFactory;