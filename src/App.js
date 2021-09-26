import React, {useEffect, useState} from "react";
import './App.css';
import axios from "axios";

type Location = any;

const fetchData = () => {
  return axios.get("https://randomuser.me/api/?results=20")
  .then((res) => {
    const {results} = res.data
    return results;
  })
  .catch((err) => {
    console.log(err)
  })
}

const flattenLocations = (locations: Location[]) => {
  const data = []
  for (const {street, coordinates, timezone, ...rest} of locations)
  data.push({
    ...rest,
    number: street.number,
    name: street.name,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  })

  const flattenedLocationHeaders = extractObjectKeys(data[0]);
  
  console.log(flattenedLocationHeaders)
  return {headers: flattenedLocationHeaders, data}
  
}

const extractObjectKeys = (object: any) => {
  let objectKeys: string[] = [];

  Object.keys(object).forEach(objectKey => {
    const value = object[objectKey];
    if (typeof value !== 'object') {
      objectKeys.push(objectKey);
    }else {
      objectKeys = [...objectKeys, ...extractObjectKeys(value)];
    }
  })
  return objectKeys 
}

function App() {

  const [flattenedLocations, setFlattenedLocations] = useState({headers: [], data: []});

  const sortColumn = (sortKey) => {
    console.log(sortKey);
    const newFlattenedLocations = {
      ...flattenedLocations,
      data: [...flattenedLocations.data]
    };
    newFlattenedLocations.data.sort((a, b) => {
      const relevantValueA = a[sortKey];
      const relevantValueB = b[sortKey];

      if (relevantValueA < relevantValueB) return -1;
      if (relevantValueA > relevantValueB) return 1;
      return 0;
    });

    setFlattenedLocations(newFlattenedLocations)
  };

  useEffect(() => {
    fetchData().then((apiLocations) => {
      setFlattenedLocations(flattenLocations(apiLocations.map(({ location }) => location)));
    });
  }, []);

  return (
    <div className="App">
      <h1>Hola Manu!!</h1>
      <h2>Start editing to see the magic happen</h2>
      <table>
        <thead>
          <tr>
          {flattenedLocations.headers.map((locationString: string, locationId) => (
        <th key={locationId}
            onClick={() => {
                sortColumn(locationString)
            }}>
              {locationString}
              </th>
      ))}
          </tr>
        </thead>
        <tbody>
        {flattenedLocations.data.map((location: any, locationId) => (
        <tr key={locationId}>
          {flattenedLocations.headers.map((header, headerId) => (
          <td key={headerId}>{location[header]}</td>))}
          </tr>
      ))}
        </tbody>
      </table>
      
    </div>
  );
}

export default App;
