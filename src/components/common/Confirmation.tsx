import React from 'react';
import {Button, Box, Dialog,DialogActions,
     DialogContent, DialogContentText, DialogTitle} from '@mui/material'

type Props = {
    title: string;
    content: string;
    confirmFn: (isOk: boolean) => void;
    open: boolean
}



export  const Confirmation: React.FC<Props> = ({title, confirmFn, content, open}) => {
  const handleClose = (isOk: boolean) => {
    confirmFn(isOk);
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={() =>handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
          <Button onClick={() => handleClose(true)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    
  );
}