let emailField = document.getElementById("emailField");
      let secondemailField = document.getElementById("second-input");
      const iframe = document.querySelector("iframe");
      const submitBtn = document.getElementById("submitBtn");
      const secondSubmitBtn = document.querySelector(".sendIconButton");
      let loadSpinner = document.querySelector(".loadContainer");
      let submitBtnTxt = document.querySelector(".submitBtnTxt");
      let messagePopup = document.querySelector(".message");
      const menuLinks = document.querySelectorAll(".disabledLinks");

      // Controlling the message
      window.addEventListener("load", ()=> {messagePopup.style.display = "none"});
      let messageTimeout; // For controlling the timeout of the messagePopup
      let emailSubmittedMsg; // Message to be ent to function when email is submitted succesfully
      let linkClickMsg;


      // For diplaying a message when user clicks on disabled menu links
      menuLinks.forEach(function (menuLink){
        menuLink.addEventListener("click", function (){
          // console.log(`I, ${this.childNodes[0].textContent.trim()} was clicked`); 
          linkClickMsg = `"${this.childNodes[0].textContent.trim()}" will be Available Soon`; // We try to remove any extra element like "/ Coming Soon" as seen in the links at the footer
          runPopup(linkClickMsg); 
        })
      });
      




      // Converts any input on this field to small letters
      emailField.addEventListener("input", function () {
        this.value = this.value.toLowerCase();
      });
      secondemailField.addEventListener("input", function () {
        this.value = this.value.toLowerCase();
      });


      // Submit Data - Form 1
      function submitData() {
        const userEmail = emailField.value;
        const screenWidth = window.innerWidth;

        const data = {
          email : userEmail,
          screenWidth : screenWidth,
        };

        
        // Disable the submit button and show the loading spinner
        emailField.disabled = true;
        submitBtn.disabled = true; secondSubmitBtn.disabled = true;
        submitBtnTxt.textContent = ""; 
        loadSpinner.style.display = "inline-block";

        google.script.run // If the email was sent successfully, proceed with adding the subscriber.
          .withSuccessHandler(function (response) {
            if (response === "Sent") {
              google.script.run
                .withSuccessHandler(function (response) {
                  data.userIpAddress = response;
                  data.successOrNotProperty = "Email Sent Succesfully";
                  google.script.run.addSubscriber(data);
                })
                .getIpAddress();

            }else {
              google.script.run
                .withSuccessHandler(function (response) {
                  data.userIpAddress = response;
                  data.successOrNotProperty = "Email Not Sent";
                  google.script.run.addSubscriber(data);
                })
                .getIpAddress();
              }

            emailField.disabled = false;
            submitBtn.disabled = false; secondSubmitBtn.disabled = false; // Re-enables the submit button
            emailField.value = ""; // Clears the email input field
            loadSpinner.style.display = "none";
            submitBtnTxt.textContent = "Get E-book";
            emailSubmittedMsg = `Request submitted successfully!
                You will receive an email shortly.`;
            runPopup(emailSubmittedMsg);
          })
          .sendEmail(userEmail);
      };


      // For the second submit button at the footer
      
      // Submit Data
      function submit2ndForm() {
        const userEmail = secondemailField.value;
        const screenWidth = window.innerWidth;

        const data = {
          email : userEmail,
          screenWidth : screenWidth,
        };

        
        // Disable the submit button and show the loading spinner
        secondSubmitBtn.disabled = true; submitBtn.disabled = true;
        secondSubmitBtn.classList.toggle('sendArrowColor');
        secondemailField.disabled = true;
        loadSpinner.style.display = "inline-block";

        google.script.run // If the email was sent successfully, proceed with adding the subscriber.
          .withSuccessHandler(function (response) {
            if (response === "Sent") {
              google.script.run
                .withSuccessHandler(function (response) {
                  data.userIpAddress = response;
                  data.successOrNotProperty = "Email Sent Succesfully";
                  google.script.run.addSubscriber(data);
                })
                .getIpAddress();

            }else {
              google.script.run
                .withSuccessHandler(function (response) {
                  data.userIpAddress = response;
                  data.successOrNotProperty = "Email Not Sent";
                  google.script.run.addSubscriber(data);
                })
                .getIpAddress();
              }

            secondSubmitBtn.disabled = false; submitBtn.disabled = false; // Re-enables the submit button
            secondSubmitBtn.classList.toggle('sendArrowColor');
            secondemailField.value = ""; // Clears the email input field
            secondemailField.disabled = false;
            loadSpinner.style.display = "none";
            emailSubmittedMsg = `Request submitted successfully!
                You will receive an email shortly.`;
            runPopup(emailSubmittedMsg);
          })
          .sendEmail(userEmail);
      };
      
      
      function runPopup(info){ // Runs the popup message
          messagePopup.textContent = info;
          messagePopup.style.display = "block";
          clearTimeout(messageTimeout);
            
          setTimeout( ()=> { // JQuery Code to fade the message Popup multiple times. What a time saver
              $('.message').fadeOut("slow")
          }, 4000); // <-- time in milliseconds
        }
