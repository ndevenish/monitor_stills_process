import React from "react";
import data from "./data";

const Table = (props) => {
    let processed = 0,
        indexed = 0,
        integrated = 0;
    return (
        <div>
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
                    {props.processes.map((item) => {
                        processed += item.processed;
                        indexed += item.indexed;
                        integrated += item.integrated;
                        return (
                            <tr key={item.name}>
                                <td>{item.name}</td>
                                <td align="right">{item.processed}</td>
                                <td align="right">{item.indexed}</td>
                                <td align="right">{item.integrated}</td>
                            </tr>
                        );
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

const Filter = (props) => (
    <div>
        <label htmlFor="filter">Filter: </label>
        <input id="filter" type="text" onChange={props.onFilter} />
    </div>
);
const App = () => {
    const [filterTerm, setFilterTerm] = React.useState("");

    const handleFilter = (event) => {
        setFilterTerm(event.target.value);
    };
    const filteredProcesses = data.filter((item) =>
        item.name.includes(filterTerm.toLowerCase())
    );

    return (
        <div>
            <h1>Processing Results</h1>
            <Filter onFilter={handleFilter} />
            <Table processes={filteredProcesses} />
        </div>
    );
};

export default App;
