import React, { useState, useEffect } from 'react';
import { collection, getDocs, query , where } from 'firebase/firestore';
import { firestore } from '../config/firebase';
 import Select from 'react-select';
import { Chart } from "react-google-charts";
import '../css/admin.css';
const Dashboard = () => {
  // Dummy data for the dashboard
  const [totalVotersRegistered, setTotalVotersRegistered] = useState(0);
  const [totalVotesCasted, setTotalVotesCasted] = useState(0);
  const [totalPartiesRegistered, setTotalPartiesRegistered] = useState(0);
  const [totalCandidatesRegistered, setTotalCandidatesRegistered] = useState(0);
  const [constituencies,setConstituencies]=useState([]);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [pvoters,setVotersp]=useState(0);
  const [cvoters,setVotersc]=useState(0);
  const [voted,setVoted]=useState(0);
  const [voters,setVoters]=useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const votersCollection = collection(firestore, 'Voters');
        const partyvotesCollection = collection(firestore, 'VotesParty');
        const candvotesCollection=collection(firestore,'VotesCandidate');
        const partiesCollection = collection(firestore, 'party');
        const candidatesCollection = collection(firestore, 'candidates');
        const constituenciesCollection = collection(firestore, 'constituency');

        const votersSnapshot = await getDocs(votersCollection);
        const partyvotesSnapshot = await getDocs(partyvotesCollection);
        const candvotersSnapshot= await getDocs(candvotesCollection);
        const partiesSnapshot = await getDocs(partiesCollection);
        const candidatesSnapshot = await getDocs(candidatesCollection);
        const constituenciesSnapshot = await getDocs(constituenciesCollection);

        setTotalVotersRegistered(votersSnapshot.size);
        setVotersp(partyvotesSnapshot.size);
        setVotersc(candvotersSnapshot.size);
        setTotalPartiesRegistered(partiesSnapshot.size);
        setTotalCandidatesRegistered(candidatesSnapshot.size);
        const constituenciesData = constituenciesSnapshot.docs.map((doc) => doc.data().name);
        const constituencyOptions = constituenciesData.map((constituency) => ({
          label: constituency,
          value: constituency,
        }));
        setConstituencies(constituencyOptions);
       
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleConstituencyChange = async (selectedOption) => {
    
    try {
      const votersCollectionRef = collection(firestore, 'Voters');
    const numberOfVoters = query(votersCollectionRef, where('constituency', '==', selectedOption.value));
    const votersSnapshot = await getDocs(numberOfVoters);
    const numberVoted=query(
      votersCollectionRef,
      where('constituency', '==', selectedOption.value),
      where('hasVoted', '==', true)
    );
    const votedSnapshot= await getDocs(numberVoted);

    // Get the number of voters in the constituency
    const votersCount = votersSnapshot.size;
    const votedCount = votedSnapshot.size;
    setVoted(votedCount);
    setVoters(votersCount);
    
    }
    catch(error){}
    // Add any additional logic you need when the constituency changes
  };
   const chartData = [
    ["Votes", "voted"],
    ["Not Voted", voters-voted],
    ["voted", voted],
  ];
  return (
    <div>
      <div className="stats-section box">
        <h2>Current Statistics</h2>
        <div className="box-container">
          <div className="box">
            <h3>Total Voters Registered</h3>
            <p>{totalVotersRegistered}</p>
          </div>
          <div className="box">
            <h3>Total Votes Casted</h3>
            <p>{pvoters+cvoters}</p>
          </div>
        </div>
        <div className="box-container">
          <div className="box">
            <h3>Total Parties Registered</h3>
            <p>{totalPartiesRegistered}</p>
          </div>
          <div className="box">
            <h3>Total Candidates Registered</h3>
            <p>{totalCandidatesRegistered}</p>
          </div>
        </div>
      </div>
      <div className="form-section box">
        <h2>Chart Section</h2>
        <div className="chart-container box">
        <Select
        value={selectedConstituency}
        onChange={handleConstituencyChange}
        options={constituencies}
        isSearchable
        placeholder="Select Constituency"
      />
          <Chart
      chartType="PieChart"
      data={chartData}
    
      width={"100%"}
      height={"400px"}
    />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
