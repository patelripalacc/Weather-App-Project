const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("#weatherIcon"),
  arrowBack = wrapper.querySelector("header i");
const apiKey = "4c9baf4cd0a8582fbe7e9e660e0de163";
//add eventListener to enter city name
inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});
//add eventListener to on click to check current location of user
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");
  }
});
//function to request api by city name
function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  fetchData();
}
//function to request api if user geolocation is onSuccess
function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
  fetchData();
}
//function to get error if user geolocation get onError
function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}
//requesting to fetch weatherData api
function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((res) => res.json())
    .then((result) => weatherDetails(result))
    .catch(() => {
      infoTxt.innerText = "Something went wrong";
      infoTxt.classList.replace("pending", "error");
    });
}
//display all weather data on DOm
function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, icon, main } = info.weather[0];
    const { temp, feels_like, temp_min, temp_max, humidity } = info.main;
    const { speed } = info.wind;

    wIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    weatherPart.querySelector(".hi").innerText = Math.floor(temp_max);
    weatherPart.querySelector(".lo").innerText = Math.floor(temp_min);
    weatherPart.querySelector(".wind").innerText = `Wind: ${speed} mph`;
    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description.toUpperCase();
    weatherPart.querySelector(
      ".location span"
    ).innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText =
      Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");

    //fetching giphy api to get image on user city weather description.
    fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=GvZ2K72ZzIrIZ0bWQk6QyGftYOPKVYCB&s=${description}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const giphyImg = document.getElementById("icon");
        giphyImg.src = data.data.images.original.url;
      })
      .catch((err) => {
        console.err(err);
      });
  }
}
//eventListener to get back to input part.
arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
