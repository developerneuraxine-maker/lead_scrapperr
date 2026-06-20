const axios = require("axios");

async function checkPost() {
  console.log("Sending POST request to live backend...");
  try {
    const res = await axios({
      method: "POST",
      url: "https://leadscrapperr-production.up.railway.app/api/search",
      headers: {
        "Origin": "https://leadscrapperr-two.vercel.app/",
        "Content-Type": "application/json"
      },
      data: {
        keyword: "restaurant",
        city: "Mumbai",
        forceRefresh: true
      }
    });
    console.log("POST request succeeded!");
    console.log("Status:", res.status);
    console.log("Headers:", JSON.stringify(res.headers, null, 2));
    console.log("Data size:", res.data?.results?.length, "leads");
  } catch (err) {
    console.log("POST request failed!");
    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Headers:", JSON.stringify(err.response.headers, null, 2));
      console.log("Data:", err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

checkPost();
