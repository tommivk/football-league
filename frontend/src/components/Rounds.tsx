import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Round  {
    finished: boolean,
    id: number,
    round: number,
}

const Rounds = () => {
    const [rounds, setRounds] = useState<Round[]>([]);
    const [fixtures, setFixtures] = useState<any[]>([]);
    const [selectedRound, setSelectedRound] = useState<number | null>(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/rounds').then((res) => setRounds(res.data));
    }, []);

    const handleRoundChange = async (round: number) => {
       const res = await axios.get(`http://localhost:8000/api/rounds/${round}/fixtures`);
       console.log(res.data);
       setSelectedRound(round);
       setFixtures(res.data);
    }
    return(
        <div>
            {rounds.map((r) => (
                <button onClick={() => handleRoundChange(r.id)}>{r.round}</button>
            ))}
            {selectedRound &&
            <div>
             <h1>{selectedRound}</h1>
                Fixtures:
                <ul> 
                {fixtures.map((fixture) => (
                    <li>
                        <div>
                         {fixture.home_team} - {fixture.away_team} {fixture.finished && "finished"}
                        </div>
                    </li>
                ))}
                </ul>
             </div>
            }
        </div>
    )
};

export default Rounds;