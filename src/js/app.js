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

const Filter = () => {
    const [filterTerm, setFilterTerm] = React.useState("");

    const handleChange = (event) => {
        console.log(event.target.value);
        setFilterTerm(event.target.value);
    };
    return (
        <div>
            <label htmlFor="filter">Filter: </label>
            <input id="filter" type="text" onChange={handleChange} />
            {filterTerm.length > 0 && <p>Filtered for {filterTerm}</p>}
        </div>
    );
};
const App = () => {
    return (
        <div>
            <h1>Processing Results</h1>
            <Filter />
            <Table processes={data} filter="{filterterm}" />
        </div>
    );
};

export default App;
