import axios from "axios";
import { useEffect, useState } from "react";
import Filter from "./components/Filter";

function App() {
  useEffect(() => {
    axios
      .get(
        "https://restcountries.com/v3.1/all?fields=name,capital,languages,altSpellings,area,flags,latlng"
      )
      .then((response) => {
        console.log("got resp from restcountries");
        setCountries(response.data);
      });
  }, []);

  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");

  const handleQueryChange = (event) => setQuery(event.target.value);
  const handleShowButton = (country) => setQuery(country);

  return (
    <div>
      find countries <input value={query} onChange={handleQueryChange} />
      <Filter
        countries={countries}
        query={query}
        handleShowButton={handleShowButton}
      />
    </div>
  );
}

export default App;
