
import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles=makeStyles(()=>({
    selButton:{
        border:'1px solid gold',
        borderRadius:5,
        padding:'10px 20px',
        fontFamily:'Montserrat',
        cursor:'pointer',
        "&:hover":{
            backgroundColor:'gold',
            color:'black',
        },
        width:'22%'
    }
}))

const SelectButton = ({children,selected,onClick}) => {
    const classes=useStyles(selected);
  return (
    <span className={classes.selButton} 
    style={{backgroundColor:selected?'gold':'',
    color:selected?'black':'',
    fontWeight:selected?700:500,}} 
    onClick={onClick}>{children}</span>
  )
}

export default SelectButton;