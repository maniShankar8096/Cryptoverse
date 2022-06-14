import React, { useEffect, useState } from 'react'
import { HistoricalChart } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { CircularProgress, createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import SelectButton from './SelectButton';

const useStyles=makeStyles((theme)=>({
    container:{
        width:'75%',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        marginTop:25,
        padding:40,
        [theme.breakpoints.down('md')]:{
            width:'100%',
            marginTop:0,
            padding:20,
            paddingTop:0,
        }
    }
}))

const CoinInfo = ({coin}) => {

    const [historicalData,setHistoricalData]=useState();
    const [days,setDays]=useState(1);

    const {currency,symbol}=CryptoState();
    const fetchHistoricalData=async()=>{
        await fetch(HistoricalChart(coin.id,currency.toLowerCase(),days))
        .then(res=>res.json())
        .then(data=>{setHistoricalData(data.prices)});
    }
    
    useEffect(()=>{
        fetchHistoricalData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currency,days])

    const darkTheme=createTheme({
        palette:{
            primary:{
                main:'#fff',
            },
            type:'dark'
        }
    })
    const classes=useStyles();

    const labels=historicalData?(
        historicalData.map(coin=>{
            let date=new Date(coin[0]);
            let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
            return days === 1 ? time : date.toLocaleDateString();
        })
    ):[];

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
      );

      //as input for buttons to change chart history
      const chartDays = [
        {
          label: "24 Hours",
          value: 1,
        },
        {
          label: "30 Days",
          value: 30,
        },
        {
          label: "3 Months",
          value: 90,
        },
        {
          label: "1 Year",
          value: 365,
        },
      ];

  return (
    <ThemeProvider theme={darkTheme}>
        <div className={classes.container}>
            {!historicalData ?(
                <CircularProgress style={{color:"gold"}} size={250} thickness={1}/>
            ):
            <>
            <Line
                data={{
                    labels: labels,
                    datasets:[
                        {
                            data:historicalData.map(coin=>coin[1]),
                            label:`Price (Past ${days} Days) in ${currency} ${symbol}`,
                            borderColor:'#EEBC1D'
                        }
                    ]
                }} 
                options={{
                    elements:{
                        point:{
                            radius:1
                        }
                    }
                }}
            />
            <div style={{display:'flex',marginTop:20,justifyContent:'space-around',width:'100%'}}>
                {chartDays.map(ele=>{
                    return <SelectButton 
                    onClick={()=>{setDays(ele.value)}} 
                    selected={ele.value===days}
                    key={ele.value}>Past{" "}{ele.label}</SelectButton>
                })}
            </div>
            </>
            }
            
        </div>
    </ThemeProvider>
  )
}

export default CoinInfo