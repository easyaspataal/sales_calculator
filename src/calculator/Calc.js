import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {  Grid } from '@mui/material';
import axios from 'axios';
import Divider from '@mui/material/Divider';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


const Calc = () => {

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await axios.get('https://script.google.com/macros/s/AKfycbzyScRTG93-kQU9HQQSMFR5nWqPmmsGSzXlQ_0QfdJPfUvihXQOAxN_CGuazQYO8cm-/exec');
        console.log(response)
      } catch (error) {
        console.error('Error fetching pricing data:', error);
      }
    };
    fetchPricingData()
  },[])
 

  return (
    <div>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: "#f89816" }}>
              <Typography variant="h3">Upload Excel</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography variant="h3">Test l</Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography style={{ fontWeight: "bold", fontSize: "20px", padding: "20px" }} gutterBottom variant="h5" component="div">
                Selected Options
              </Typography>
              <Divider>{" "}</Divider>
              <Typography style={{ fontWeight: "bold", fontSize: "15px", padding: "20px" }} variant="body2" color="text.secondary">
                <strong>Organization:</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


    </div>
  );
};

export default Calc;
