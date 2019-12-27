/*******
 * Here is created a class with a constructor with two arguments
 */
class questions {
  question_id;
  output_div;
  constructor(question_id, output_div) {
    this.question_id = question_id;
    this.output_div = output_div;

    // set the api inside a div
    let outputDiv = document.getElementById(output_div);
    let requestURL = "https://cluedo.idg.se/job-questions/questions";
    let request = new XMLHttpRequest();
    request.responseType = "json";
    request.open("GET", requestURL, true);
    request.send();
    let obj = this;
    /***Function to onload and show the api **/
    request.onload = function() {
      let data = request.response;
      obj.showTitle(data[question_id], outputDiv);
      obj.showData(data[question_id]["options"], outputDiv);
    };
  }
  /***Function to show the title of the api **/
  showTitle(jsonObj, outputDiv) {
    let p = document.createElement("p");
    p.textContent = jsonObj["text"] + "🕵️‍♀️";
    outputDiv.appendChild(p);
  }
  /**
   * This function will loop through the api data and show them in my div elements.
   */
  showData(options, outputDiv) {
    // Create outer div
    let outerDiv = document.createElement("div");

    // Loop the options data object and create div elements for each data item
    for (let i = 0; i < options.length; i++) {
      let innerDiv = document.createElement("div");
      innerDiv.classList.add("block2", "block-" + this.question_id); //quetion_id is the job-title
      innerDiv.setAttribute("data-opt-name", options[i]);
      innerDiv.textContent = options[i];
      // Add a on click event to each div element

      let innerResult = document.createElement("span");
      innerResult.id = "answer-" + this.question_id + options[i];
      innerResult.classList.add("percent");

      outerDiv.appendChild(innerDiv);
      innerDiv.appendChild(innerResult);
      outputDiv.appendChild(outerDiv);
      this.addClickEvent(innerDiv, this);
    }
  }

  // uppdatera divarnas bredd här - vilken data behövs? fler argument?
  /***
   * show the data result in "%"
   */
  updateChart(data) {
    let allDivs = document.querySelectorAll(".block-" + this.question_id);
    let divsArray = Array.prototype.slice.call(allDivs);

    let i;
    for (i = 0; i < divsArray.length; i++) {
      divsArray[i].style.backgroundSize =
      data[divsArray[i].getAttribute("data-opt-name")] + "%" + "100%";
      data[divsArray[i].getAttribute("data-opt-name")] += "%";
      //span to put in "data[i]%" inside the div.

      let innerResult = document.getElementById(
        "answer-" +
          this.question_id +
          divsArray[i].getAttribute("data-opt-name")
      );
      innerResult.innerHTML = data[divsArray[i].getAttribute("data-opt-name")];
    }
  }

  addClickEvent(element, obj) {
    element.addEventListener("click", function() {
      const MyPost = {
        value: element.getAttribute("data-opt-name") // o valor da minha callback function
      };

      fetch("https://cluedo.idg.se/respond/" + obj.question_id, {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://www.idg.se"
        },
        body: JSON.stringify(MyPost) // mostra o resultado från my objects
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            return Promise.reject({
              status: res.status,
              statusText: res.statusText
            });
          }
        })
        // then() once the data is retrieved from the URL. This is what we call ‘asynchronous’ code
        .then(data => {
          const total = Object.values(data).reduce((t, n) => t + n);
          let resultData = {};
          Object.keys(data).forEach(point => {
            resultData[point] = ((100 * data[point]) / total).toFixed(2);
            // får resultad i porcent med 2 decimal
          });

          //here we show the data result to the users
          obj.updateChart(resultData);
        });
    });
  }
}
