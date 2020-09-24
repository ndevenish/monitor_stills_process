import React from "react";
import example_processes from "./data";

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

const Filter = ({ filter, onFilter }) => {
    const setFilter = (item) => onFilter(item.target.value);
    const clearFilter = () => onFilter("");

    return (
        <>
            <label htmlFor="filter">Filter: </label>
            <input
                id="filter"
                type="text"
                onChange={setFilter}
                value={filter}
            />
            <button type="button" onClick={clearFilter}>
                x
            </button>
        </>
    );
};

// React state variable persisted in localStorage
const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );
    React.useEffect(() => localStorage.setItem(key, value), [value, key]);

    return [value, setValue];
};

const getAsyncProcesses = () =>
    new Promise((resolve) =>
        setTimeout(
            () => resolve({ data: { processes: example_processes } }),
            2000
        )
    );

const App = () => {
    const [filterTerm, setFilterTerm] = useSemiPersistentState("filter", "");
    const [processList, setProcesssList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const filteredProcesses = processList.filter((item) =>
        item.name.includes(filterTerm.toLowerCase())
    );
    React.useEffect(() => {
        setIsLoading(true);
        getAsyncProcesses().then((result) => {
            setProcesssList(result.data.processes);
            setIsLoading(false);
        });
    }, []);
    return (
        <div>
            <h1>Processing Results</h1>
            <Filter onFilter={setFilterTerm} filter={filterTerm} />
            {isLoading && <span> Loading...</span>}
            <Table processes={filteredProcesses} />
        </div>
    );
};

export default App;
