import React from "react";
import "./app.scss";

const API_ENDPOINT = "http://ws358.diamond.ac.uk:5000/api";

const processPercent = (a, b) => ((100 * a) / b).toFixed(0);

const NestedNameField = ({ value, onFilter }) => {
    const parts = value.split("/").reverse();
    const clickPart = (i, event) => {
        onFilter(parts.slice(i).reverse().join("/") + "/");
    };
    if (parts.length == 1) {
        return (
            <div className="pathContainer">
                <span>{value}</span>
            </div>
        );
    }
    return (
        <div className="pathContainer">
            <div className="pathSelector">
                {parts.slice(1).map((x, i) => (
                    <span key={i} onClick={clickPart.bind(null, i + 1)}>
                        {x}/
                    </span>
                ))}
            </div>
            <span>{parts[0]}</span>
        </div>
    );
};

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
                        <th colSpan="2">Indexed</th>
                        <th colSpan="2">Integrated</th>
                    </tr>
                </thead>
                <tbody>
                    {props.processes.map((item) => {
                        processed += item.processed;
                        indexed += item.indexed;
                        integrated += item.integrated;
                        return (
                            <Process
                                key={item.name}
                                item={item}
                                onFilter={props.onFilter}
                            />
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <th align="left">Totals:</th>
                        <th align="right">{processed.toLocaleString()}</th>
                        <th align="right">{indexed.toLocaleString()}</th>
                        <th align="left" className="percent">
                            {processPercent(indexed, processed)}%
                        </th>

                        <th align="right">{integrated.toLocaleString()}</th>
                        <th align="left" className="percent">
                            {processPercent(integrated, processed)}%
                        </th>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};
const Process = ({
    item: { name, processed, indexed, integrated },
    onFilter,
}) => (
    <tr>
        <td>
            <NestedNameField value={name} onFilter={onFilter} />
        </td>
        <td align="right">{processed}</td>
        <td align="right">{indexed}</td>
        <td align="left" className="percent">
            {processPercent(indexed, processed)}%
        </td>
        <td align="right">{integrated}</td>
        <td align="left" className="percent">
            {processPercent(integrated, processed)}%
        </td>
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

const processesReducer = (state, action) => {
    switch (action.type) {
        case "SET_PROCESSES":
            return action.payload;
        case "FETCH_INIT":
            return {
                ...state,
                isLoading: true,
                isError: state.isError,
            };
        case "FETCH_SUCCESS":
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case "FETCH_FAILURE":
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        default:
            throw new Error();
    }
};

const App = () => {
    const [filterTerm, setFilterTerm] = useSemiPersistentState("filter", "");

    const [processes, dispatchProcesses] = React.useReducer(processesReducer, {
        data: [],
        isLoading: false,
        isError: false,
    });
    const filteredProcesses = processes.data.filter((item) => {
        return item.name.toLowerCase().includes(filterTerm.toLowerCase());
    });

    const fetchData = async () => {
        dispatchProcesses({ type: "FETCH_INIT" });
        try {
            const result = await fetch(API_ENDPOINT);
            dispatchProcesses({
                type: "FETCH_SUCCESS",
                payload: await result.json(),
            });
        } catch (error) {
            dispatchProcesses({ type: "FETCH_FAILURE" });
            throw error;
        }
    };

    React.useEffect(() => {
        fetchData();
        setInterval(fetchData, 2000);
    }, []);
    return (
        <div>
            <h1>Processing Results</h1>
            <Filter onFilter={setFilterTerm} filter={filterTerm} />
            {/* {processes.isLoading && <span> Loading...</span>} */}
            {processes.isError && <p>Error: Error fetching new data</p>}
            <Table processes={filteredProcesses} onFilter={setFilterTerm} />
        </div>
    );
};

export default App;
