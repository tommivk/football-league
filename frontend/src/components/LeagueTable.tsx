interface Props {
  leagueData: {
    name: string;
    goals: string;
    id: number;
  }[];
}

const LeagueTable: React.FC<Props> = ({ leagueData }) => {
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th>Team</th>
            <th>Goals</th>
          </tr>
          {leagueData.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.goals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueTable;
