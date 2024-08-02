const infoHead1 = document.querySelector(".header2");
      const infoPara1 = document.querySelector(".para1");
      const animationLoader = document.querySelector(".loader");
      const downLinks = document.querySelector(".download-links-sect");
      const separator = document.querySelector(".separator");

      function toggleLoader(){
        animationLoader.style.display = "none";
      }



      // window.location.href does not work so use the below instead
      google.script.url.getLocation(function(location) {
        const urlParams = location.parameter;
        const uToken = urlParams.uulinktoken.trim();
        console.log(urlParams, uToken)
        
        google.script.run.withSuccessHandler(function (response) {
          toggleLoader();
          separator.classList.toggle("hidden");
        if (response.status === "error") {
          const contactUs = `<a href="mailto:josephalexconsulting@gmail.com?subject=Unexpected%20Error%20with%20Fetching%20Worksheet%20Files&body=${response.message}">Please Contact the Author here</a>`; // Dynamically attach a link in 'please contact the author'
          infoHead1.textContent = "Unexpected Error";
          infoHead1.classList.add("failed-header2");
          infoPara1.textContent = `An Error Occurred. `;
          infoPara1.insertAdjacentHTML("beforeend", contactUs);
          downLinks.classList.toggle("hidden");
        } else if (response.status === true) {
          infoHead1.textContent = "Fetch Completed Successfully!";
          infoHead1.classList.add("success-header2");
          infoPara1.classList.toggle("hidden");
          response.res.forEach(file => { // For appending each aTag
            downLinks.insertAdjacentHTML("beforeend", file);
          });

        } else if(response === false) {
          
          infoHead1.textContent = "Access Denied!";
          infoHead1.classList.add("failed-header2");
          const regLink = `<a href="https://thetopside.vercel.app/worksheet/the-power-of-self-discipline/Index.html" style="color:#CADCFC">Regenerate</a> another email message with a fresh token`;

          infoPara1.textContent = `You do not have the permission to access this file. Token may have expired or is incorrect.
          If you have the access code, kindly `;
          infoPara1.insertAdjacentHTML("beforeend", regLink); // beforeend means before the end of the  
          downLinks.classList.toggle("hidden");
        }

      }).authPDFreq(uToken); 
      
      
      
      })


