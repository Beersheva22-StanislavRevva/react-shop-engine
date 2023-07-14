import { useEffect, useRef, useState } from "react";
import InputResult from "../../model/InputResult";

import { StatusType } from "../../model/StatusType";

import { Alert, Button, TextField } from "@mui/material";
type Props = {
    submitFn: (inputText: string) => InputResult;
    placeholder: string;
    buttonTitle? : string;
    type?: string
}
const Input: React.FC<Props> = ({submitFn, placeholder, buttonTitle, type}) => {
    
   const inputElementRef = useRef<any>(null);
   const [disabled, setDisabled] = useState<boolean>(true);
   const [message, setMessage] = useState<string>("");
  const status = useRef<StatusType>('success');
    function onClickFn(){
        const res = submitFn(inputElementRef.current!.value);
        status.current = res.status;
        if(res.status === "success") {
            inputElementRef.current!.value = ''
        }
        setMessage(res.message || '');
        res.message && setTimeout(() => setMessage(''), 5000);
    }
    function onChangeFn(event: any) {
        inputElementRef.current = event.target as any
        setDisabled(!event.target.value)
    }
    return <div>
        <TextField  size="small" fullWidth type={type || 'text'} placeholder={placeholder} ref={inputElementRef} 
        onChange={onChangeFn}/>
        <Button onClick={onClickFn} disabled={disabled}>{buttonTitle || 'GO' }</Button>
        {message && <Alert severity={status.current} >{message}</Alert>}
    </div>
}
export default Input;