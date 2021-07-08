import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from './util';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Select a Country");
  const [countryInfo, setCountryInfo] = useState({});
  // to store country info of selected country
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/all")
        .then(response => response.json())
        .then(data => {
          setCountryInfo(data);
        })
    }
    fetchData();
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));

          const sortedData = sortData(data);
          setMapCountries(data);
          setCountries(countries);
          setTableData(sortedData);
        })
    };

    getCountriesData();

  }, []);
  //runs once mounted

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'Select a Country'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (data.countryInfo !== undefined) {
          setMapZoom(4.5);
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        }
      })
  }


  return (
    <div className="App">

      <Card className="app__right">
        <CardContent>
          {/*Table (each country) */}
          <h3 style={{ color: 'white', fontWeight: '500', fontSize: '25px' }}>Live cases by Country</h3>
          <Table countries={tableData} />

          {/*Graph */}
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>

      <div className="app__left">
        {/*header*/}
        <div className="app__header">
          <div style={{ display: 'flex' }}>
            <h1 style={{ color: '#AADAFF', marginRight: '10px', fontWeight: '500', fontSize: '40px' }}>Track Coronavirus Cases</h1>
            <img src="https://img.icons8.com/bubbles/50/000000/protection-mask.png" alt="" />
          </div>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} style={{ color: 'white', border: '1px solid white' }} value={country}>
              <MenuItem value="Select a Country">Select a Country</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/*Title + Select input dropdown field */}
        </div>


        {/*InfoBox*/}
        {/*InfoBox*/}
        {/*InfoBox*/}

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            title="Confirmed Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)} />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            title="Recovered Patients"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)} />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)} />
        </div>

        {/*Map */}
        <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom} />
      </div>


    </div>
  );
}

export default App;
