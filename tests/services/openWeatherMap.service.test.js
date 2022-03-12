let service;
const mockGet = jest.fn();
const apiUrl = "https://api.openweathermap.org/data/2.5/onecall";
beforeAll(() => {
  jest.mock("axios", () => ({
    get: mockGet,
  }));
});

describe("GreaterLower than tests", () => {
  beforeAll(() => {
    service = require("../../services/openWeatherMap.service");
  });

  /* SET UP NEEDED ENV DATA */
  process.env.OPEN_WHEATHER_MAP_API_KEY = "apikey";
  process.env.DEFAULT_LON = 11.11;
  process.env.DEFAULT_LAT = 22.22;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error when mode is defined but does not match allowed values", async () => {
    await expect(service.isGreater({ mode: "unknown" })).rejects.toThrow(
      new Error(
        'Unknown value for mode parameter. Parameter mode only accepts values "lower" and "greater" using "greater" as default'
      )
    );
  });

  it("should throw an error when current temp is not provided by the service", async () => {
    mockGet.mockImplementation(() => ({ data: { anotherData: [] } }));

    await expect(service.isGreater({})).rejects.toThrow(
      new Error("An error occured getting wheather data, plase try again later")
    );
  });

  it("should perform the call when is called without query parameters using default values returning is greater than default 15 value", async () => {
    mockGet.mockImplementation(() => ({ data: { current: { temp: 16 } } }));
    expect(await service.isGreater({})).toBe(true);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(
      `${apiUrl}?lat=${process.env.DEFAULT_LAT}&lon=${process.env.DEFAULT_LON}&units=metric&appid=${process.env.OPEN_WHEATHER_MAP_API_KEY}`
    );
  });

  it("should perform the call when is called without query parameters using default values returning is lower than default 15 value", async () => {
    mockGet.mockImplementation(() => ({ data: { current: { temp: 1 } } }));
    expect(await service.isGreater({})).toBe(false);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(
      `${apiUrl}?lat=${process.env.DEFAULT_LAT}&lon=${process.env.DEFAULT_LON}&units=metric&appid=${process.env.OPEN_WHEATHER_MAP_API_KEY}`
    );
  });

  it("should perform the call when is called without query parameters using default values returning is lower when temps are equal", async () => {
    mockGet.mockImplementation(() => ({ data: { current: { temp: 15 } } }));
    expect(await service.isGreater({})).toBe(false);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(
      `${apiUrl}?lat=${process.env.DEFAULT_LAT}&lon=${process.env.DEFAULT_LON}&units=metric&appid=${process.env.OPEN_WHEATHER_MAP_API_KEY}`
    );
  });

  it("should perform the call using lat and lon provided by query returning is greater than default 15 value", async () => {
    mockGet.mockImplementation(() => ({ data: { current: { temp: 16 } } }));
    expect(await service.isGreater({ lat: '-55.24', lon: '-24.22' })).toBe(true);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(
      `${apiUrl}?lat=-55.24&lon=-24.22&units=metric&appid=${process.env.OPEN_WHEATHER_MAP_API_KEY}`
    );
  });

  it("should perform the call using lat and lon provided by query returning is lower than default 15 value", async () => {
    mockGet.mockImplementation(() => ({ data: { current: { temp: 1 } } }));
    expect(await service.isGreater({ lat: '-55.24', lon: '-24.22' })).toBe(false);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(
      `${apiUrl}?lat=-55.24&lon=-24.22&units=metric&appid=${process.env.OPEN_WHEATHER_MAP_API_KEY}`
    );
  });

  it("should perform the call using lat, lon and mode", async () => {
    mockGet.mockImplementation(() => ({ data: { current: { temp: 35 } } }));
    expect(await service.isGreater({ lat: '-55.24', lon: '-24.22', mode: 'lower' })).toBe(false);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(
      `${apiUrl}?lat=-55.24&lon=-24.22&units=metric&appid=${process.env.OPEN_WHEATHER_MAP_API_KEY}`
    );
  });

  it("should perform the call using lat, lon, mode and value to check", async () => {
    mockGet.mockImplementation(() => ({ data: { current: { temp: 35 } } }));
    expect(await service.isGreater({ lat: '-55.24', lon: '-24.22', mode: 'greater', value: 20 })).toBe(true);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(
      `${apiUrl}?lat=-55.24&lon=-24.22&units=metric&appid=${process.env.OPEN_WHEATHER_MAP_API_KEY}`
    );
  });
});
