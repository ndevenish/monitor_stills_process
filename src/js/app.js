import React from "react";
import data from "./data";

const Table = (props) => {
    // Track the totals
    let processed = 0,
        indexed = 0,
        integrated = 0;

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th align="left">Name</th>
                        <th>Processed</th>
                        <th>Indexed</th>
                        <th>Integrated</th>
                    </tr>
                </thead>
                <tbody>
                    {props.processes.map((item) => {
                        processed += item.processed;
                        indexed += item.indexed;
                        integrated += item.integrated;
                        return <Process key={item.name} item={item} />;
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <th align="left">Totals:</th>
                        <th align="right">{processed}</th>
                        <th align="right">{indexed}</th>
                        <th align="right">{integrated}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};
const Process = ({ item }) => (
    <tr>
        <td>{item.name}</td>
        <td align="right">{item.processed}</td>
        <td align="right">{item.indexed}</td>
        <td align="right">{item.integrated}</td>
    </tr>
);

const Filter = ({ filter, onFilter }) => (
    <div>
        <label htmlFor="filter">Filter: </label>
        <input id="filter" type="text" onChange={onFilter} value={filter} />
    </div>
);

// React state variable persisted in localStorage
const useSemiPersistentState = (key) => {
    const [value, setValue] = React.useState(localStorage.getItem(key) || "");
    React.useEffect(() => localStorage.setItem(key, value), [value, key]);

    return [value, setValue];
};

const App = () => {
    const [filterTerm, setFilterTerm] = useSemiPersistentState("filter");
    const handleFilter = (event) => {
        setFilterTerm(event.target.value);
    };
    const filteredProcesses = data.filter((item) =>
        item.name.includes(filterTerm.toLowerCase())
    );

    return (
        <div>
            <h1>Processing Results</h1>
            <Filter onFilter={handleFilter} filter={filterTerm} />
            <Table processes={filteredProcesses} />
        </div>
    );
};

export default App;
