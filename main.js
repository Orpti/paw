const selectElement = document.querySelector("#select");
const result = document.querySelector("#result");

selectElement.addEventListener("change", async (event) => {
  const resource = [event.target.value]; // Wrap the value in an array

  const query = `
    query ($resource: [Resources]!) {
      top_trade_info {
        resources(resource: $resource) {
          best_buy_offer {
            price
          }
          best_sell_offer {
            price
            }
        }
      }
    }
  `;

  const variables = { resource };

  try {
    const response = await fetch(
      "https://api.politicsandwar.com/graphql?api_key=90c184776edcc340a2f7",
      {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ query, variables }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const json = await response.json();

    if (json.errors) {
      console.log("GraphQL Error:", json.errors);
      throw new Error(json.errors[0].message);
    }

    const priceHigh =
      json.data.top_trade_info.resources[0]?.best_buy_offer?.price;
    const priceLow =
      json.data.top_trade_info.resources[0]?.best_sell_offer?.price;

    if (priceHigh && priceLow) {
      result.innerHTML = `Best Buy Offer Price: ${priceHigh} <br> Best Sell Offer Price: ${priceLow}`;
    } else {
      result.innerHTML = "No price data found.";
    }
  } catch (error) {
    console.error(error);
    result.innerHTML = "An error occurred.";
  }
});
