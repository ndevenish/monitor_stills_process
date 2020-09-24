import React from "react";

const API_ENDPOINT = "http://localhost:5000/api";

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

const processesReducer = (state, action) => {
    switch (action.type) {
        case "SET_PROCESSES":
            return action.payload;
        case "FETCH_INIT":
            return {
                ...state,
                isLoading: true,
                isError: false,
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
    const filteredProcesses = processes.data.filter((item) =>
        item.name.includes(filterTerm.toLowerCase())
    );

    const fetchData = () => {
        dispatchProcesses({ type: "FETCH_INIT" });
        fetch(API_ENDPOINT)
            .then((response) => response.json())
            .then((result) => {
                dispatchProcesses({
                    type: "FETCH_SUCCESS",
                    payload: result,
                });
            })
            .catch((error) => {
                dispatchProcesses({ type: "FETCH_FAILURE" });
                throw error;
            });
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
            <Table processes={filteredProcesses} />
        </div>
    );
};

export default App;
