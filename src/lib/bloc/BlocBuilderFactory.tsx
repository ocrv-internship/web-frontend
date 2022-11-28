import React, { useContext, useEffect, useState } from 'react';
import { Bloc } from './Bloc';

export enum ConnectionState {
  none,
  waiting,
  active,
  done,
}

export class AsyncSnapshot<T> {
  constructor(readonly connectionState: ConnectionState, readonly data: T | null, readonly error: Error | null) {};
};

export interface BlocBuilderProps<S, B extends Bloc<S>> {
  builder: (bloc: B, snapshot: AsyncSnapshot<S>) => React.ReactElement;
}

function BlocBuilderFactory<S, B extends Bloc<S>>(context: React.Context<B | null>) {
  return ({builder} : BlocBuilderProps<S, B>) => {
      const [snapshot, setSnapshot] = useState<AsyncSnapshot<S>>(new AsyncSnapshot<S>(ConnectionState.waiting, null, null)); 
      const bloc = useContext(context);
      useEffect(() => {
        if (bloc === null) return;
        setSnapshot(new AsyncSnapshot<S>(ConnectionState.active, bloc.state, null));
        const subscription = bloc.stream.subscribe(
          {
            next: (value) => setSnapshot(new AsyncSnapshot(ConnectionState.active, value, null)),
            error: (error) => setSnapshot(new AsyncSnapshot<S>(ConnectionState.active, null, error)),
            complete: () => setSnapshot(new AsyncSnapshot<S>(ConnectionState.done, null, null)),
          }
        );
        return () => subscription.unsubscribe();
      }, []); // TODO: stop calling this on every re-render

      if (bloc === null) return <h1>No bloc found in context</h1>;
      return builder(bloc, snapshot);
  }
}

export default BlocBuilderFactory;