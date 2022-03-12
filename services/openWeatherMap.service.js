const axios = require("axios");

const apiUrl = `https://api.openweathermap.org/data/2.5/onecall`;
const defaultValues = {
  value: 15,
};

const getCachedValue = (cache, lat, lon) => {
  if (cache) {
    const cachedValue = cache.get(`${lat}${lon}`);
    return cachedValue;
  }
  return null;
};

const registerCachedValue = (cache, lat, lon, value) => {
  if (cache) {
    cache.set(`${lat}${lon}`, value);
  }
};

const compare = (mode, value, data) => {
  if (!mode || mode === "greater") {
    return parseFloat(data) > parseFloat(value || defaultValues.value);
  } else {
    return parseFloat(data) < parseFloat(value || defaultValues.value);
  }
};

const isGreater = async (query, cache) => {
  const { value, mode } = query;

  if (mode && mode !== "greater" && mode !== "lower") {
    throw new Error(
      'Unknown value for mode parameter. Parameter mode only accepts values "lower" and "greater" using "greater" as default'
    );
  }

  let { lat, lon } = query;

  if (!lat) {
    lat = process.env.DEFAULT_LAT;
  }

  if (!lon) {
    lon = process.env.DEFAULT_LON;
  }

  const cachedValue = getCachedValue(cache, lat, lon);

  if (cachedValue) {
    return compare(mode, value, cachedValue);
  }

  let queryString = "?";
  queryString = `${queryString}lat=${lat}&`;
  queryString = `${queryString}lon=${lon}&`;
  queryString = `${queryString}units=metric&`;
  queryString = `${queryString}appid=${process.env.OPEN_WHEATHER_MAP_API_KEY}`;

  let result;
  try {
    result = await axios.get(`${apiUrl}${queryString}`);
  } catch (err) {
    throw new Error("Error getting data from wheather service");
  }

  if (!result?.data?.current?.temp) {
    throw new Error(
      "An error occured getting wheather data, plase try again later"
    );
  }

  registerCachedValue(cache, lat, lon, result.data.current.temp);
  return compare(mode, value, result.data.current.temp);
};

module.exports = { isGreater };
