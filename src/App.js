import * as React from "react";
import './App.css';


const getUserAsync = () => {
  return fetch("https://randomuser.me/api/?results=20",{
    method: "GET"
  }).then((res) => res.json())
};

const useGetUsers = () => {
  const [response, setResponse] = React.useState();
  React.useEffect(() => {
    let isLoaded = true;
    getUserAsync().then((res) => {
      if (isLoaded) {
        setResponse(res.results)
      }
    });
    return () => {
      isLoaded = false;
    };
  }, []);
  return response;
};

const getFullName = (name) => {
  return `${name.title} ${name.first} ${name.last}`; 
};

const matchesKey = (item, filterKey) => {
  const attributes = [
    item.location.city,
    item.location.state,
    item.location.country,
    item.location.postcode,
    item.location.street.number,
    getFullName(item.name),
    item.location.coordinates.latitude,
    item.location.coordinates.longitude,
  ];
  return attributes.some((attr) =>
  String(attr).toLowerCase().includes(filterKey.toLowerCase())
  );
};

const sortByField = (a, b, sortField, sortDirection) => {
  let itemA, itemB;
  if(sortField === "city") {
    itemA = a.location.city;
    itemB = b.location.city;
  }else if(sortField === "state") {
    itemA = a.location.state;
    itemB = b.location.state;
  }else if(sortField === "country") {
    itemA = a.location.country;
    itemB = b.location.country;
  }else if(sortField === "postcode") {
    itemA = a.location.postcode;
    itemB = b.location.postcode;
  }else if(sortField === "number") {
    itemA = a.location.number;
    itemB = b.location.number;
  }else if(sortField === "name") {
    itemA = a.name.first + " " + a.name.last;
    itemB = b.name.first + " " + b.name.last;
  }else if(sortField === "latitude") {
    itemA = a.location.coordinates.latitude;
    itemB = b.location.coordinates.latitude;
  }else if(sortField === "longitude") {
    itemA = a.location.coordinates.longitude;
    itemB = b.location.coordinates.longitude;
  }else {
    return 1;
  }
  if (sortDirection ==="ASC") {
    return itemA < itemB ? -1 : 1;
  }else {
    return itemA > itemB ? 1 : -1;
  }
};

function App() {
  
  const results = useGetUsers();
  const [filterKey, setFilterKey] = React.useState("");
  const [sortField, setSortField] = React.useState();
  const [sortDirection, setSortDirection] = React.useState();

  const updateSort = (fieldName) => {
    if (fieldName !== sortField) {
      setSortField(fieldName); 
      setSortDirection("ASC") 
      }else {
        if (sortDirection === "ASC") {
          setSortDirection("DES");
        }else {
          setSortField();
      }
    }
  };

  return (
    <div className="App">
      <h1>Hola Manu!!</h1>
      <h2>Start editing to see the magic happen</h2>
      <input value={filterKey} onChange={(e) => setFilterKey(e.target.value)}/>
      <table>
        <thead>
          <tr>
            <th onClick={() => updateSort("city")}>City</th>
            <th onClick={() => updateSort("state")}>State</th>
            <th onClick={() => updateSort("country")}>Country</th>
            <th onClick={() => updateSort("postcode")}>Postcode</th>
            <th onClick={() => updateSort("number")}>Number</th>
            <th onClick={() => updateSort("name")}>Name</th>
            <th onClick={() => updateSort("latitude")}>Latitude</th>
            <th onClick={() => updateSort("longitude")}>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {results && 
          results
          .filter((item) => matchesKey(item, filterKey))
          .sort((a, b) => sortByField(a, b, sortField, sortDirection))
          .map((item) => (
            <tr key={item.login.uuid}>
              <td>{item.location.city}</td>
              <td>{item.location.state}</td>
              <td>{item.location.country}</td>
              <td>{item.location.postcode}</td>
              <td>{item.location.street.number}</td>
              <td>{getFullName(item.name)}</td>
              <td>{item.location.coordinates.latitude}</td>
              <td>{item.location.coordinates.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
