import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../config/firebase';
 import Select from 'react-select';
 import { Chart } from "react-google-charts";

const Results=()=>{
  const [constituency,setConstituencies]=useState({});
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const nameCountMap = new Map();
  const candMap=new Map();
  const [partychartData,setPartyChartData]= useState({});
  const [candchartData,setCandchartData]=useState({});

  useEffect(()=>{
    const fetchData =async()=>{
      try{
        const constituenciesCollection = collection(firestore, 'constituency');

        const constituenciesSnapshot = await getDocs(constituenciesCollection);
        const constituenciesData = constituenciesSnapshot.docs.map((doc) => doc.data().name);
        const constituencyOptions = constituenciesData.map((constituency) => ({
          label: constituency,
          value: constituency,
        }));
        setConstituencies(constituencyOptions);
      }
      catch(e){

      }
    };fetchData();
  },[])
  const handleConstituencyChange = async (selectedOption) => {
    try {
      nameCountMap.clear();
      candMap.clear();
     const partyvotesCollectionRef=collection(firestore,'VotesParty');
     const VoteNumbers=query(partyvotesCollectionRef,where('constituency','==',selectedOption.value))
     const votes= await getDocs(VoteNumbers);
     votes.forEach((doc) => {
      
      const {name} =doc.data().votes[0];
      if(nameCountMap.has(name)){
        nameCountMap.set(name,nameCountMap.get(name)+1);
      }
      else
      {
        nameCountMap.set(name,1);
      }
      
    });
      const candCollectionRef=collection(firestore,'VotesCandidate');
      const vno=query(candCollectionRef,where('constituency','==',selectedOption.value))
      const canvotes=await getDocs(vno);
      canvotes.forEach((doc)=>{
          const {name}=doc.data().votes[0];
          if(candMap.has(name)){
            candMap.set(name,candMap.get(name)+1);
          }
          else
          {
            candMap.set(name,1);
          }
      }
      );
    setCandchartData([['Name', 'Vote Count'], ...Array.from(candMap.entries())]);
    setPartyChartData([['Name', 'Vote Count'], ...Array.from(nameCountMap.entries())]);
   
  } 

    
    catch(error){}
    // Add any additional logic you need when the constituency changes
  };
  
  return(
    <div>
    <label htmlFor="constituencyDropdown">Select Constituency:</label>
      <Select
        id="constituencyDropdown"
        value={selectedConstituency}
        onChange={handleConstituencyChange}
        options={constituency}
        isSearchable
        placeholder={selectedConstituency ? selectedConstituency.value : "Select Constituency"}
      />
    <div>Results</div>
    <div> Party Votes</div>
    {partychartData?(<div>
        <Chart
          width={'500px'}
          height={'300px'}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={partychartData}
          options={{
            title: 'Party Votes',
            chartArea: { width: '50%' },
            hAxis: { title: 'Vote Count', minValue: 0 },
            vAxis: { title: 'Name' },
          }}
        />
      </div>):(null)}
    <div> Candidate Votes</div>
    {candchartData?(<Chart
      width={'500px'}
      height={'300px'}
      chartType="BarChart"
      loader={<div>Loading Chart</div>}
      data={candchartData}
      options={{
        title: 'Candidat Votes',
        chartArea: { width: '50%' },
        hAxis: { title: 'Vote Count', minValue: 0 },
        vAxis: { title: 'Name' },
      }}
    />):(null)
    }
    </div>
    
  );
};
export default Results;