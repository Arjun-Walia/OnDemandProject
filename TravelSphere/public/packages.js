const axios = require("axios");

// Replace with your actual API key and external user ID
const apiKey = "<replace_api_key>";
const externalUserId = "<replace_external_user_id>";

// Function to create a chat session
async function createChatSession() {
  try {
    const response = await axios.post(
      "https://api.on-demand.io/chat/v1/sessions",
      {
        pluginIds: [],
        externalUserId: externalUserId,
      },
      {
        headers: {
          apikey: apiKey,
        },
      }
    );
    return response.data.data.id; // Extract session ID
  } catch (error) {
    console.error("Error creating chat session:", error);
  }
}

// Function to submit a query
async function submitQuery(sessionId) {
  try {
    const response = await axios.post(
      `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`,
      {
        endpointId: "predefined-openai-gpt4o",
        query: "Put your query here",
        pluginIds: [
          "plugin-1712327325",
          "plugin-1713962163",
          "plugin-1726264175",
        ],
        responseMode: "sync",
      },
      {
        headers: {
          apikey: apiKey,
        },
      }
    );
    console.log("Query response:", response.data);
  } catch (error) {
    console.error("Error submitting query:", error);
  }
}

// Main function to execute the flow
async function main() {
  const sessionId = await createChatSession();
  if (sessionId) {
    await submitQuery(sessionId);
  }
}

main();

document
  .getElementById("search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const query = document.getElementById("search-input").value.toLowerCase();
    const packages = document.querySelectorAll(".package");

    packages.forEach((pkg) => {
      const packageName = pkg.querySelector("h2").textContent.toLowerCase();
      const packageDescription = pkg
        .querySelector("p")
        .textContent.toLowerCase();
      const packagePrice = pkg
        .querySelector("p:nth-of-type(2)")
        .textContent.toLowerCase();

      if (
        packageName.includes(query) ||
        packageDescription.includes(query) ||
        packagePrice.includes(query)
      ) {
        pkg.style.display = "block";
      } else {
        pkg.style.display = "none";
      }
    });
  });
