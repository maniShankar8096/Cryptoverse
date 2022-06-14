import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { numberWithCommas } from './Banner/Carousel';
import axios from 'axios';
import { CoinList } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { Container, createTheme, LinearProgress, TableContainer, TextField, ThemeProvider, Typography,Table, TableHead, TableRow, TableCell, TableBody, makeStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

const useStyles=makeStyles(()=>({
    row:{
        backgroundColor:'#16171a',
        cursor:'pointer',
        "&:hover":{
            backgroundColor:'#131111'
        },
        fontFamily:"Montserrat"
    },
    pagination:{
        //to style individual page number in pagination
        "& .MuiPaginationItem-root":{
            color:"gold",
        }
    }
}))

const CoinsTable = () => {

    const [coins,setCoins]=useState([]);
    const [loading,setLoading]=useState(false);
    const [search,setSearch]=useState("");
    const [page,setPage]=useState(1);

    const {currency,symbol}=CryptoState();

    const navigate=useNavigate();
    

    const fetchCoins=async()=>{
        setLoading(true);
        const {data}= await axios.get(CoinList(currency));
        setCoins(data);
        setLoading(false);
    }

    useEffect(()=>{
        fetchCoins();
    },[currency])

    const darkTheme=createTheme({
        palette:{
            primary:{
                main:'#fff',
            },
            type:'dark'
        }
    })

    const handleSearch=()=>{
        return coins.filter((coin)=>(coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search)));
    }

    const classes=useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
        <Container style={{textAlign:'center'}}>
            <Typography variant='h4' style={{margin:18,fontFamily:'Montserrat', textTransform:'capitalize'}}>
                Crypto Currency prices by market cap
            </Typography>
            <TextField label="Search for a Crypto Currency..." 
                style={{marginBottom:20,width:'100%'}}
                onChange={(e)=>{setSearch(e.target.value)}}
                variant='outlined'/>
            <TableContainer>
                {
                    loading?(
                        <LinearProgress style={{backgroundColor:'gold'}}/>
                    ):(
                        <Table>
                            <TableHead style={{backgroundColor:'#EEBC1D'}}>
                                <TableRow>
                                    {["Coin","Price","24H Change","Market Cap"].map((head)=>
                                        <TableCell
                                            style={{color:'black',fontWeight:'700',fontFamily:'Montserrat'}}
                                            key={head}
                                            align={head==='Coin'?"":"right"}
                                        >{head}</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>{handleSearch()
                            .slice((page-1)*10,(page-1)*10+10)
                            .map((coin)=>{
                                const profit=coin.price_change_percentage_24h >=0;
                                return(
                                    <TableRow onClick={()=>navigate(`/coins/${coin.id}`)} className={classes.row} key={coin.id}>
                                        <TableCell component='th' scope='row' style={{display:'flex',gap:15}}>
                                        <img src={coin.image}
                                            alt={coin.name}
                                            height='50'
                                            style={{marginBottom:10}}
                                        />
                                        <div style={{display:'flex',flexDirection:'column'}}>
                                            <span style={{textTransform:'uppercase',fontSize:'22'}}>
                                                {coin.symbol}
                                            </span>
                                            <span style={{color:'darkgray'}}>{coin.name}</span>
                                        </div>
                                        </TableCell>
                                        <TableCell align='right'>
                                        {symbol} {numberWithCommas(coin.current_price.toFixed(2))}
                                        </TableCell>
                                        <TableCell align='right'
                                            style={{
                                                color:profit?'rgb(14,203,129)':'red',
                                                fontWeight:500,
                                            }}>
                                                {profit && "+"} {coin.price_change_percentage_24h.toFixed(2)}%
                                        </TableCell>
                                        <TableCell align='right'>
                                        {symbol} {numberWithCommas(coin.market_cap.toString().slice(0,-6))}M
                                        </TableCell>
                                    </TableRow>
                                )
                            })}</TableBody>
                        </Table>
                    )
                }
            </TableContainer>
            <Pagination count={(handleSearch()?.length/10).toFixed(0)}
            style={{
                padding:20,
                width:'100%',
                display:'flex',
                justifyContent:'center'
            }}
            classes={{ul:classes.pagination}}
            onChange={(_,value)=>{
                setPage(value);
                window.scroll(0,450);
            }}
            />
        </Container>
    </ThemeProvider>
  )
}

export default CoinsTable;