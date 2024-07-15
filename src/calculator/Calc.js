import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, MenuItem, Select, FormControl, InputLabel, Divider, CircularProgress } from '@mui/material';
import axios from 'axios';

const Calc = () => {
  const [pricingData, setPricingData] = useState([]);
  const [selectedPlan1, setSelectedPlan1] = useState('');
  const [selectedPlan2, setSelectedPlan2] = useState('');
  const [selectedInsurance2, setSelectedInsurance2] = useState('');
  const [selectedLives1, setSelectedLives1] = useState('');
  const [selectedLives2, setSelectedLives2] = useState('');
  const [selectedAge1, setSelectedAge1] = useState('');
  const [selectedAge2, setSelectedAge2] = useState('');
  const [selectedCoverage1, setSelectedCoverage1] = useState('');
  const [selectedCoverage2, setSelectedCoverage2] = useState('');
  const [selectedFrequency1, setSelectedFrequency1] = useState('');
  const [selectedFrequency2, setSelectedFrequency2] = useState('');
  const [selectedMaternity1, setSelectedMaternity1] = useState('');
  const [selectedMaternity2, setSelectedMaternity2] = useState('');
  const [selectedWaitingPeriod1, setSelectedWaitingPeriod1] = useState('');
  const [selectedWaitingPeriod2, setSelectedWaitingPeriod2] = useState('');
  const [planData, setPlanData] = useState([]);
  const [logic, setLogic] = useState([]);
  const [rahejaData, setRahejaData] = useState([]);
  const [insurance, setInsurance] = useState(null);
  const [finalPrice1, setFinalPrice1] = useState(null);
  const [finalPrice2, setFinalPrice2] = useState(null); // State for second calculator
  const [loading, setLoading] = useState(true);
  const [noDataFound1, setNoDataFound1] = useState(false); // State to track no data found for calculator 1
  const [noDataFound2, setNoDataFound2] = useState(false); // State to track no data found for calculator 2

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pricingResponse = await axios.get('https://script.google.com/macros/s/AKfycby13WWk19cHnYDWAThlu5EZfnNfBT-_azPgMciq2aZ6GRC9y4KkIIn_fSycnA6oDv4q/exec?sheet=sales_calculator');
        setPricingData(pricingResponse.data);
        const planResponse = await axios.get('https://script.google.com/macros/s/AKfycby13WWk19cHnYDWAThlu5EZfnNfBT-_azPgMciq2aZ6GRC9y4KkIIn_fSycnA6oDv4q/exec?sheet=plan');
        setPlanData(planResponse.data);
        const logicResponse = await axios.get('https://script.google.com/macros/s/AKfycby13WWk19cHnYDWAThlu5EZfnNfBT-_azPgMciq2aZ6GRC9y4KkIIn_fSycnA6oDv4q/exec?sheet=logic');
        setLogic(logicResponse.data);
        const rahejaResponse = await axios.get('https://script.google.com/macros/s/AKfycby13WWk19cHnYDWAThlu5EZfnNfBT-_azPgMciq2aZ6GRC9y4KkIIn_fSycnA6oDv4q/exec?sheet=rahejaPlan');
        setRahejaData(rahejaResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Ensure to stop loading in case of error
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
  const insuranceVal = getUniqueValues('Insurance');

  const handleSubmit1 = () => {
    // Find the matching insurance provider
    const matchedLogic = logic.find(item =>
      item['Group Size'] === selectedLives1 &&
      item['Waiting Period'] === selectedWaitingPeriod1 &&
      item['Premium Plan '] === selectedFrequency1 &&
      item['Maternity Cover'] === selectedMaternity1
    );

    if (matchedLogic) {
      const insuranceProvider = `${matchedLogic['Insurance will be ']} (${selectedFrequency1})`;

      if (insuranceProvider.includes('Raheja')) {
        const matchedRahejaPlan = rahejaData.find(plan =>
          plan['Age'] === selectedAge1 &&
          plan['Maternity'] === selectedMaternity1
        );

        if (matchedRahejaPlan) {
          const recomedPlan = insuranceProvider;
          const sumInsuredKey = `Flashaid Price ${selectedCoverage1}`;
          const gstKey = `GST ${selectedCoverage1}`;
          const finalPriceKey = `Final Price ${selectedCoverage1}`;

          const sumInsuredPrice = matchedRahejaPlan[sumInsuredKey];
          const gstPrice = matchedRahejaPlan[gstKey];
          const finalPrice = matchedRahejaPlan[finalPriceKey];

          setFinalPrice1({
            recomedPlan,
            sumInsuredPrice,
            gstPrice,
            finalPrice
          });
          setNoDataFound1(false);
        } else {
          setFinalPrice1(null);
          setNoDataFound1(true);
        }
      } else {
        const matchedPlan = planData.find(plan =>
          plan['Plan Type'] === insuranceProvider &&
          plan['Age'] === selectedAge1 &&
          plan['Plan'] === selectedPlan1
        );

        if (matchedPlan) {
          const recomedPlan = insuranceProvider;
          const sumInsuredKey = `Flashaid Price ${selectedCoverage1}`;
          const gstKey = `GST ${selectedCoverage1}`;
          const finalPriceKey = `Final Price ${selectedCoverage1}`;

          const sumInsuredPrice = matchedPlan[sumInsuredKey];
          const gstPrice = matchedPlan[gstKey];
          const finalPrice = matchedPlan[finalPriceKey];

          setFinalPrice1({
            recomedPlan,
            sumInsuredPrice,
            gstPrice,
            finalPrice
          });
          setNoDataFound1(false);
        } else {
          setFinalPrice1(null);
          setNoDataFound1(true);
        }
      }
    } else {
      setFinalPrice1(null);
      setNoDataFound1(true);
    }
  };

  const handleSubmit2 = () => {
    // Check if selected insurance is Raheja
    if (selectedInsurance2.includes('Raheja')) {
      const matchedRahejaPlan = rahejaData.find(plan =>
        plan['Age'] === selectedAge2 &&
        plan['Maternity'] === selectedMaternity2
      );

      if (matchedRahejaPlan) {
        const recomedPlan = selectedInsurance2;
        const sumInsuredKey = `Flashaid Price ${selectedCoverage2}`;
        const gstKey = `GST ${selectedCoverage2}`;
        const finalPriceKey = `Final Price ${selectedCoverage2}`;

        const sumInsuredPrice = matchedRahejaPlan[sumInsuredKey];
        const gstPrice = matchedRahejaPlan[gstKey];
        const finalPrice = matchedRahejaPlan[finalPriceKey];

        setFinalPrice2({
          recomedPlan,
          sumInsuredPrice,
          gstPrice,
          finalPrice
        });
        setNoDataFound2(false);
      } else {
        setFinalPrice2(null);
        setNoDataFound2(true);
      }
    } else {
      const matchedPlan = planData.find(plan =>
        plan['Plan Type'] === `${selectedInsurance2} (${selectedFrequency2})` &&
        plan['Age'] === selectedAge2 &&
        plan['Plan'] === selectedPlan2
      );

      if (matchedPlan) {
        const recomedPlan = selectedInsurance2;
        const sumInsuredKey = `Flashaid Price ${selectedCoverage2}`;
        const gstKey = `GST ${selectedCoverage2}`;
        const finalPriceKey = `Final Price ${selectedCoverage2}`;

        const sumInsuredPrice = matchedPlan[sumInsuredKey];
        const gstPrice = matchedPlan[gstKey];
        const finalPrice = matchedPlan[finalPriceKey];

        setFinalPrice2({
          recomedPlan,
          sumInsuredPrice,
          gstPrice,
          finalPrice
        });
        setNoDataFound2(false);
      } else {
        setFinalPrice2(null);
        setNoDataFound2(true);
      }
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
               Number of Lives Based Input
              </Typography>
              <form>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Number of Lives</InputLabel>
                  <Select
                    value={selectedLives1}
                    onChange={(e) => setSelectedLives1(e.target.value)}
                  >
                    {lives.map(life => (
                      <MenuItem key={life} value={life}>{life}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Waiting Period</InputLabel>
                  <Select
                    value={selectedWaitingPeriod1}
                    onChange={(e) => setSelectedWaitingPeriod1(e.target.value)}
                  >
                    {waitingPeriods.map(period => (
                      <MenuItem key={period} value={period}>{period}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Premium Payment Frequency</InputLabel>
                  <Select
                    value={selectedFrequency1}
                    onChange={(e) => setSelectedFrequency1(e.target.value)}
                  >
                    {frequencies.map(frequency => (
                      <MenuItem key={frequency} value={frequency}>{frequency}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Maternity Cover</InputLabel>
                  <Select
                    value={selectedMaternity1}
                    onChange={(e) => setSelectedMaternity1(e.target.value)}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Average Age of Lives Covered</InputLabel>
                  <Select
                    value={selectedAge1}
                    onChange={(e) => setSelectedAge1(e.target.value)}
                  >
                    {ages.map(age => (
                      <MenuItem key={age} value={age}>{age}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Plan</InputLabel>
                  <Select
                    value={selectedPlan1}
                    onChange={(e) => setSelectedPlan1(e.target.value)}
                  >
                    {plans.map(plan => (
                      <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Coverage</InputLabel>
                  <Select
                    value={selectedCoverage1}
                    onChange={(e) => setSelectedCoverage1(e.target.value)}
                  >
                    {coverages.map(coverage => (
                      <MenuItem key={coverage} value={coverage}>{coverage}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleSubmit1}>Submit</Button>
              </form>
              {finalPrice1 && (
                <div>
                  <Divider style={{ margin: '20px 0' }} />
                  <Typography variant="h6">Recommended Plan: {finalPrice1.recomedPlan}</Typography>
                  <Typography>Flashaid Price: {finalPrice1.sumInsuredPrice}</Typography>
                  <Typography>GST: {finalPrice1.gstPrice}</Typography>
                  <Typography>Final Price: {finalPrice1.finalPrice}</Typography>
                </div>
              )}
              {noDataFound1 && (
                <Typography variant="h6" color="error">No data found</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Insurance Based Input
              </Typography>
              <form>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Insurance</InputLabel>
                  <Select
                    value={selectedInsurance2}
                    onChange={(e) => setSelectedInsurance2(e.target.value)}
                  >
                    {insuranceVal.map(insurance => (
                      <MenuItem key={insurance} value={insurance}>{insurance}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Average Age of Lives Covered</InputLabel>
                  <Select
                    value={selectedAge2}
                    onChange={(e) => setSelectedAge2(e.target.value)}
                  >
                    {ages.map(age => (
                      <MenuItem key={age} value={age}>{age}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Plan</InputLabel>
                  <Select
                    value={selectedPlan2} 
                    onChange={(e) => setSelectedPlan2(e.target.value)}
                  >
                    {plans.map(plan => (
                      <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Coverage</InputLabel>
                  <Select
                    value={selectedCoverage2}
                    onChange={(e) => setSelectedCoverage2(e.target.value)}
                  >
                    {coverages.map(coverage => (
                      <MenuItem key={coverage} value={coverage}>{coverage}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Premium Payment Frequency</InputLabel>
                  <Select
                    value={selectedFrequency2}
                    onChange={(e) => setSelectedFrequency2(e.target.value)}
                  >
                    {frequencies.map(frequency => (
                      <MenuItem key={frequency} value={frequency}>{frequency}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Maternity Cover</InputLabel>
                  <Select
                    value={selectedMaternity2}
                    onChange={(e) => setSelectedMaternity2(e.target.value)}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleSubmit2}>Submit</Button>
              </form>
              {loading && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <CircularProgress />
                </div>
              )}
              {finalPrice2 && !loading && (
                <div>
                  <Divider style={{ margin: '20px 0' }} />
                  <Typography variant="h6">Recommended Plan: {finalPrice2.recomedPlan}</Typography>
                  <Typography>Flashaid Price: {finalPrice2.sumInsuredPrice}</Typography>
                  <Typography>GST: {finalPrice2.gstPrice}</Typography>
                  <Typography>Final Price: {finalPrice2.finalPrice}</Typography>
                </div>
              )}
              {noDataFound2 && (
                <Typography variant="h6" color="error">No data found</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Calc;
