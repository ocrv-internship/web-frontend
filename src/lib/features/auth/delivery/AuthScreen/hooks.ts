import React, { useEffect } from "react";

type InputRef = React.MutableRefObject<HTMLInputElement | null>;

function useFieldValidation(ref: InputRef, failures: string[] | undefined) {
    useEffect(() => {
        if (!failures || !ref.current) return; 
        const field = ref.current;
        field.setCustomValidity(failures[0]);
        field.reportValidity(); 
        return () => field.setCustomValidity('');
    }, [failures]);
}
export default useFieldValidation;