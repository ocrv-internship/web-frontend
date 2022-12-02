import React, { useContext, useEffect, useState } from 'react';
import { Bloc } from './Bloc';

export enum ConnectionState {
  none,
  waiting,
  active,
  done,
}

export type Snapshot<S> = S | null;

export interface BlocBuilderProps<S> {
  builder: (snapshot: Snapshot<S>) => React.ReactElement;
}

function BlocBuilderFactory<S, B extends Bloc<S>>(context: React.Context<B | null>) {
  function BlocBuilder({builder} : BlocBuilderProps<S>) {
      const [snapshot, setSnapshot] = useState<Snapshot<S>>(null); 
      const bloc = useContext(context);
      useEffect(() => {
        if (bloc === null) return;
        setSnapshot(bloc.state);
        const subscription = bloc.stream.subscribe(
          {
            next: (value) => setSnapshot(value),
            error: (error) => {throw Error(`error was thrown on a bloc: ${error}`); },
            complete: () => {},
          }
        );
        return () => subscription.unsubscribe();
      }, [builder, bloc]); 

      if (bloc === null) throw Error("No bloc found in context"); 
      return builder(snapshot);
  }

  return BlocBuilder;
}

export default BlocBuilderFactory;