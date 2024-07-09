import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Grid, MenuItem, Select, FormControl, InputLabel, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

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
  const [pricingData, setPricingData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedLives, setSelectedLives] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedCoverage, setSelectedCoverage] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [selectedMaternity, setSelectedMaternity] = useState('');
  const [selectedWaitingPeriod, setSelectedWaitingPeriod] = useState('');
  const [planData, setPlanData] = useState([]);
  const [logic, setLogic] = useState([]);
  const [insurance, setInsurance] = useState(null);
  const [finalPrice, setFinalPrice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pricingResponse = await axios.get('https://script.google.com/macros/s/AKfycby13WWk19cHnYDWAThlu5EZfnNfBT-_azPgMciq2aZ6GRC9y4KkIIn_fSycnA6oDv4q/exec?sheet=sales_calculator');
        console.log(pricingResponse,"pricing")
        setPricingData(pricingResponse.data);
        const planResponse = await axios.get('https://script.google.com/macros/s/AKfycby13WWk19cHnYDWAThlu5EZfnNfBT-_azPgMciq2aZ6GRC9y4KkIIn_fSycnA6oDv4q/exec?sheet=plan');
        console.log(planResponse.data,"plan")
        const logicResponse = await axios.get('https://script.google.com/macros/s/AKfycby13WWk19cHnYDWAThlu5EZfnNfBT-_azPgMciq2aZ6GRC9y4KkIIn_fSycnA6oDv4q/exec?sheet=logic');
        console.log(logicResponse.data,"logic")
       
        setPlanData(planResponse.data);
        setLogic(logicResponse.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const getUniqueValues = (key) => {
    return pricingData.length > 0 ? [...new Set(pricingData.map(item => item[key]))] : [];
  };

  const plans = getUniqueValues('Plan');
  const lives = getUniqueValues('Number of Lives Insured');
  const ages = getUniqueValues('Average Age of Lives Covered');
  const coverages = getUniqueValues('Coverage');
  const frequencies = getUniqueValues('Premium Payment Frequency');
  const waitingPeriods = getUniqueValues('Waiting Period');

  const handleSubmit = () => {
    console.log("test")
    console.log(selectedLives, selectedWaitingPeriod,selectedFrequency,selectedMaternity)
    // Find the matching insurance provider
    const matchedLogic = logic.find(item =>
      item["Group Size"] === selectedLives &&
      item["Waiting Period"] === selectedWaitingPeriod &&
      item["Premium Plan "] === selectedFrequency &&
      item["Maternity Cover"] === selectedMaternity
    );
console.log(matchedLogic,"matchedlogic")
    if (matchedLogic) {
      const insuranceProvider = `${matchedLogic["Insurance will be "]} (${selectedFrequency})`;
      console.log(insuranceProvider,"insuranceProvider")
      setInsurance(insuranceProvider);
      console.log(selectedAge,"age")
      console.log(selectedPlan,"Plan")

      // Find the matching plan data
      const matchedPlan = planData.find(plan =>
        plan["Plan Type"] == insuranceProvider &&
        plan["Age"] === selectedAge &&
        plan["Plan"] === selectedPlan
      );
      console.log(matchedPlan,"maccthed plan")

      if (matchedPlan) {
        const recomedPlan = insuranceProvider;
        const sumInsuredKey = `Flashaid Price ${selectedCoverage}`;
        const gstKey = `GST ${selectedCoverage}`;
        const finalPriceKey = `Final Price ${selectedCoverage}`;

        

        const sumInsuredPrice = matchedPlan[sumInsuredKey];
        const gstPrice = matchedPlan[gstKey];
        const finalPrice = matchedPlan[finalPriceKey];

        console.log(sumInsuredPrice)
        console.log(gstPrice)
        console.log(finalPrice)
       

        setFinalPrice({
          recomedPlan,
          sumInsuredPrice,
          gstPrice,
          finalPrice
        });
      }
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Select Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Plan</InputLabel>
                    <Select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                    >
                      {plans.map(plan => (
                        <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Number of Lives</InputLabel>
                    <Select
                      value={selectedLives}
                      onChange={(e) => setSelectedLives(e.target.value)}
                    >
                      {lives.map(life => (
                        <MenuItem key={life} value={life}>{life}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Age</InputLabel>
                    <Select
                      value={selectedAge}
                      onChange={(e) => setSelectedAge(e.target.value)}
                    >
                      {ages.map(age => (
                        <MenuItem key={age} value={age}>{age}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Coverage</InputLabel>
                    <Select
                      value={selectedCoverage}
                      onChange={(e) => setSelectedCoverage(e.target.value)}
                    >
                      {coverages.map(coverage => (
                        <MenuItem key={coverage} value={coverage}>{coverage}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Frequency</InputLabel>
                    <Select
                      value={selectedFrequency}
                      onChange={(e) => setSelectedFrequency(e.target.value)}
                    >
                      {frequencies.map(frequency => (
                        <MenuItem key={frequency} value={frequency}>{frequency}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Waiting Period</InputLabel>
                    <Select
                      value={selectedWaitingPeriod}
                      onChange={(e) => setSelectedWaitingPeriod(e.target.value)}
                    >
                      {waitingPeriods.map(period => (
                        <MenuItem key={period} value={period}>{period}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Maternity</InputLabel>
                    <Select
                      value={selectedMaternity}
                      onChange={(e) => setSelectedMaternity(e.target.value)}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography style={{ fontWeight: "bold", fontSize: "20px", padding: "20px" }} gutterBottom variant="h5" component="div">
                Selected Options
              </Typography>
              <Divider />
              <Typography style={{ fontWeight: "bold", fontSize: "15px", padding: "20px" }} variant="body2" color="text.secondary">
                <strong>Plan:</strong> {selectedPlan}
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: "15px", padding: "20px" }} variant="body2" color="text.secondary">
                <strong>Number of Lives:</strong> {selectedLives}
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: "15px", padding: "20px" }} variant="body2" color="text.secondary">
                <strong>Age:</strong> {selectedAge}
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: "15px", padding: "20px" }} variant="body2" color="text.secondary">
                <strong>Coverage:</strong> {selectedCoverage}
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: "15px", padding: "20px" }} variant="body2" color="text.secondary">
                <strong>Payment Frequency:</strong> {selectedFrequency}
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: "15px", padding: "20px" }} variant="body2" color="text.secondary">
                <strong>Maternity:</strong> {selectedMaternity}
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: "15px", padding: "20px" }} variant="body2" color="text.secondary">
                <strong>Waiting Period:</strong> {selectedWaitingPeriod}
              </Typography>
              
              {finalPrice && (
                <>
                  <Divider />
                  <Typography style={{ fontWeight: "bold", fontSize: "20px", padding: "20px" }} gutterBottom variant="h5" component="div">
                Result 
              </Typography>
                  <Typography style={{ fontWeight: "bold", fontSize: "15px", padding: "20px" }} variant="body2" color="text.secondary">
                    <strong>Recommended Plan:</strong> {finalPrice.recomedPlan}
                  </Typography>
                  <Typography style={{ fontWeight: "bold", fontSize: "15px", padding: "20px" }} variant="body2" color="text.secondary">
                    <strong>Sum Insured Price:</strong> {finalPrice.sumInsuredPrice}
                  </Typography>
                  <Typography style={{ fontWeight: "bold", fontSize: "15px", padding: "20px" }} variant="body2" color="text.secondary">
                    <strong>GST Price:</strong> {finalPrice.gstPrice}
                  </Typography>
                  <Typography style={{ fontWeight: "bold", fontSize: "15px", padding: "20px" }} variant="body2" color="text.secondary">
                    <strong>Final Price:</strong> {finalPrice.finalPrice}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Calc;
