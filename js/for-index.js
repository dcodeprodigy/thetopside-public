// Declare the variables
      let popup = document.getElementById("popup");
      let popupMessage = document.getElementById("popup-message");
      let emailField = document.getElementById("email");
      let iframe = document.querySelector("iframe");

      // Converts any input on this field to small letters
      emailField.addEventListener("input", function () {
        this.value = this.value.toLowerCase();
      });
      function showPopup(popupMessage, screenWidth) {
        if ((popup.style.display = "none")) {
          popup.style.display = "flex";
        } else {
          popup.style.display = "none";
        }
      }

      function closePopup() {
        if (popup.style.display === "flex") {
          popup.style.display = "none";
        }else{
          popup.style.display = "flex"
        }
      }

      function submitForm() {
        let email = document.getElementById("email").value;
        let screenWidth = window.innerWidth; // Get the screen width in pixels;
        let successOrNot = "Email Sent";
        let ipAddress;

        let data = {
          email: email,
          screenWidth: screenWidth,
          successOrNotProperty: successOrNot,
          userIpAddress: ipAddress,
        };

        // Disable the submit button and show the loading spinner
        document.getElementById("submitBtn").disabled = true;
        document.getElementById("loadingSpinner").style.display =
          "inline-block";

        google.script.run
          .withSuccessHandler(function (response) {
            if (response === "Sent") {
              google.script.run
                .withSuccessHandler(function (response) {
                  data.userIpAddress = response;
                  google.script.run.addSubscriber(data);
                })
                .getIpAddress();

              // If the email was sent successfully, proceed with adding the subscriber.
            } else {
              google.script.run
                .withSuccessHandler(function (response) {
                  data.userIpAddress = response;
                  data.successOrNotProperty = "Email Not Sent";
                  google.script.run.addSubscriber(data);
                })
                .getIpAddress();
              }

            // Hide the loading spinner and re-enable the submit button
            document.getElementById("loadingSpinner").style.display = "none";
            document.getElementById("submitBtn").disabled = false;

            openPopup();
            emailField.value = "";
          })
          .sendEmail(email);
      }

      // For controlling our popup

      function openPopup() {
      document.getElementById("popupBackground").style.display = "block";
      document.body.style.overflow = "hidden";
      };

      document.getElementById("closePopup").addEventListener("click", function () {
          document.getElementById("popupBackground").style.display = "none";
          document.body.style.overflow = "auto";
      });

      document.getElementById("popupBackground").addEventListener("click", function (event) {
          if (event.target === document.getElementById("popupBackground")) {
              document.getElementById("popupBackground").style.display = "none";
              document.body.style.overflow = "auto";
          }
      });
