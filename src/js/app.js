import React from "react";

const data = [
  {
    name: "ipns/brahmin",
    processed: 25600,
    indexed: 1000,
    integrated: 2000,
  },
  {
    name: "ipns/cow",
    processed: 1000,
    indexed: 1337,
    integrated: 1337,
  },
];

const Table = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Processed</th>
          <th>Indexed</th>
          <th>Integrated</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.name}>
            <td>{item.name}</td>
            <td>{item.processed}</td>
            <td>{item.indexed}</td>
            <td>{item.integrated}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function App() {
  return (
    <div>
      <h1>Processing Results</h1>
      <Table />
    </div>
  );
}

export default App;
